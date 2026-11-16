#!/usr/bin/env node
/**
 * One-shot sender for the "Complete your SkillUp Imo registration" campaign.
 *
 * Drives POST /api/email/registration-update until every recipient has been
 * handled, following the cursor the endpoint returns. Safe by default: without
 * `--send` it only reads the preview and prints the audience.
 *
 * Usage:
 *   node --env-file=.env.local scripts/send-registration-update-all.mjs
 *   node --env-file=.env.local scripts/send-registration-update-all.mjs --test you@example.com
 *   node --env-file=.env.local scripts/send-registration-update-all.mjs --send --limit 50 --max-requests 1
 *   node --env-file=.env.local scripts/send-registration-update-all.mjs --send
 *
 * Flags:
 *   --send                 Actually deliver. Without it the script is read-only.
 *   --audience <value>     all (default) | unsent | pending.
 *                          `all` includes completed registrations, `unsent`
 *                          skips anyone this campaign already delivered to.
 *   --limit <n>            Recipients per request, 1-1000 (default 500).
 *   --max-requests <n>     Hard stop after n send requests (smoke tests).
 *   --test <email>         Send one real email to <email> and exit.
 *   --url <baseUrl>        Defaults to NEXT_PUBLIC_SITE_URL.
 *   --secret <secret>      Defaults to EMAIL_BROADCAST_SECRET.
 *   --resume <ledger>      Continue from a previous run's ledger file.
 *   --help                 Show this message.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const CAMPAIGN = "registration-update-2026-11";
const DEFAULT_AUDIENCE = "all";
const AUDIENCES = ["all", "unsent", "pending"];
const DEFAULT_LIMIT = 500;
const MAX_LIMIT = 1000;
const REQUEST_TIMEOUT_MS = 6 * 60 * 1000;
const MAX_RETRIES = 5;
const LEDGER_DIR = path.join("data", "email-runs");

const HELP = `Send the SkillUp Imo registration-update email.

Usage:
  node --env-file=.env.local scripts/send-registration-update-all.mjs [options]

Options:
  --send                Deliver the emails (default is a read-only preview).
  --audience <value>    all | unsent | pending   (default: ${DEFAULT_AUDIENCE})
  --limit <n>           Recipients per request, 1-${MAX_LIMIT} (default: ${DEFAULT_LIMIT})
  --max-requests <n>    Stop after n send requests.
  --test <email>        Send one real email to <email> and exit.
  --url <baseUrl>       Override NEXT_PUBLIC_SITE_URL.
  --secret <secret>     Override EMAIL_BROADCAST_SECRET.
  --resume <ledger>     Continue a previous run from its ledger file.
  --help                Show this message.`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function fail(message, code = 1) {
	console.error(`\n✖ ${message}`);
	process.exit(code);
}

function parseArgs(argv) {
	const options = {
		send: false,
		audience: DEFAULT_AUDIENCE,
		limit: DEFAULT_LIMIT,
		maxRequests: Infinity,
		test: null,
		url: null,
		secret: null,
		resume: null,
		help: false,
	};

	for (let index = 0; index < argv.length; index += 1) {
		const arg = argv[index];
		const nextValue = () => {
			const value = argv[index + 1];
			if (value === undefined || value.startsWith("--")) {
				fail(`Missing value for ${arg}.`, 2);
			}
			index += 1;
			return value;
		};

		switch (arg) {
			case "--send":
				options.send = true;
				break;
			case "--audience":
				options.audience = nextValue().trim().toLowerCase();
				break;
			case "--limit":
				options.limit = Number(nextValue());
				break;
			case "--max-requests":
				options.maxRequests = Number(nextValue());
				break;
			case "--test":
				options.test = nextValue().trim();
				break;
			case "--url":
				options.url = nextValue().trim();
				break;
			case "--secret":
				options.secret = nextValue().trim();
				break;
			case "--resume":
				options.resume = nextValue().trim();
				break;
			case "--help":
			case "-h":
				options.help = true;
				break;
			default:
				fail(`Unknown option: ${arg}\n\n${HELP}`, 2);
		}
	}

	return options;
}

function resolveConfig(options) {
	const baseUrl = (
		options.url ||
		process.env.NEXT_PUBLIC_SITE_URL ||
		""
	).replace(/\/+$/, "");
	const secret = options.secret || process.env.EMAIL_BROADCAST_SECRET || "";

	if (!baseUrl) {
		fail(
			"No site URL. Set NEXT_PUBLIC_SITE_URL or pass --url https://example.com.",
			2,
		);
	}
	if (!secret) {
		fail("No broadcast secret. Set EMAIL_BROADCAST_SECRET or pass --secret.", 2);
	}
	if (!AUDIENCES.includes(options.audience)) {
		fail(
			`Invalid --audience "${options.audience}". Use one of: ${AUDIENCES.join(", ")}.`,
			2,
		);
	}
	if (!Number.isFinite(options.limit) || options.limit < 1) {
		fail("--limit must be a positive number.", 2);
	}
	if (options.limit > MAX_LIMIT) {
		console.warn(`--limit capped at ${MAX_LIMIT} (the endpoint's maximum).`);
		options.limit = MAX_LIMIT;
	}
	if (
		options.maxRequests !== Infinity &&
		(!Number.isFinite(options.maxRequests) || options.maxRequests < 1)
	) {
		fail("--max-requests must be a positive number.", 2);
	}

	return {
		baseUrl,
		secret,
		audience: options.audience,
		limit: Math.floor(options.limit),
		maxRequests: Number.isFinite(options.maxRequests)
			? Math.floor(options.maxRequests)
			: Infinity,
	};
}

async function callApi(config, { method, pathName, body }) {
	const url = `${config.baseUrl}${pathName}`;
	const headers = {
		Authorization: `Bearer ${config.secret}`,
	};
	if (body !== undefined) headers["Content-Type"] = "application/json";

	const response = await fetch(url, {
		method,
		headers,
		body: body === undefined ? undefined : JSON.stringify(body),
		signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
	});

	const raw = await response.text();
	let payload;
	try {
		payload = raw ? JSON.parse(raw) : {};
	} catch {
		payload = { ok: false, message: raw.slice(0, 300) };
	}

	return {
		status: response.status,
		ok: response.ok,
		retryAfter: Number(response.headers.get("retry-after") ?? 0),
		payload,
	};
}

function isRetryable(response) {
	return (
		response.status === 429 ||
		response.status === 408 ||
		response.status === 500 ||
		response.status === 502 ||
		response.status === 503 ||
		response.status === 504
	);
}

/**
 * A 502 that still carries a nextCursor means the endpoint delivered part of
 * the chunk and told us where to pick up. That is progress, not a hard failure.
 */
