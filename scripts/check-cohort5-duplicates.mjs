import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import XLSX from "xlsx";

const DEFAULT_FILE = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	"WEBSITE DATA.xlsx",
);

const NAME_KEYS = [
	"name",
	"Name",
	"NAME",
	"full_name",
	"Full Name",
	"participant_name",
	"Participant Name",
	"Participant's Full Name",
	"participant's full name",
];
const LGA_KEYS = [
	"lga",
	"LGA",
	"local_government",
	"Local Government Area",
	"local government",
	"local government area",
];
const EMAIL_KEYS = [
	"email",
	"Email",
	"EMAIL",
	"email_address",
	"Email Address",
	"email address (optional)",
	"Email Address (Optional)",
];
const NIN_KEYS = ["nin", "NIN", "national_id_number"];
const ISBM_KEYS = [
	"isbm",
	"ISBM",
	"imssbn",
	"IMSSBN",
	"isbm_number",
	"ISBM Number",
	"imssbn_number",
];
const COHORT_KEYS = ["cohort", "Cohort", "cohort_name", "Cohort Name"];

export function normalizeName(value) {
	if (value === null || value === undefined) return "";
	return String(value)
		.trim()
		.replace(/\s+/g, " ")
		.replace(/\s*,\s*/g, ", ")
		.toLowerCase();
}

export function normalizeLga(value) {
	if (value === null || value === undefined) return "";
	return String(value)
		.trim()
		.replace(/[\-/_.]+/g, " ")
		.replace(/\s+/g, " ")
		.toUpperCase();
}

function getField(row, keys) {
	for (const key of keys) {
		if (
			Object.prototype.hasOwnProperty.call(row, key) &&
			row[key] !== undefined &&
			row[key] !== null
		) {
			return row[key];
		}
	}

	const lowerKeyMap = {};
	for (const field of Object.keys(row)) {
		lowerKeyMap[String(field).trim().toLowerCase()] = row[field];
	}

	for (const key of keys.map((item) => String(item).trim().toLowerCase())) {
		if (Object.prototype.hasOwnProperty.call(lowerKeyMap, key)) {
			return lowerKeyMap[key];
		}
	}

	return "";
}

function safeText(value) {
	if (value === null || value === undefined) return "";
	return String(value).trim();
}

function matchesCohort(row, requiredCohort) {
	if (!requiredCohort) return true;
	const cohortValue = safeText(getField(row, COHORT_KEYS));
	if (!cohortValue) {
		return true;
	}

	return cohortValue
		.toLowerCase()
		.includes(String(requiredCohort).toLowerCase());
}

export function isMissingIdentity(row) {
	const email = safeText(getField(row, EMAIL_KEYS));
	const nin = safeText(getField(row, NIN_KEYS));
	const isbm = safeText(getField(row, ISBM_KEYS));

	return !email && !nin && !isbm;
}

export function findDuplicateEntries(rows, requiredCohort = "Cohort 5") {
	const availableCohortData = rows.some((row) => {
		const candidate = safeText(getField(row, COHORT_KEYS));
		return Boolean(candidate);
	});

	const cohortRows = rows.filter((row) => {
		if (!availableCohortData || !requiredCohort) return true;
		return matchesCohort(row, requiredCohort);
	});

	const groupedRows = cohortRows.filter((row) => {
		const name = normalizeName(getField(row, NAME_KEYS));
		const lga = normalizeLga(getField(row, LGA_KEYS));
		return Boolean(name && lga);
	});
	const groups = new Map();

	for (const row of groupedRows) {
		const name = normalizeName(getField(row, NAME_KEYS));
		const lga = normalizeLga(getField(row, LGA_KEYS));

		if (!name || !lga) continue;

		const key = `${name}|${lga}`;
		if (!groups.has(key)) {
			groups.set(key, []);
		}
		groups.get(key).push(row);
	}

	const flagged = [];
	for (const group of groups.values()) {
		if (group.length > 1) {
			flagged.push(...group);
		}
	}

	return flagged;
}

function readWorkbookRows(filePath) {
	const workbook = XLSX.read(fs.readFileSync(filePath), { type: "buffer" });
	const sheet = workbook.Sheets[workbook.SheetNames[0]];
	const rows = XLSX.utils.sheet_to_json(sheet, { defval: "", raw: false });
	return rows;
}

function printRow(row, index) {
	const name = safeText(getField(row, NAME_KEYS));
	const lga = safeText(getField(row, LGA_KEYS));
	const email = safeText(getField(row, EMAIL_KEYS));
	const nin = safeText(getField(row, NIN_KEYS));
	const isbm = safeText(getField(row, ISBM_KEYS));
	const cohort = safeText(getField(row, COHORT_KEYS));

	console.log(
		`${index + 1}. Name: ${name || "N/A"} | LGA: ${lga || "N/A"} | Cohort: ${cohort || "N/A"} | Email: ${email || "missing"} | NIN: ${nin || "missing"} | ISBM: ${isbm || "missing"}`,
	);
}

export function main() {
	const inputPath = process.argv[2]
		? path.resolve(process.argv[2])
		: DEFAULT_FILE;

	if (!fs.existsSync(inputPath)) {
		throw new Error(`Workbook not found: ${inputPath}`);
	}

	const rows = readWorkbookRows(inputPath);
	const flagged = findDuplicateEntries(rows, "Cohort 5");

	if (!flagged.length) {
		console.log(
			`No duplicate entries were found for Cohort 5 with blank Email, NIN and ISBM values in ${inputPath}`,
		);
		return;
	}

	console.log(
		`Flagged ${flagged.length} duplicate records for Cohort 5 (missing Email, NIN and ISBM):`,
	);
	flagged.forEach((row, index) => printRow(row, index));
}

if (import.meta.url === `file://${process.argv[1]}`) {
	try {
		main();
	} catch (error) {
		console.error(error instanceof Error ? error.message : String(error));
		process.exitCode = 1;
	}
}
