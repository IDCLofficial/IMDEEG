import { readFile } from "node:fs/promises";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type PollingUnit = {
	lga: string;
	ward: string;
	name: string;
	code: string;
};

const CSV_URL = new URL("../../../../data/polling-units.csv", import.meta.url);
let cachedImoPollingUnits: Promise<PollingUnit[]> | undefined;

const normalize = (value: string) =>
	value
		.toLowerCase()
		.replace(/\([^)]*\)/g, "")
		.replace(/[^a-z0-9]/g, "");

function parseCsv(text: string, onRow: (values: string[]) => void) {
	let row: string[] = [];
	let field = "";
	let quoted = false;

	const finishRow = () => {
		row.push(field.replace(/\r$/, ""));
		if (row.some((value) => value !== "")) onRow(row);
		row = [];
		field = "";
	};

	for (let index = 0; index < text.length; index += 1) {
		const char = text[index];
		if (quoted) {
			if (char === '"' && text[index + 1] === '"') {
				field += '"';
				index += 1;
			} else if (char === '"') {
				quoted = false;
			} else {
				field += char;
			}
		} else if (char === '"') {
			quoted = true;
		} else if (char === ",") {
			row.push(field);
			field = "";
		} else if (char === "\n") {
			finishRow();
		} else {
			field += char;
		}
	}

	if (field || row.length) finishRow();
}

function loadImoPollingUnits(): Promise<PollingUnit[]> {
	if (!cachedImoPollingUnits) {
		cachedImoPollingUnits = readFile(CSV_URL, "utf8").then((text) => {
			let columnIndexes: Record<string, number> | undefined;
			const pollingUnits: PollingUnit[] = [];

			parseCsv(text.replace(/^\uFEFF/, ""), (values) => {
				if (!columnIndexes) {
					columnIndexes = Object.fromEntries(
						values.map((name, index) => [name.trim(), index]),
					);
					for (const column of [
						"state_name",
						"lga_name",
						"ward_name",
						"pu_name",
						"full_code",
					]) {
						if (columnIndexes[column] === undefined) {
							throw new Error(`Polling-unit CSV is missing ${column}.`);
						}
					}
					return;
				}

				const value = (column: string) =>
					values[columnIndexes![column]]?.trim() ?? "";
				if (value("state_name").toLowerCase() !== "imo") return;

				const lga = value("lga_name");
				const ward = value("ward_name");
				const name = value("pu_name");
				const code = value("full_code");
				if (lga && ward && name && code) {
					pollingUnits.push({ lga, ward, name, code });
				}
			});

			return pollingUnits;
		});
	}

	return cachedImoPollingUnits;
}

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const lga = searchParams.get("lga")?.trim() ?? "";
	const ward = searchParams.get("ward")?.trim() ?? "";

	try {
		const imoPollingUnits = await loadImoPollingUnits();
		const normalizedLga = normalize(lga);
		const normalizedWard = normalize(ward);
		const data = imoPollingUnits
			.filter((unit) => !normalizedLga || normalize(unit.lga) === normalizedLga)
			.filter(
				(unit) => !normalizedWard || normalize(unit.ward) === normalizedWard,
			)
			.map(({ name, code, ward: wardName }) => ({
				name,
				code,
				ward: wardName,
			}));

		return NextResponse.json({ state: "IMO", count: data.length, data });
	} catch (error) {
		console.error("Polling-unit CSV conversion failed:", error);
		return NextResponse.json(
			{ data: [], message: "Polling-unit data could not be loaded." },
			{ status: 500 },
		);
	}
}
