import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { TIME_FRAME } from "@/lib/constants";
import { registrationSchema } from "@/lib/validation";
import { isBlockedNin } from "@/lib/blockedNins";
import {
	checkPreviousCohortEligibility,
	loadPreviousCohortEntries,
} from "@/lib/cohortEligibility";
import { sendRegistrationConfirmation } from "@/lib/email/registration-confirmation";

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

	const cohortEligibilityError = checkPreviousCohortEligibility(
		d,
		loadPreviousCohortEntries(),
	);
	if (cohortEligibilityError) {
		return NextResponse.json(
			{
				ok: false,
				errors: {
					[cohortEligibilityError.field]: [cohortEligibilityError.message],
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
		polling_unit,
        selected_course, selected_center, time_frame,
        has_disability, disability_type,
		bank_name, account_number,
        highest_qualification, course_of_study, institution, digital_skills,
        nok_name, nok_phone, nok_nin, nok_relationship,
        completed_registration
      ) VALUES (
        ${d.fullName}, ${d.phoneNumber}, ${d.email}, ${d.gender}, ${d.ageBracket},
        ${n(d.maritalStatus)}, ${n(d.stateOfOrigin)},
        ${d.nin}, ${d.imssbn}, ${d.localGovernment}, ${d.town}, ${d.ward}, ${n(d.residentialAddress)},
		${n(d.pollingUnit)},
        ${d.selectedCourse}, ${d.selectedCenter}, ${TIME_FRAME},
        ${d.hasDisability}, ${n(d.disabilityType)},
		${n(d.bankName)}, ${n(d.accountNumber)},
        ${n(d.highestQualification)}, ${n(d.courseOfStudy)}, ${n(d.institution)}, ${n(d.digitalSkills)},
        ${n(d.nokName)}, ${n(d.nokPhone)}, ${n(d.nokNin)}, ${n(d.nokRelationship)},
        TRUE
      )
      RETURNING id
    `;
		const reference = "SKILLUP-" + String(rows[0].id).slice(0, 8).toUpperCase();
		const registrationId = String(rows[0].id);

		let emailResult;
		try {
			emailResult = await sendRegistrationConfirmation({
				id: registrationId,
				fullName: d.fullName,
				email: d.email,
				reference,
				center: d.selectedCenter,
			});
		} catch (error) {
			// Unhandled exception from Resend / timeout / network → roll back
			await db`DELETE FROM registrations WHERE id = ${registrationId}::uuid`;
			console.error(
				"Registration insert failed after email error; rolled back",
				error,
			);
			return NextResponse.json(
				{
					ok: false,
					message:
						"We could not send your confirmation email. Please try again.",
				},
				{ status: 502 },
			);
		}

		if (emailResult.ok) {
			// Email accepted — mark as confirmed.
			await db`
      UPDATE registrations
      SET email_confirmed = TRUE
      WHERE id = ${registrationId}::uuid
    `;
			return NextResponse.json(
				{ ok: true, reference },
				{ status: 201 },
			);
		}

		if (emailResult.skipped) {
			// No RESEND_API_KEY configured — register the user but keep
			// email_confirmed FALSE so the admin broadcast can send later.
			console.error(
				"Registration confirmation email skipped: RESEND_API_KEY is not set."
			);
			// Do NOT set email_confirmed; keep the row as-is.
			return NextResponse.json(
				{ ok: true, reference },
				{ status: 201 },
			);
		}

		// Email send failed (not skipped) — remove the registration so the user is
		// not recorded without a confirmed email.
		await db`DELETE FROM registrations WHERE id = ${registrationId}::uuid`;
		console.error(
			"Registration confirmation email failed:",
			emailResult.error,
		);
		return NextResponse.json(
			{
				ok: false,
				message:
					"We could not send your confirmation email. Please try again.",
			},
			{ status: 502 },
		);
	} catch (err: unknown) {
		const e = err as { code?: string; constraint?: string };
		if (e?.code === "23505") {
			const duplicateFields: Record<string, { field: string; label: string }> =
				{
					registrations_nin_key: { field: "nin", label: "NIN" },
					registrations_imssbn_key: { field: "imssbn", label: "IMSSBN" },
					registrations_email_key: { field: "email", label: "Email address" },
					registrations_phone_number_key: {
						field: "phoneNumber",
						label: "Phone number",
					},
					registrations_bank_account_key: {
						field: "accountNumber",
						label: "Account number for this bank",
					},
				};
			const duplicate = e.constraint
				? duplicateFields[e.constraint]
				: undefined;
			if (!duplicate) {
				return NextResponse.json(
					{
						ok: false,
						message: "This registration conflicts with an existing record.",
					},
					{ status: 409 },
				);
			}
			return NextResponse.json(
				{
					ok: false,
					errors: {
						[duplicate.field]: [
							`This ${duplicate.label} has already been registered.`,
						],
					},
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
