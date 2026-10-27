import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata = { title: "Registrations - Skillup Imo" };

type Row = {
	id: string;
	full_name: string;
	phone_number: string;
	nin: string;
	local_government: string;
	selected_course: string;
	selected_center: string;
	status: string;
	created_at: string;
};

export default async function AdminPage() {
	const db = getDb();
	const rows = (await db`
    SELECT id, full_name, phone_number, nin, local_government, selected_course,
           selected_center, status, created_at
    FROM registrations ORDER BY created_at DESC LIMIT 500
  `) as Row[];
	const byCourse = (await db`
    SELECT selected_course AS course, COUNT(*)::int AS total
    FROM registrations GROUP BY 1 ORDER BY total DESC
  `) as { course: string; total: number }[];
	const [{ total }] =
		(await db`SELECT COUNT(*)::int AS total FROM registrations`) as {
			total: number;
		}[];

	return (
		<main className='min-h-screen bg-[#F7F9FA] px-4 py-10 sm:px-6 lg:px-8'>
			<div className='mx-auto max-w-7xl'>
				<header className='mb-8 flex flex-wrap items-end justify-between gap-4'>
					<div>
						<p className='mb-2 text-sm font-medium text-primary-green'>
							Skillup Imo
						</p>
						<h1 className='text-3xl font-bold text-[#1E1E1E]'>Registrations</h1>
						<p className='mt-2 text-sm text-[#666666]'>
							{total} total registrations. Showing the latest {rows.length}.
						</p>
					</div>
					<a
						className='inline-flex min-h-11 items-center justify-center rounded-sm bg-primary-green px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0D7444] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-green'
						href='/api/admin/export'
					>
						Download CSV
					</a>
				</header>

				<section className='mb-8' aria-label='Registrations by course'>
					<h2 className='mb-3 text-sm font-semibold text-[#444444]'>
						By course
					</h2>
					<div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4'>
						{byCourse.map((c) => (
							<div
								key={c.course}
								className='min-w-0 border border-[#E3E8E6] bg-white px-4 py-3'
							>
								<strong className='block text-2xl font-bold text-[#1E1E1E]'>
									{c.total}
								</strong>
								<span className='mt-1 block break-words text-sm text-[#666666]'>
									{c.course}
								</span>
							</div>
						))}
					</div>
				</section>

				<section
					aria-label='Registration records'
					className='overflow-hidden border border-[#E3E8E6] bg-white'
				>
					<div className='overflow-x-auto'>
						<table className='w-full min-w-[950px] border-collapse text-left text-sm'>
							<thead className='bg-[#F1F5F3] text-xs uppercase tracking-wide text-[#555555]'>
								<tr>
									<th scope='col' className='px-4 py-3 font-semibold'>
										Name
									</th>
									<th scope='col' className='px-4 py-3 font-semibold'>
										Phone
									</th>
									<th scope='col' className='px-4 py-3 font-semibold'>
										NIN
									</th>
									<th scope='col' className='px-4 py-3 font-semibold'>
										LGA
									</th>
									<th scope='col' className='px-4 py-3 font-semibold'>
										Course
									</th>
									<th scope='col' className='px-4 py-3 font-semibold'>
										Centre
									</th>
									<th scope='col' className='px-4 py-3 font-semibold'>
										Status
									</th>
									<th scope='col' className='px-4 py-3 font-semibold'>
										Registered
									</th>
								</tr>
							</thead>
							<tbody className='divide-y divide-[#E8ECEA] text-[#333333]'>
								{rows.map((r) => (
									<tr
										key={r.id}
										className='transition-colors hover:bg-[#F8FBF9]'
									>
										<td className='px-4 py-3 font-medium'>{r.full_name}</td>
										<td className='whitespace-nowrap px-4 py-3'>
											{r.phone_number}
										</td>
										<td className='whitespace-nowrap px-4 py-3'>
											{"*******" + String(r.nin).slice(-4)}
										</td>
										<td className='px-4 py-3'>{r.local_government}</td>
										<td className='px-4 py-3'>{r.selected_course}</td>
										<td className='px-4 py-3'>{r.selected_center}</td>
										<td className='px-4 py-3'>{r.status}</td>
										<td className='whitespace-nowrap px-4 py-3'>
											{new Date(r.created_at).toLocaleDateString("en-NG")}
										</td>
									</tr>
								))}
								{rows.length === 0 && (
									<tr>
										<td
											colSpan={8}
											className='px-4 py-12 text-center text-[#666666]'
										>
											No registrations yet. They will appear here as people sign
											up.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</section>
			</div>
		</main>
	);
}
