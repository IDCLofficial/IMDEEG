import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);

		const email = searchParams.get("email")?.trim() || null;
		const phone = searchParams.get("phone")?.trim() || null;

		if (!email && !phone) {
			return NextResponse.json(
				{
					ok: false,
					message: "Provide an email or phone number to search.",
				},
				{ status: 400 },
			);
		}

		const db = getDb();

		let results;

		// Search using both email and phone
		if (email && phone) {
			results = await db`
                SELECT *
                FROM registrations
                WHERE LOWER(BTRIM(email)) = LOWER(BTRIM(${email}))
                AND (
                    CASE
                        WHEN regexp_replace(phone_number, '[^0-9]', '', 'g') LIKE '234%'
                        THEN '0' || SUBSTRING(
                            regexp_replace(phone_number, '[^0-9]', '', 'g')
                            FROM 4
                        )
                        ELSE regexp_replace(phone_number, '[^0-9]', '', 'g')
                    END
                ) = (
                    CASE
                        WHEN regexp_replace(${phone}, '[^0-9]', '', 'g') LIKE '234%'
                        THEN '0' || SUBSTRING(
                            regexp_replace(${phone}, '[^0-9]', '', 'g')
                            FROM 4
                        )
                        ELSE regexp_replace(${phone}, '[^0-9]', '', 'g')
                    END
                )
                LIMIT 1
            `;
		}

		// Search using email only
		else if (email) {
			results = await db`
                SELECT *
                FROM registrations
                WHERE LOWER(BTRIM(email)) = LOWER(BTRIM(${email}))
                LIMIT 1
            `;
		}

		// Search using phone only
		else {
			results = await db`
                SELECT *
                FROM registrations
                WHERE (
                    CASE
                        WHEN regexp_replace(phone_number, '[^0-9]', '', 'g') LIKE '234%'
                        THEN '0' || SUBSTRING(
                            regexp_replace(phone_number, '[^0-9]', '', 'g')
                            FROM 4
                        )
                        ELSE regexp_replace(phone_number, '[^0-9]', '', 'g')
                    END
                ) = (
                    CASE
                        WHEN regexp_replace(${phone}, '[^0-9]', '', 'g') LIKE '234%'
                        THEN '0' || SUBSTRING(
                            regexp_replace(${phone}, '[^0-9]', '', 'g')
                            FROM 4
                        )
                        ELSE regexp_replace(${phone}, '[^0-9]', '', 'g')
                    END
                )
                LIMIT 1
            `;
		}

		if (results.length === 0) {
			return NextResponse.json({
				ok: true,
				found: false,
			});
		}

		const registration = results[0];

		return NextResponse.json({
			ok: true,
			found: true,
			registration: {
				id: registration.id,
				fullName: registration.full_name,
				phoneNumber: registration.phone_number,
				email: registration.email,
				gender: registration.gender,
				ageBracket: registration.age_bracket,
				nin: registration.nin,
				selectedCourse: registration.selected_course,
				selectedCenter: registration.selected_center,
				timeFrame: registration.time_frame,
				status: registration.status,
				createdAt: registration.created_at,
			},
		});
	} catch (err) {
		console.error("Error looking up registration:", err);

		return NextResponse.json(
			{
				ok: false,
				message: "Failed to look up registration.",
			},
			{ status: 500 },
		);
	}
}
