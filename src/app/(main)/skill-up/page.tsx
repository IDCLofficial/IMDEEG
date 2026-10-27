import Link from "next/link";
import Image from "next/image";
import { RegistrationForm } from "@/components/RegistrationForm";
import {
	COURSES,
	PROGRAMME_NAME,
	PROGRAMME_ORG,
	TIME_FRAME,
} from "@/lib/constants";

export default function Home() {
	return (
		<main className='skillup-page'>
			<div className='skillup-container'>
				<header className='skillup-hero'>
					<div className='skillup-hero-copy'>
						<p className='skillup-org'>{PROGRAMME_ORG} / SKILLUP IMO</p>
						<h1>{PROGRAMME_NAME}</h1>
						<p>
							Build practical digital skills with hands-on training. Choose a
							course and learning centre to begin your registration.
						</p>
					</div>
					<div className='skillup-hero-image'>
						<Image
							src='/images/skillUp.png'
							alt='SkillUp Imo participants learning digital skills'
							fill
							priority
							sizes='(max-width: 760px) 100vw, 40vw'
							className='object-cover'
						/>
					</div>
				</header>

				<div className='skillup-layout'>
					<aside className='skillup-intro'>
						<div className='skillup-facts'>
							<div>
								<span>Training duration</span>
								<strong>{TIME_FRAME}</strong>
							</div>
							<div>
								<span>Have ready</span>
								<strong>
									Your NIN, IMSSBN, working phone number and email address
								</strong>
							</div>
						</div>

						<section
							className='skillup-courses'
							aria-labelledby='course-heading'
						>
							<h2 id='course-heading'>Courses on offer</h2>
							<ul>
								{COURSES.map((course) => (
									<li key={course}>{course}</li>
								))}
							</ul>
						</section>
					</aside>

					<section className='skillup-form' aria-label='Registration form'>
						<RegistrationForm />
					</section>
				</div>
			</div>
		</main>
	);
}
