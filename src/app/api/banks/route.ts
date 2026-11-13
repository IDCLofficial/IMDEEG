import { NextResponse } from "next/server";

export const runtime = "nodejs";

type BankRecord = { name?: unknown };

export async function GET() {
	try {
		const response = await fetch("https://nigerianbanks.xyz/", {
			headers: { Accept: "application/json" },
			next: { revalidate: 86400 },
		});

		if (!response.ok) {
			return NextResponse.json(
				{ data: [], message: "Could not load the bank list." },
				{ status: 502 },
			);
		}

		const payload: unknown = await response.json();
		if (!Array.isArray(payload)) {
			return NextResponse.json(
				{ data: [], message: "The bank-list response was invalid." },
				{ status: 502 },
			);
		}

		const data = Array.from(
			new Set(
				(payload as BankRecord[])
					.map((bank) =>
						typeof bank?.name === "string" ? bank.name.trim() : "",
					)
					.filter(Boolean),
			),
		).sort((a, b) => a.localeCompare(b));

		return NextResponse.json({ data });
	} catch {
		return NextResponse.json(
			{ data: [], message: "Could not load the bank list." },
			{ status: 502 },
		);
	}
}