function isPartialFailure(response) {
	return (
		(response.status === 502 || response.status === 500) &&
		typeof response.payload?.nextCursor === "string" &&
		response.payload.nextCursor.length > 0
	);
}

async function withRetries(config, request, label) {
	for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
		let response;
		try {
			response = await callApi(config, request);
		} catch (error) {
			if (attempt === MAX_RETRIES) throw error;
			const delay = 1000 * 2 ** attempt;
			console.warn(
				`  ${label}: network error (${error.message}). Retrying in ${delay / 1000}s.`,
			);
			await sleep(delay);
			continue;
		}

		if (response.ok || isPartialFailure(response)) return response;

		const retryable = isRetryable(response);
		if (!retryable || attempt === MAX_RETRIES) return response;

		const backoff = Math.max(
			response.retryAfter * 1000,
			1000 * 2 ** attempt,
		);
		console.warn(
			`  ${label}: HTTP ${response.status}${
				response.payload?.message ? ` (${response.payload.message})` : ""
			}. Retrying in ${Math.round(backoff / 1000)}s.`,
		);
		await sleep(backoff);
	}

	throw new Error(`${label}: exhausted retries.`);
}

function previewLine(preview) {
	const count = preview.audienceCount ?? preview.pending ?? 0;
	return [
		`Audience     ${preview.audience}`,
		`Recipients   ${count}`,
		`  total      ${preview.total}`,
		`  pending    ${preview.pending}`,
		`  completed  ${preview.completed}`,
		`  emailed    ${preview.alreadyEmailed}`,
		`From         ${preview.from}`,
		`Subject      ${preview.subject}`,
	];
}

