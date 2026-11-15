import { NextResponse } from "next/server";
import { Resend } from "resend";
import { timingSafeEqual } from "node:crypto";
import { getDb } from "@/lib/db";
import {
	REGISTRATION_UPDATE_SUBJECT,
	buildEditRegistrationUrl,
	buildRegistrationUpdateHtml,
	buildRegistrationUpdateText,
	getFirstName,
	maskEmail,
} from "@/lib/email/registration-update";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const CAMPAIGN_TAG = "registration-update-2026-11";
const BATCH_SIZE = 100;
const DEFAULT_LIMIT = 500;
const MAX_LIMIT = 1000;
const BATCH_DELAY_MS = 500;
const UUID_PATTERN =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type RecipientRow = {
	id: string;
	full_name: string;
	email: string;
	created_at: string | Date;
};

type Cursor = {
	createdAt: string;
	id: string;
};

type Failure = {
	email: string;
	reason: string;
};

type BroadcastConfig = {
	apiKey: string;
	secret: string;
	from: string;
	replyTo: string;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const toIsoString = (value: string | Date) => {
	const date = value instanceof Date ? value : new Date(value);
	if (Number.isNaN(date.getTime())) throw new Error("Invalid registration date");
	return date.toISOString();
};

function readConfig(): BroadcastConfig | null {
	const apiKey = process.env.RESEND_API_KEY?.trim();
	const secret = process.env.EMAIL_BROADCAST_SECRET?.trim();
	if (!apiKey || !secret) return null;

	return {
		apiKey,
		secret,
		from:
			process.env.EMAIL_FROM?.trim() ||
			"SkillUp Imo <no-reply@mdeeg.im.gov.ng>",
		replyTo: process.env.EMAIL_REPLY_TO?.trim() || "contact@mdeeg.im.gov.ng",
	};
}

function isAuthorized(req: Request, secret: string) {
	const header = req.headers.get("authorization") ?? "";
	const provided = header.replace(/^Bearer\s+/i, "").trim();
	if (!provided) return false;

	const expectedBuffer = Buffer.from(secret);
	const providedBuffer = Buffer.from(provided);

	if (expectedBuffer.length !== providedBuffer.length) return false;
	return timingSafeEqual(expectedBuffer, providedBuffer);
}

function encodeCursor(row: RecipientRow): string {
	return Buffer.from(
		JSON.stringify({
			createdAt: toIsoString(row.created_at),
			id: row.id,
		} satisfies Cursor),
	).toString("base64url");
}

function decodeCursor(raw: unknown): Cursor | null {
	if (raw === undefined || raw === null || raw === "") return null;
	if (typeof raw !== "string") throw new Error("Invalid cursor");

	let parsed: unknown;
	try {
		parsed = JSON.parse(Buffer.from(raw, "base64url").toString("utf8"));
	} catch {
		throw new Error("Invalid cursor");
	}

	const cursor = parsed as Partial<Cursor>;
	if (
		typeof cursor.createdAt !== "string" ||
		Number.isNaN(new Date(cursor.createdAt).getTime()) ||
		typeof cursor.id !== "string" ||
		!UUID_PATTERN.test(cursor.id)
	) {
		throw new Error("Invalid cursor");
	}

	return { createdAt: cursor.createdAt, id: cursor.id };
}

function getSiteUrl(req: Request) {
	const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
	if (configured) return configured.replace(/\/+$/, "");
	return new URL(req.url).origin;
}

function getLimit(raw: unknown) {
	const value = Number(raw ?? DEFAULT_LIMIT);
	if (!Number.isFinite(value)) return DEFAULT_LIMIT;
	return Math.min(MAX_LIMIT, Math.max(1, Math.floor(value)));
}

function getEmailBody(row: RecipientRow, siteUrl: string) {
	const editUrl = buildEditRegistrationUrl(siteUrl, row.id);
	const firstName = getFirstName(row.full_name);
	return {
		editUrl,
		firstName,
		html: buildRegistrationUpdateHtml({ firstName, editUrl }),
		text: buildRegistrationUpdateText({ firstName, editUrl }),
	};
}

function emailPayload(row: RecipientRow, config: BroadcastConfig, siteUrl: string) {
	const body = getEmailBody(row, siteUrl);
	return {
		from: config.from,
		to: row.email.trim(),
		subject: REGISTRATION_UPDATE_SUBJECT,
		html: body.html,
		text: body.text,
		replyTo: config.replyTo,
		tags: [{ name: "campaign", value: CAMPAIGN_TAG }],
	};
}

async function totalRecipients() {
	const db = getDb();
	const rows = await db`
		SELECT count(*)::int AS total
		FROM registrations
		WHERE btrim(email) <> ''
	`;
	return Number(rows[0]?.total ?? 0);
}

async function countRemaining(cursor: Cursor) {
	const db = getDb();
	const rows = await db`
		SELECT count(*)::int AS remaining
		FROM registrations
		WHERE btrim(email) <> ''
		AND (created_at, id) > (${cursor.createdAt}::timestamptz, ${cursor.id}::uuid)
	`;
	return Number(rows[0]?.remaining ?? 0);
}

async function nextRecipients(limit: number, cursor: Cursor | null) {
	const db = getDb();

	if (cursor) {
		return (await db`
			SELECT id, full_name, email, created_at
			FROM registrations
			WHERE btrim(email) <> ''
			AND (created_at, id) > (${cursor.createdAt}::timestamptz, ${cursor.id}::uuid)
			ORDER BY created_at, id
			LIMIT ${limit}
		`) as RecipientRow[];
	}

	return (await db`
		SELECT id, full_name, email, created_at
		FROM registrations
		WHERE btrim(email) <> ''
		ORDER BY created_at, id
		LIMIT ${limit}
	`) as RecipientRow[];
}

async function previewResponse(config: BroadcastConfig) {
	const db = getDb();
	const total = await totalRecipients();
	const sampleRows = (await db`
		SELECT id, full_name, email, created_at
		FROM registrations
		WHERE btrim(email) <> ''
		ORDER BY created_at, id
		LIMIT 3
	`) as unknown as RecipientRow[];

	return {
		ok: true,
		mode: "preview",
		total,
		from: config.from,
		subject: REGISTRATION_UPDATE_SUBJECT,
		sample: sampleRows.map((row) => ({
			id: row.id,
			firstName: getFirstName(row.full_name),
			email: maskEmail(row.email),
		})),
	};
}

async function sendBatch(
	resend: Resend,
	payloads: ReturnType<typeof emailPayload>[],
	idempotencyKey: string,
) {
	for (let attempt = 0; attempt < 4; attempt += 1) {
		const result = await resend.batch.send(payloads, {
			batchValidation: "permissive",
			idempotencyKey,
		});

		if (!result.error) return result;

		if (result.error.statusCode === 429 && attempt < 3) {
			await sleep(1000 * 2 ** attempt);
			continue;
		}

		throw new Error(result.error.message || "Resend rejected the email batch.");
	}

	throw new Error("Resend rate limit reached. Try again later.");
}

async function sendTest(
	config: BroadcastConfig,
	req: Request,
	body: Record<string, unknown>,
) {
	const to = typeof body.to === "string" ? body.to.trim() : "";
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
		return NextResponse.json(
			{ ok: false, message: "Provide a valid `to` email address." },
			{ status: 400 },
		);
	}

	const db = getDb();
	const registrationId =
		typeof body.registrationId === "string" ? body.registrationId : "";
	let rows: RecipientRow[] = [];

	if (registrationId) {
		if (!UUID_PATTERN.test(registrationId)) {
			return NextResponse.json(
				{ ok: false, message: "Invalid registration id." },
				{ status: 400 },
			);
		}
		rows = (await db`
			SELECT id, full_name, email, created_at
			FROM registrations
			WHERE id = ${registrationId}::uuid
			LIMIT 1
		`) as RecipientRow[];
	} else {
		rows = (await db`
			SELECT id, full_name, email, created_at
			FROM registrations
			WHERE btrim(email) <> ''
			ORDER BY created_at, id
			LIMIT 1
		`) as RecipientRow[];
	}

	const sample = rows[0];
	if (!sample) {
		return NextResponse.json(
			{ ok: false, message: "No registration is available to test with." },
			{ status: 404 },
		);
	}

	const resend = new Resend(config.apiKey);
	const siteUrl = getSiteUrl(req);
	const payload = emailPayload(sample, config, siteUrl);
	const result = await resend.batch.send([{ ...payload, to }], {
		batchValidation: "permissive",
		idempotencyKey: `${CAMPAIGN_TAG}-test-${Date.now()}`,
	});

	if (result.error) {
		return NextResponse.json(
			{
				ok: false,
				message: result.error.message || "Resend rejected the test email.",
			},
			{ status: 502 },
		);
	}

	const batchErrors = result.data?.errors ?? [];
	if (batchErrors.length > 0) {
		return NextResponse.json(
			{
				ok: false,
				message: batchErrors[0]?.message || "Resend rejected the test email.",
			},
			{ status: 502 },
		);
	}

	return NextResponse.json({
		ok: true,
		mode: "test",
		sent: 1,
		to,
		firstName: getFirstName(sample.full_name),
	});
}

