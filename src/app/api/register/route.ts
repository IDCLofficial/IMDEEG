import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { TIME_FRAME } from "@/lib/constants";
import { registrationSchema } from "@/lib/validation";
import { isBlockedNin } from "@/lib/blockedNins";

export const runtime = "nodejs";

const n = <T>(v: T | undefined) => v ?? null;

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

	const parsed = registrationSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json(
			{ ok: false, errors: parsed.error.flatten().fieldErrors },
			{ status: 422 },
		);
	}
	const d = parsed.data;

	// Honeypot filled in: pretend it worked, store nothing.
	if (d.website)
		return NextResponse.json({ ok: true, reference: "SKILLUP-000000" });

	if (isBlockedNin(d.nin)) {
		return NextResponse.json(
			{
				ok: false,
				errors: {
					nin: [
						"This NIN has already participated in this programme and cannot register again.",
					],
				},
			},
			{ status: 409 },
		);
	}

	try {
		const db = getDb();
		const rows = await db`
      INSERT INTO registrations (
        full_name, phone_number, email, gender, age_bracket, marital_status, state_of_origin,
        nin, imssbn, local_government, town, ward, residential_address,
        selected_course, selected_center, time_frame,
        highest_qualification, course_of_study, institution, digital_skills,
        nok_name, nok_phone, nok_nin, nok_relationship
      ) VALUES (
        ${d.fullName}, ${d.phoneNumber}, ${d.email}, ${d.gender}, ${d.ageBracket},
        ${n(d.maritalStatus)}, ${n(d.stateOfOrigin)},
        ${d.nin}, ${d.imssbn}, ${d.localGovernment}, ${d.town}, ${d.ward}, ${n(d.residentialAddress)},
        ${d.selectedCourse}, ${d.selectedCenter}, ${TIME_FRAME},
        ${n(d.highestQualification)}, ${n(d.courseOfStudy)}, ${n(d.institution)}, ${n(d.digitalSkills)},
        ${n(d.nokName)}, ${n(d.nokPhone)}, ${n(d.nokNin)}, ${n(d.nokRelationship)}
      )
      RETURNING id
    `;
		const reference = "SKILLUP-" + String(rows[0].id).slice(0, 8).toUpperCase();
		return NextResponse.json({ ok: true, reference }, { status: 201 });
	} catch (err: unknown) {
		const e = err as { code?: string; constraint?: string };
		if (e?.code === "23505") {
			const field = e.constraint?.includes("imssbn") ? "imssbn" : "nin";
			const label = field === "nin" ? "NIN" : "IMSSBN";
			return NextResponse.json(
				{
					ok: false,
					errors: { [field]: [`This ${label} has already been registered.`] },
				},
				{ status: 409 },
			);
		}
		console.error("Registration insert failed:", err);
		return NextResponse.json(
			{
				ok: false,
				message: "We could not save your registration. Please try again.",
			},
			{ status: 500, ...e },
		);
	}
}
