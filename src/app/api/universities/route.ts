import { NextResponse } from "next/server";

export const runtime = "nodejs";

const getDepartmentNames = (payload: unknown): string[] => {
	if (!Array.isArray(payload)) return [];

	return Array.from(
		new Set(
			payload.flatMap((university) => {
				if (!university || typeof university !== "object") return [];
				const faculties = Array.isArray(
					(university as { faculties?: unknown }).faculties,
				)
					? (
							university as {
								faculties: Array<{ departments?: Array<{ name?: string }> }>;
							}
						).faculties
					: [];

				return faculties.flatMap((faculty) => {
					const departments = Array.isArray(faculty.departments)
						? faculty.departments
						: [];
					return departments
						.map((department) => String(department?.name ?? "").trim())
						.filter(Boolean);
				});
			}),
		),
	).sort((a, b) => a.localeCompare(b));
};

export async function GET() {
	try {
		const response = await fetch(
			"https://ng-universities.vercel.app/api/v1/universities",
			{
				headers: {
					Accept: "application/json",
				},
			},
		);

		if (!response.ok) {
			return NextResponse.json([], { status: response.status });
		}

		const data = await response.json();
		return NextResponse.json(getDepartmentNames(data));
	} catch {
		return NextResponse.json([], { status: 500 });
	}
}
