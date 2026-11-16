"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
	RegistrationForm,
	type RegistrationFormValues,
} from "@/components/RegistrationForm";

type RegistrationRecord = RegistrationFormValues & {
	id: string;
	reference?: string;
};

export function EditRegistration({
	registrationId,
}: {
	registrationId: string;
}) {
	const [record, setRecord] = useState<RegistrationRecord | null>(null);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const controller = new AbortController();
		setLoading(true);
		setError("");
		setRecord(null);

		void fetch(`/api/registration/${encodeURIComponent(registrationId)}`, {
			cache: "no-store",
			signal: controller.signal,
		})
			.then(async (response) => {
				const data = await response.json();
				if (!response.ok || !data.ok) {
					throw new Error(
						data.message ?? "We could not find that registration.",
					);
				}
				return data.registration as RegistrationRecord;
			})
			.then((registration) => {
				setRecord({
					...registration,
					bankNameChoice: registration.bankName ?? "",
				});
			})
			.catch((err: unknown) => {
				if (err instanceof DOMException && err.name === "AbortError") return;
				setError(
					err instanceof Error
						? err.message
						: "We could not load that registration.",
				);
			})
			.finally(() => {
				if (!controller.signal.aborted) setLoading(false);
			});

		return () => controller.abort();
	}, [registrationId]);

	if (loading) {
		return (
			<div className='card' role='status' aria-live='polite'>
				<h2>Loading your registration</h2>
				<p>Please wait while we fetch your details...</p>
			</div>
		);
	}

	if (error || !record) {
		return (
			<div className='card' role='alert'>
				<h2>We could not load that registration</h2>
				<p>{error || "The link may be incomplete or the record was removed."}</p>
				<Link className='btn btn-primary' href='/skill-up'>
					Go to the registration page
				</Link>
			</div>
		);
	}

	return (
		<RegistrationForm
			key={record.id}
			mode='edit'
			registrationId={record.id}
			initialValues={record}
		/>
	);
}
