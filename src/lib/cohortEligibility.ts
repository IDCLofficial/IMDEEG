import fs from "node:fs";
import path from "node:path";
import * as XLSX from "xlsx";

export const COHORT_IDCL_MESSAGE =
	"We found a previous record with the same name and LGA but without the required ID numbers. Please visit IDCL to rectify this record.";

export const COHORT_INELIGIBLE_MESSAGE =
	"You are not eligible because you have already participated in a previous cohort.";

const WORKBOOK_PATH = path.join(
	process.cwd(),
	"data",
	"Skill_Up_Imo_Combined_Records.xlsx",
);

export type CohortEligibilityRecord = {
	fullName: string;
	localGovernment: string;
	email: string;
	phoneNumber: string;
	nin: string;
	imssbn: string;
};

type Applicant = Partial<CohortEligibilityRecord> & {
	name?: string;
	full_name?: string;
	local_government?: string;
	lga?: string;
	phone?: string;
	ISBM?: string;
	isbm?: string;
};

export type CohortEligibilityError = {
	field: "fullName" | "email" | "phoneNumber" | "nin" | "imssbn";
	message: string;
};

const normalizeText = (value: unknown) =>
	String(value ?? "")
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.trim()
		.replace(/[^\p{L}\p{N}]+/gu, " ")
		.replace(/\s+/g, " ")
		.toLowerCase();

const normalizeIdentifier = (value: unknown) =>
	String(value ?? "")
		.trim()
		.replace(/[^a-zA-Z0-9]/g, "")
		.toUpperCase();

const normalizePhone = (value: unknown) => {
	let digits = String(value ?? "").replace(/\D/g, "");

	if (digits.startsWith("234") && digits.length >= 13) {
		digits = digits.slice(3);
	}

	if (digits.startsWith("0") && digits.length === 11) {
		digits = digits.slice(1);
	}

	return digits;
};

const canonicalHeader = (header: unknown) =>
	String(header ?? "")
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]/g, "");

const valueFor = (row: Record<string, unknown>, names: string[]) => {
	const acceptedNames = new Set(names.map(canonicalHeader));

	for (const [header, value] of Object.entries(row)) {
		if (
			acceptedNames.has(canonicalHeader(header)) &&
			String(value ?? "").trim() !== ""
		) {
			return value;
		}
	}

	return "";
};

const getName = (record: Applicant) =>
	normalizeText(record.fullName ?? record.full_name ?? record.name);

const getLga = (record: Applicant) =>
	normalizeText(
		record.localGovernment ?? record.local_government ?? record.lga,
	);

const getEmail = (record: Applicant) => normalizeText(record.email);

const getPhone = (record: Applicant) =>
	normalizePhone(record.phoneNumber ?? record.phone);

const getNin = (record: Applicant) => normalizeIdentifier(record.nin);

const getImssbn = (record: Applicant) =>
	normalizeIdentifier(record.imssbn ?? record.ISBM ?? record.isbm);

let cachedEntries: CohortEligibilityRecord[] | undefined;
let cachedVersion: string | undefined;

export function loadPreviousCohortEntries(): CohortEligibilityRecord[] {
	if (!fs.existsSync(WORKBOOK_PATH)) {
		throw new Error(`Previous-cohort workbook was not found: ${WORKBOOK_PATH}`);
	}

	try {
		fs.accessSync(WORKBOOK_PATH, fs.constants.R_OK);

		const stat = fs.statSync(WORKBOOK_PATH);
		const version = `${stat.mtimeMs}:${stat.size}`;

		if (cachedEntries && cachedVersion === version) {
			return cachedEntries;
		}

		const workbook = XLSX.readFile(WORKBOOK_PATH);

		const rows = workbook.SheetNames.flatMap((sheetName) =>
			XLSX.utils.sheet_to_json<Record<string, unknown>>(
				workbook.Sheets[sheetName],
				{ defval: "", raw: false },
			),
		);

		cachedEntries = rows
			.map((row) => ({
				fullName: String(valueFor(row, ["full name", "name"])),
				localGovernment: String(valueFor(row, ["local government", "lga"])),
				email: String(valueFor(row, ["email"])),
				phoneNumber: String(valueFor(row, ["phone", "phone number"])),
				nin: String(valueFor(row, ["nin", "nin number", "original nin"])),
				imssbn: String(valueFor(row, ["imssbn", "imssbn number", "isbm"])),
			}))
			.filter((entry) =>
				Object.values(entry).some((value) => value.trim() !== ""),
			);

		cachedVersion = version;
		return cachedEntries;
	} catch (error) {
		console.error(
			"Unable to read previous-cohort workbook:",
			WORKBOOK_PATH,
			error,
		);

		throw new Error("Previous cohort records are temporarily unavailable.");
	}
}

export function checkPreviousCohortEligibility(
	applicant: Applicant,
	previousEntries: CohortEligibilityRecord[] = loadPreviousCohortEntries(),
): CohortEligibilityError | null {
	const identities: Array<{
		field: CohortEligibilityError["field"];
		value: string;
		read: (entry: CohortEligibilityRecord) => string;
	}> = [
		{ field: "email", value: getEmail(applicant), read: getEmail },
		{ field: "phoneNumber", value: getPhone(applicant), read: getPhone },
		{ field: "nin", value: getNin(applicant), read: getNin },
		{ field: "imssbn", value: getImssbn(applicant), read: getImssbn },
	];

	for (const identity of identities) {
		if (
			identity.value &&
			previousEntries.some((entry) => identity.read(entry) === identity.value)
		) {
			return {
				field: identity.field,
				message: COHORT_INELIGIBLE_MESSAGE,
			};
		}
	}

	const name = getName(applicant);
	const lga = getLga(applicant);

	if (!name || !lga) {
		return null;
	}

	const requiresIdclVisit = previousEntries.some(
		(entry) =>
			getName(entry) === name &&
			getLga(entry) === lga &&
			!getNin(entry) &&
			!getImssbn(entry),
	);

	return requiresIdclVisit
		? {
				field: "fullName",
				message: COHORT_IDCL_MESSAGE,
			}
		: null;
}
