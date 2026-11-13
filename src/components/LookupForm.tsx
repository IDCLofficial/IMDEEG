"use client";

import { useState } from "react";

interface Registration {
	fullName: string;
	email: string;
	phoneNumber: string;
	selectedCourse: string;
	selectedCenter: string;
	timeFrame: string;
}

const initialRegistration: Registration = {
	fullName: "",
	email: "",
	phoneNumber: "",
	selectedCourse: "",
	selectedCenter: "",
	timeFrame: "Intermediate: 4-12 weeks",
};

export function LookupForm() {
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [loading, setLoading] = useState(false);
	const [showCard, setShowCard] = useState(false);
	const [formError, setFormError] = useState("");
	const [foundRegistration, setFoundRegistration] =
		useState<Registration>(initialRegistration);

	const search = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!email.trim() && !phone.trim()) {
			setFormError("Enter your email or phone number to search.");
			return;
		}

		setLoading(true);
		setFormError("");
		setShowCard(false);

		try {
			const params = new URLSearchParams();

			if (email.trim()) params.set("email", email.trim());
			if (phone.trim()) params.set("phone", phone.trim());

			const res = await fetch(`/api/registration?${params.toString()}`, {
				cache: "no-store",
			});

			const data = await res.json();

			if (!res.ok) {
				setFormError(data.message || "Unable to search for your registration.");
				return;
			}

			if (data.ok && data.found) {
				setFoundRegistration({
					fullName: data.registration.fullName,
					email: data.registration.email,
					phoneNumber: data.registration.phoneNumber,
					selectedCourse: data.registration.selectedCourse,
					selectedCenter: data.registration.selectedCenter,
					timeFrame: data.registration.timeFrame ?? "Intermediate: 4-12 weeks",
				});

				setShowCard(true);
			} else {
				setFormError(
					data.message ||
						"No registration found. Check your details and try again.",
				);
			}
		} catch {
			setFormError("Unable to connect. Check your network and try again.");
		} finally {
			setLoading(false);
		}
	};

	const closeCard = () => {
		setShowCard(false);
		setEmail("");
		setPhone("");
		setFormError("");
		setFoundRegistration(initialRegistration);
	};

	return (
		<div className='lookup-wrapper'>
			<div className='lookup-card'>
				{!showCard ? (
					<>
						<div className='lookup-heading'>
							<div className='lookup-icon'>
								<svg
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='1.8'
									strokeLinecap='round'
									strokeLinejoin='round'
									aria-hidden='true'
								>
									<circle cx='11' cy='11' r='7' />
									<path d='m16 16 4 4' />
								</svg>
							</div>

							<div>
								<h2>Find your registration</h2>
								<p>
									Already registered? Enter the email address or phone number
									you used during registration.
								</p>
							</div>
						</div>

						<form onSubmit={search}>
							<div className='lookup-fields'>
								<div className='lookup-field'>
									<label htmlFor='lookup-email'>Email address</label>
									<input
										id='lookup-email'
										type='email'
										autoComplete='email'
										placeholder='e.g. yourname@gmail.com'
										value={email}
										onChange={(e) => setEmail(e.target.value)}
									/>
								</div>

								<div className='lookup-divider'>
									<span>OR</span>
								</div>

								<div className='lookup-field'>
									<label htmlFor='lookup-phone'>Phone number</label>
									<input
										id='lookup-phone'
										type='tel'
										inputMode='numeric'
										autoComplete='tel'
										placeholder='e.g. 08012345678'
										value={phone}
										onChange={(e) =>
											setPhone(e.target.value.replace(/\D/g, ""))
										}
									/>
								</div>
							</div>

							{formError && (
								<div className='lookup-error' role='alert'>
									{formError}
								</div>
							)}

							<button
								type='submit'
								className='lookup-submit'
								disabled={loading}
							>
								{loading ? (
									<>
										<span className='lookup-spinner' />
										Searching...
									</>
								) : (
									<>
										Find my registration
										<span aria-hidden='true'>→</span>
									</>
								)}
							</button>

							<p className='lookup-note'>
								Use the same email address or phone number you provided when
								registering.
							</p>
						</form>
					</>
				) : (
					<div className='lookup-result'>
						<div className='lookup-success-icon'>
							<svg
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
								aria-hidden='true'
							>
								<path d='m5 12 4 4L19 6' />
							</svg>
						</div>

						<div className='lookup-result-heading'>
							<h2>Registration found!</h2>
							<p>We found an existing registration matching your details.</p>
						</div>

						<div className='lookup-result-details'>
							<div className='lookup-detail'>
								<span>Full name</span>
								<strong>{foundRegistration.fullName}</strong>
							</div>

							<div className='lookup-detail'>
								<span>Email address</span>
								<strong>{foundRegistration.email}</strong>
							</div>

							<div className='lookup-detail'>
								<span>Phone number</span>
								<strong>{foundRegistration.phoneNumber}</strong>
							</div>

							<div className='lookup-detail'>
								<span>Selected course</span>
								<strong>{foundRegistration.selectedCourse}</strong>
							</div>

							<div className='lookup-detail'>
								<span>Training centre</span>
								<strong>{foundRegistration.selectedCenter}</strong>
							</div>

							<div className='lookup-detail'>
								<span>Training duration</span>
								<strong>{foundRegistration.timeFrame}</strong>
							</div>
						</div>

						<button type='button' className='lookup-submit' onClick={closeCard}>
							Search another registration
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
