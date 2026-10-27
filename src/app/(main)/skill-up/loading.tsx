export default function Loading() {
	return (
		<main
			className='min-h-screen bg-[#F7F9FA] px-4 py-10 sm:px-6 lg:px-8'
			aria-busy='true'
			aria-label='Loading registrations'
		>
			<div className='mx-auto max-w-7xl animate-pulse'>
				<div className='mb-8 flex items-end justify-between gap-4'>
					<div className='space-y-3'>
						<div className='h-4 w-24 rounded-sm bg-[#DDE6E1]' />
						<div className='h-9 w-56 rounded-sm bg-[#DDE6E1]' />
						<div className='h-4 w-64 rounded-sm bg-[#E5EBE8]' />
					</div>
					<div className='h-11 w-32 rounded-sm bg-[#DDE6E1]' />
				</div>
				<div className='mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4'>
					{Array.from({ length: 4 }, (_, index) => (
						<div
							key={index}
							className='h-24 border border-[#E3E8E6] bg-white p-4'
						>
							<div className='mb-3 h-7 w-12 rounded-sm bg-[#E5EBE8]' />
							<div className='h-4 w-3/4 rounded-sm bg-[#E5EBE8]' />
						</div>
					))}
				</div>
				<div className='overflow-hidden border border-[#E3E8E6] bg-white'>
					<div className='h-11 bg-[#F1F5F3]' />
					{Array.from({ length: 6 }, (_, index) => (
						<div
							key={index}
							className='flex h-12 items-center gap-6 border-t border-[#E8ECEA] px-4'
						>
							<div className='h-4 w-32 rounded-sm bg-[#E5EBE8]' />
							<div className='h-4 w-24 rounded-sm bg-[#E5EBE8]' />
							<div className='h-4 w-20 rounded-sm bg-[#E5EBE8]' />
							<div className='h-4 flex-1 rounded-sm bg-[#E5EBE8]' />
						</div>
					))}
				</div>
			</div>
		</main>
	);
}
