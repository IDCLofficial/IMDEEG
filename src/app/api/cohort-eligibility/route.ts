import { NextResponse } from "next/server";
import {
	checkPreviousCohortEligibility,
	loadPreviousCohortEntries,
} from "@/lib/cohortEligibility";

export const runtime = "nodejs";

const text = (value: unknown) => (typeof value === "string" ? value : "");

export async function POST(req: Request) {
	let body: unknown;

	try {
		body = await req.json();
	} catch {
		return NextResponse.json(
			{ ok: false, message: "Invalid request." },
			{ status: 400 },
		);
	}

	const applicant = (body ?? {}) as Record<string, unknown>;

	try {
		const previousEntries = loadPreviousCohortEntries();

		const eligibilityError = checkPreviousCohortEligibility(
			{
				fullName: text(applicant.fullName),
				localGovernment: text(applicant.localGovernment),
				email: text(applicant.email),
				phoneNumber: text(applicant.phoneNumber),
				nin: text(applicant.nin),
				imssbn: text(applicant.imssbn),
			},
			previousEntries,
		);

		if (eligibilityError) {
			return NextResponse.json(
				{
					ok: false,
					errors: {
						[eligibilityError.field]: [eligibilityError.message],
					},
				},
				{ status: 409 },
			);
		}

		return NextResponse.json({ ok: true });
	} catch (error) {
		console.error("Previous cohort eligibility check failed:", error);

		return NextResponse.json(
			{
				ok: false,
				message:
					"Previous cohort records are temporarily unavailable. Please try again shortly.",
			},
			{ status: 503 },
		);
	}
}