async function sendChunk(
	config: BroadcastConfig,
	req: Request,
	body: Record<string, unknown>,
) {
	if (body.confirm !== true) {
		return NextResponse.json(
			{
				ok: false,
				message:
					'Refusing to send. Pass { "confirm": true } to send a chunk.',
			},
			{ status: 400 },
		);
	}

	let cursor: Cursor | null;
	try {
		cursor = decodeCursor(body.cursor);
	} catch (error) {
		return NextResponse.json(
			{
				ok: false,
				message: error instanceof Error ? error.message : "Invalid cursor.",
			},
			{ status: 400 },
		);
	}

	const limit = getLimit(body.limit);
	const rows = await nextRecipients(limit, cursor);

	if (rows.length === 0) {
		return NextResponse.json({
			ok: true,
			mode: "send",
			sent: 0,
			failed: 0,
			remaining: 0,
			done: true,
			nextCursor: null,
			failures: [],
		});
	}

	const resend = new Resend(config.apiKey);
	const siteUrl = getSiteUrl(req);
	const failures: Failure[] = [];
	let sent = 0;
	let lastCompleted: RecipientRow | null = null;

	for (let index = 0; index < rows.length; index += BATCH_SIZE) {
		const batch = rows.slice(index, index + BATCH_SIZE);
		const first = batch[0];
		const last = batch[batch.length - 1];
		const idempotencyKey = `${CAMPAIGN_TAG}-${first.id}-${last.id}`;

		try {
			const result = await sendBatch(
				resend,
				batch.map((row) => emailPayload(row, config, siteUrl)),
				idempotencyKey,
			);

			const batchErrors = result.data?.errors ?? [];
			const failedIndexes = new Set(batchErrors.map((error) => error.index));

			sent += batch.length - failedIndexes.size;

			for (const error of batchErrors) {
				const row = batch[error.index];
				failures.push({
					email: row ? maskEmail(row.email) : "unknown",
					reason: error.message,
				});
			}

			lastCompleted = last;
		} catch (error) {
			const reason =
				error instanceof Error ? error.message : "Unknown delivery error";
			const nextCursor = lastCompleted ? encodeCursor(lastCompleted) : null;
			const remaining = lastCompleted
				? await countRemaining({
						createdAt: toIsoString(lastCompleted.created_at),
						id: lastCompleted.id,
					})
				: await totalRecipients();

			return NextResponse.json(
				{
					ok: false,
					mode: "send",
					sent,
					failed: failures.length,
					remaining,
					done: false,
					nextCursor,
					failures: failures.slice(0, 50),
					message: `Stopped after a batch error: ${reason}. Retry from nextCursor.`,
				},
				{ status: 502 },
			);
		}

		if (index + BATCH_SIZE < rows.length) {
			await sleep(BATCH_DELAY_MS);
		}
	}

	const lastRow = rows[rows.length - 1];
	const nextCursor = encodeCursor(lastRow);
	const remaining = await countRemaining({
		createdAt: toIsoString(lastRow.created_at),
		id: lastRow.id,
	});

	const response = {
		ok: sent > 0 || failures.length === 0,
		mode: "send",
		sent,
		failed: failures.length,
		remaining,
		done: remaining === 0,
		nextCursor: remaining === 0 ? null : nextCursor,
		failures: failures.slice(0, 50),
	};

	if (sent === 0 && failures.length > 0) {
		return NextResponse.json(
			{
				...response,
				message:
					failures[0]?.reason ||
					"Resend rejected every email in this chunk.",
			},
			{ status: 502 },
		);
	}

	return NextResponse.json(response);
}

