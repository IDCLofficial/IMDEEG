import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { ALL_COURSES, DISABILITY_COURSES, LEGACY_COURSES } from "@/lib/constants";
import { registrationSchema } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID_PATTERN =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const n = <T>(value: T | undefined) => value ?? null;

const referenceFor = (id: string) =>
	"SKILLUP-" + String(id).slice(0, 8).toUpperCase();

export async function GET(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;

	if (!UUID_PATTERN.test(id)) {
		return NextResponse.json(
			{ ok: false, message: "Invalid registration id." },
			{ status: 400 },
		);
	}

	try {
		const db = getDb();
		const rows = await db`
			SELECT
				id, full_name, phone_number, email, gender, age_bracket, marital_status,
				state_of_origin, nin, imssbn, local_government, town, ward, polling_unit,
				residential_address, selected_course, selected_center, time_frame,
				has_disability, disability_type, bank_name, account_number,
				highest_qualification, course_of_study, institution, digital_skills,
				nok_name, nok_phone, nok_nin, nok_relationship, status, created_at,
				email_confirmed, completed_registration
			FROM registrations
			WHERE id = ${id}::uuid
			LIMIT 1
		`;

		const row = rows[0];
		if (!row) {
			return NextResponse.json(
				{ ok: false, message: "Registration not found." },
				{ status: 404 },
			);
		}

		return NextResponse.json({
			ok: true,
			registration: {
				id: row.id,
				fullName: row.full_name ?? "",
				phoneNumber: row.phone_number ?? "",
				email: row.email ?? "",
				gender: row.gender ?? "",
				ageBracket: row.age_bracket ?? "",
				maritalStatus: row.marital_status ?? "",
				stateOfOrigin: row.state_of_origin ?? "Imo",
				nin: row.nin ?? "",
				imssbn: row.imssbn ?? "",
				localGovernment: row.local_government ?? "",
				town: row.town ?? "",
				ward: row.ward ?? "",
				pollingUnit: row.polling_unit ?? "",
				residentialAddress: row.residential_address ?? "",
				selectedCourse: row.selected_course ?? "",
				selectedCenter: row.selected_center ?? "",
				timeFrame: row.time_frame ?? "",
				hasDisability: row.has_disability ?? "",
				disabilityType: row.disability_type ?? "",
				bankName: row.bank_name ?? "",
				accountNumber: row.account_number ?? "",
				highestQualification: row.highest_qualification ?? "",
				courseOfStudy: row.course_of_study ?? "",
				institution: row.institution ?? "",
				digitalSkills: row.digital_skills ?? "",
				nokName: row.nok_name ?? "",
				nokPhone: row.nok_phone ?? "",
				nokNin: row.nok_nin ?? "",
				nokRelationship: row.nok_relationship ?? "",
				status: row.status ?? "pending",
				emailConfirmed: Boolean(row.email_confirmed),
				completedRegistration: Boolean(row.completed_registration),
				reference: referenceFor(row.id),
			},
		});
	} catch (error) {
		console.error("Error loading registration:", error);
		return NextResponse.json(
			{ ok: false, message: "Failed to load this registration." },
			{ status: 500 },
		);
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;

	if (!UUID_PATTERN.test(id)) {
		return NextResponse.json(
			{ ok: false, message: "Invalid registration id." },
			{ status: 400 },
		);
	}

	let body: unknown;
	try {
		body = await req.json();
	} catch {
		return NextResponse.json(
			{ ok: false, message: "Invalid request." },
			{ status: 400 },
		);
	}

	if (!body || typeof body !== "object" || Array.isArray(body)) {
		return NextResponse.json(
			{ ok: false, message: "Invalid request." },
			{ status: 400 },
		);
	}

	const input = body as Record<string, unknown>;
	const selectedCourse =
		typeof input.selectedCourse === "string" ? input.selectedCourse.trim() : "";
	const isLegacyCourse = (LEGACY_COURSES as readonly string[]).includes(
		selectedCourse,
	);

	// Legacy course names are no longer in the public course list. Swap in a
	// valid course only for validation, then save the learner's original value.
	const validationCourse = isLegacyCourse
		? input.hasDisability === "Yes"
			? DISABILITY_COURSES[0]
			: ALL_COURSES[0]
		: input.selectedCourse;

	const parsed = registrationSchema.safeParse({
		...input,
		selectedCourse: validationCourse,
	});

	if (!parsed.success) {
		return NextResponse.json(
			{ ok: false, errors: parsed.error.flatten().fieldErrors },
			{ status: 422 },
		);
	}

	const d = parsed.data;
	const courseToSave = isLegacyCourse ? selectedCourse : d.selectedCourse;

	try {
		const db = getDb();
		const rows = await db`
			UPDATE registrations SET
				full_name = ${d.fullName},
				phone_number = ${d.phoneNumber},
				email = ${d.email},
				gender = ${d.gender},
				age_bracket = ${d.ageBracket},
				marital_status = ${n(d.maritalStatus)},
				state_of_origin = ${n(d.stateOfOrigin)},
				nin = ${d.nin},
				imssbn = ${d.imssbn},
				local_government = ${d.localGovernment},
				town = ${d.town},
				ward = ${d.ward},
				polling_unit = ${n(d.pollingUnit)},
				residential_address = ${n(d.residentialAddress)},
				selected_course = ${courseToSave},
				selected_center = ${d.selectedCenter},
				has_disability = ${d.hasDisability},
				disability_type = ${n(d.disabilityType)},
				highest_qualification = ${n(d.highestQualification)},
				course_of_study = ${n(d.courseOfStudy)},
				institution = ${n(d.institution)},
				digital_skills = ${n(d.digitalSkills)},
				bank_name = ${n(d.bankName)},
				account_number = ${n(d.accountNumber)},
				nok_name = ${n(d.nokName)},
				nok_phone = ${n(d.nokPhone)},
				nok_nin = ${n(d.nokNin)},
				nok_relationship = ${n(d.nokRelationship)},
				completed_registration = TRUE,
				updated_at = now()
			WHERE id = ${id}::uuid
			RETURNING id
		`;

		if (rows.length === 0) {
			return NextResponse.json(
				{ ok: false, message: "Registration not found." },
				{ status: 404 },
			);
		}

		return NextResponse.json({
			ok: true,
			reference: referenceFor(rows[0].id),
		});
	} catch (error: unknown) {
		const e = error as { code?: string; constraint?: string };
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

			if (duplicate) {
				return NextResponse.json(
					{
						ok: false,
						errors: {
							[duplicate.field]: [
								`This ${duplicate.label} is already used by another registration.`,
							],
						},
					},
					{ status: 409 },
				);
			}

			return NextResponse.json(
				{
					ok: false,
					message: "This update conflicts with an existing record.",
				},
				{ status: 409 },
			);
		}

		console.error("Registration update failed:", error);
		return NextResponse.json(
			{
				ok: false,
				message: "We could not save your changes. Please try again.",
			},
			{ status: 500 },
		);
	}
}