function formatCount(value) {
	return Number(value ?? 0).toLocaleString("en-US");
}

async function writeLedger(ledger) {
	await mkdir(LEDGER_DIR, { recursive: true });
	const { file, ...data } = ledger;
	await writeFile(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

async function readLedger(file) {
	const raw = await readFile(file, "utf8");
	const parsed = JSON.parse(raw);
	if (!parsed || typeof parsed !== "object") {
		throw new Error(`${file} is not a valid ledger.`);
	}
	return {
		file,
		audience: parsed.audience,
		url: parsed.url,
		startedAt: parsed.startedAt,
		updatedAt: parsed.updatedAt,
		sent: Number(parsed.sent ?? 0),
		failed: Number(parsed.failed ?? 0),
		failures: Array.isArray(parsed.failures) ? parsed.failures : [],
		nextCursor: parsed.nextCursor ?? null,
		done: Boolean(parsed.done),
	};
}

function newLedgerFilePath() {
	const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
	return path.join(LEDGER_DIR, `${CAMPAIGN}-${stamp}.json`);
}

async function sendTest(config, email) {
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		fail(`"${email}" is not a valid email address.`, 2);
	}

	console.log(`Sending one test email to ${email} …`);
	const response = await withRetries(
		config,
		{ method: "POST", pathName: "/api/email/registration-update", body: { mode: "test", to: email } },
		"test",
	);

	if (!response.ok || response.payload?.ok !== true) {
		fail(response.payload?.message || `Test failed with HTTP ${response.status}.`);
	}

	console.log(
		`✔ Test sent. Check ${email} (and the Resend dashboard) before the real run.`,
	);
}

async function main() {
	const options = parseArgs(process.argv.slice(2));

	if (options.help) {
		console.log(HELP);
		return;
	}

	const config = resolveConfig(options);

	console.log(`Campaign  ${CAMPAIGN}`);
	console.log(`Endpoint  ${config.baseUrl}/api/email/registration-update`);

	if (options.test) {
		await sendTest(config, options.test);
		return;
	}

	// 1. Read-only preview. This also verifies URL + secret + deployment.
	const previewResponse = await withRetries(
		config,
		{
			method: "GET",
			pathName: `/api/email/registration-update?audience=${encodeURIComponent(config.audience)}`,
		},
		"preview",
	);

	if (!previewResponse.ok) {
		fail(
			`Preview failed with HTTP ${previewResponse.status}: ${
				previewResponse.payload?.message || "unknown error"
			}`,
		);
	}

	const preview = previewResponse.payload;
	for (const line of previewLine(preview)) console.log(line);
	console.log("\nSample");
	for (const person of preview.sample ?? []) {
		console.log(`  ${person.firstName.padEnd(18)} ${person.email}`);
	}

	if (!options.send) {
		console.log(
			`\nDry run — nothing sent. Re-run with --send to deliver to ${formatCount(
				preview.audienceCount,
			)} recipients.`,
		);
		return;
	}

	// 2. Load or create the ledger so an interrupted run never re-sends.
	let ledger;
	if (options.resume) {
		ledger = await readLedger(options.resume);
		if (ledger.audience && ledger.audience !== config.audience) {
			console.warn(
				`\nThis ledger used audience "${ledger.audience}", not "${config.audience}".`,
			);
			console.warn(
				`Continuing with "${ledger.audience}" so already-sent rows are not repeated.`,
			);
			config.audience = ledger.audience;
		}
	} else {
		ledger = {
			file: newLedgerFilePath(),
			audience: config.audience,
			url: config.baseUrl,
			startedAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			sent: 0,
			failed: 0,
			failures: [],
			nextCursor: null,
			done: false,
		};
	}

	console.log(`\nSending to ${formatCount(preview.audienceCount)} recipients.`);
	console.log(`Ledger    ${ledger.file}`);
	if (ledger.sent > 0) {
		console.log(
			`Resuming  ${formatCount(ledger.sent)} already sent in this run.`,
		);
	}

	let cursor = ledger.nextCursor;
	const startedAt = Date.now();
	let requests = 0;
	let lastError = null;

	// 3. Walk the cursor until the endpoint reports the audience is exhausted.
	while (requests < config.maxRequests) {
		const requestStartedAt = Date.now();
		let response;
		try {
			response = await withRetries(
				config,
				{
					method: "POST",
					pathName: "/api/email/registration-update",
					body: {
						mode: "send",
						confirm: true,
						audience: config.audience,
						limit: config.limit,
						cursor,
					},
				},
				`send#${requests + 1}`,
			);
		} catch (error) {
			lastError = error;
			break;
		}

		requests += 1;
		const payload = response.payload ?? {};

		ledger.sent += Number(payload.sent ?? 0);
		ledger.failed += Number(payload.failed ?? 0);
		if (Array.isArray(payload.failures)) {
			ledger.failures.push(...payload.failures);
			if (ledger.failures.length > 1000) {
				ledger.failures = ledger.failures.slice(-1000);
			}
		}
		ledger.nextCursor = payload.nextCursor ?? null;
		ledger.updatedAt = new Date().toISOString();
		ledger.done = Boolean(payload.done);
		await writeLedger(ledger);

		const remaining = Number(payload.remaining ?? 0);
		const elapsed = (Date.now() - startedAt) / 1000;
		const rate = ledger.sent > 0 ? ledger.sent / elapsed : 0;
		const eta =
			rate > 0 && remaining > 0
				? ` · ~${Math.ceil(remaining / rate / 60)} min left`
				: "";

		console.log(
			`[${String(requests).padStart(2)}] sent ${formatCount(ledger.sent)} · failed ${formatCount(
				ledger.failed,
			)} · remaining ${formatCount(remaining)}${eta} (${Math.round(
				(Date.now() - requestStartedAt) / 1000,
			)}s)`,
		);

		if (!payload.ok && !payload.nextCursor) {
			lastError = new Error(
				payload.message || `HTTP ${response.status} with no cursor to resume from.`,
			);
			break;
		}

		if (ledger.done || !ledger.nextCursor) {
			ledger.done = true;
			await writeLedger(ledger);
			break;
		}

		if (ledger.nextCursor === cursor && Number(payload.sent ?? 0) === 0) {
			lastError = new Error(
				"The endpoint returned the same cursor without sending anything.",
			);
			break;
		}

		cursor = ledger.nextCursor;
	}

	// 4. Summary.
	const minutes = ((Date.now() - startedAt) / 60000).toFixed(1);
	console.log("\n────────────────────────────────────────");
	console.log(`Sent      ${formatCount(ledger.sent)}`);
	console.log(`Failed    ${formatCount(ledger.failed)}`);
	console.log(`Elapsed   ${minutes} min`);
	console.log(`Ledger    ${ledger.file}`);

	if (ledger.failures.length > 0) {
		console.log("\nFirst failures");
		for (const failure of ledger.failures.slice(0, 10)) {
			console.log(`  ${failure.email} — ${failure.reason}`);
		}
	}

	if (ledger.done && ledger.failed === 0) {
		console.log("\n✔ Campaign complete. Every recipient was accepted by Resend.");
		return;
	}

	if (lastError) {
		console.log(`\n✖ Stopped early: ${lastError.message}`);
	} else if (!ledger.done) {
		console.log(
			`\n■ Paused at the --max-requests limit (${formatCount(
				Number(ledger.sent + ledger.failed),
			)} handled). Ledger saved.`,
		);
	} else {
		console.log("\n■ Finished with some failures. Failed recipients stay unsent.");
	}

	console.log(
		`\nResume with:\n  node --env-file=.env.local scripts/send-registration-update-all.mjs --send --resume "${ledger.file}"\n` +
			`Or retry only the remaining rows:\n  node --env-file=.env.local scripts/send-registration-update-all.mjs --send --audience unsent`,
	);
	process.exitCode = 1;
}

main().catch((error) => {
	fail(error instanceof Error ? error.message : String(error));
});
