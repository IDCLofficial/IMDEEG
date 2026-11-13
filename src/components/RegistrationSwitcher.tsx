"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { RegistrationForm } from "@/components/RegistrationForm";
import { LookupForm } from "@/components/LookupForm";

export function RegistrationSwitcher() {
	const searchParams = useSearchParams();
	const router = useRouter();

	const isFinding = searchParams.has("find");

	const switchMode = () => {
		router.push(isFinding ? "/skill-up" : "/skill-up?find");
	};

	return (
		<>
			<div className='skillup-mode-switch'>
				{isFinding ? (
					<button type='button' onClick={switchMode}>
						New applicant? Register here
					</button>
				) : (
					<button type='button' onClick={switchMode}>
						Already registered? Find your registration
					</button>
				)}
			</div>

			{isFinding ? <LookupForm /> : <RegistrationForm />}
		</>
	);
}