export async function GET(req: Request) {
	const config = readConfig();
	if (!config) {
		return NextResponse.json(
			{
				ok: false,
				message:
					"Set RESEND_API_KEY and EMAIL_BROADCAST_SECRET before using this endpoint.",
			},
			{ status: 503 },
		);
	}

	if (!isAuthorized(req, config.secret)) {
		return NextResponse.json(
			{ ok: false, message: "Unauthorized." },
			{ status: 401 },
		);
	}

	try {
		return NextResponse.json(await previewResponse(config));
	} catch (error) {
		console.error("Registration update preview failed:", error);
		return NextResponse.json(
			{
				ok: false,
				message:
					error instanceof Error
						? error.message
						: "Could not load the recipient preview.",
			},
			{ status: 500 },
		);
	}
}

export async function POST(req: Request) {
	const config = readConfig();
	if (!config) {
		return NextResponse.json(
			{
				ok: false,
				message:
					"Set RESEND_API_KEY and EMAIL_BROADCAST_SECRET before using this endpoint.",
			},
			{ status: 503 },
		);
	}

	if (!isAuthorized(req, config.secret)) {
		return NextResponse.json(
			{ ok: false, message: "Unauthorized." },
			{ status: 401 },
		);
	}

	let body: Record<string, unknown> = {};
	try {
		const parsed = await req.json();
		if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
			body = parsed as Record<string, unknown>;
		}
	} catch {
		body = {};
	}

	const mode = typeof body.mode === "string" ? body.mode : "preview";

	try {
		if (mode === "preview") {
			return NextResponse.json(await previewResponse(config));
		}

		if (mode === "test") {
			return await sendTest(config, req, body);
		}

		if (mode === "send") {
			return await sendChunk(config, req, body);
		}

		return NextResponse.json(
			{
				ok: false,
				message: 'Unknown mode. Use "preview", "test" or "send".',
			},
			{ status: 400 },
		);
	} catch (error) {
		console.error("Registration update email failed:", error);
		return NextResponse.json(
			{
				ok: false,
				message:
					error instanceof Error
						? error.message
						: "The email job failed unexpectedly.",
			},
			{ status: 500 },
		);
	}
}
