export default function Loading() {
	return (
		<main
			className='skillup-page'
			aria-busy='true'
			aria-label='Loading SkillUp registration'
		>
			<div className='skillup-container skillup-loading'>
				<div className='skillup-hero-skeleton' />
				<div className='skillup-layout'>
					<div className='skillup-info-skeleton'>
						<div />
						<div />
						<div />
					</div>
					<div className='skillup-form-skeleton'>
						<div className='skillup-skeleton-line short' />
						<div className='skillup-skeleton-line' />
						<div className='skillup-skeleton-line' />
						<div className='skillup-skeleton-line' />
						<div className='skillup-skeleton-line medium' />
						<div className='skillup-skeleton-button' />
					</div>
				</div>
			</div>
		</main>
	);
}
