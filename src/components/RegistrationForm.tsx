"use client";

import {
	FormEvent,
	ReactElement,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import {
	AGE_BRACKETS,
	CENTRES,
	COURSES,
	DIGITAL_SKILL_LEVELS,
	GENDERS,
	MARITAL_STATUSES,
	QUALIFICATIONS,
	RELATIONSHIPS,
	TIME_FRAME,
} from "@/lib/constants";
import { registrationSchema } from "@/lib/validation";

type Values = Record<string, string>;
type Errors = Record<string, string>;
type ApiRecord = {
	id?: string | number;
	name?: string;
	name_en?: string;
	name_local?: string;
	label?: string;
	state?: string;
	state_name?: string;
	parent_id?: string | number;
	parent_name_en?: string;
	parent_name_local?: string;
	state_id?: string | number;
	lga_id?: string | number;
	ward_id?: string | number;
	[key: string]: unknown;
};

const normalizeName = (value: unknown) =>
	String(value ?? "")
		.trim()
		.toLowerCase();

const getRecordName = (record: ApiRecord) =>
	String(
		record.name ??
			record.name_en ??
			record.name_local ??
			record.label ??
			record.state ??
			record.state_name ??
			"",
	);

const normalizeList = (payload: unknown): ApiRecord[] => {
	if (!payload) return [];
	if (Array.isArray(payload)) return payload as ApiRecord[];
	if (Array.isArray((payload as { data?: unknown }).data))
		return (payload as { data: ApiRecord[] }).data;
	if (Array.isArray((payload as { results?: unknown }).results))
		return (payload as { results: ApiRecord[] }).results;
	if (Array.isArray((payload as { items?: unknown }).items))
		return (payload as { items: ApiRecord[] }).items;
	if (Array.isArray((payload as { entities?: unknown }).entities))
		return (payload as { entities: ApiRecord[] }).entities;
	return [];
};

const findMatchingRecord = (
	records: ApiRecord[],
	value: string,
	matchField: (record: ApiRecord) => string,
) =>
	records.find(
		(record) => normalizeName(matchField(record)) === normalizeName(value),
	);

const INITIAL: Values = {
	fullName: "",
	phoneNumber: "",
	email: "",
	gender: "",
	ageBracket: "",
	maritalStatus: "",
	nin: "",
	imssbn: "",
	stateOfOrigin: "Imo",
	localGovernment: "",
	town: "",
	ward: "",
	residentialAddress: "",
	selectedCenter: "",
	selectedCourse: "",
	highestQualification: "",
	courseOfStudy: "",
	institution: "",
	digitalSkills: "",
	nokName: "",
	nokPhone: "",
	nokNin: "",
	nokRelationship: "",
	website: "",
};

const STEPS = [
	{
		title: "About you",
		fields: [
			"fullName",
			"phoneNumber",
			"email",
			"gender",
			"ageBracket",
			"maritalStatus",
			"nin",
			"imssbn",
		],
	},
	{
		title: "Location and course",
		fields: [
			"stateOfOrigin",
			"localGovernment",
			"town",
			"ward",
			"residentialAddress",
			"selectedCenter",
			"selectedCourse",
		],
	},
	{
		title: "Background",
		fields: [
			"highestQualification",
			"courseOfStudy",
			"institution",
			"digitalSkills",
			"nokName",
			"nokPhone",
			"nokNin",
			"nokRelationship",
		],
	},
];

function validate(values: Values, fields?: string[]): Errors {
	const result = registrationSchema.safeParse(values);
	if (result.success) return {};
	const errors: Errors = {};
	for (const issue of result.error.issues) {
		const key = String(issue.path[0]);
		if (fields && !fields.includes(key)) continue;
		if (!errors[key]) errors[key] = issue.message;
	}
	return errors;
}

function Field(props: {
	name: string;
	label: string;
	error?: string;
	hint?: string;
	optional?: boolean;
	children: ReactElement;
}) {
	return (
		<div className='field'>
			<label htmlFor={props.name}>
				{props.label}
				{props.optional && <span className='opt'> (optional)</span>}
			</label>
			{props.children}
			{props.hint && !props.error && <p className='hint'>{props.hint}</p>}
			{props.error && (
				<p className='error' id={`${props.name}-error`} role='alert'>
					{props.error}
				</p>
			)}
		</div>
	);
}

function SearchSelect(props: {
	name: string;
	value: string;
	options: ApiRecord[];
	placeholder: string;
	onChange: (value: string) => void;
	label?: string;
	allowOther?: boolean;
	otherLabel?: string;
}) {
	const listId = `${props.name}-options`;
	const optionValue = (record: ApiRecord) => getRecordName(record);
	const optionKey = (record: ApiRecord, index: number) => {
		const uniqueId = String(
			record.id ??
				record.ward_id ??
				record.lga_id ??
				record.parent_id ??
				record.state_id ??
				record.name_en ??
				record.name_local ??
				record.label ??
				record.state ??
				index,
		);
		return `${props.name}-${uniqueId}`;
	};
	const otherLabel = props.otherLabel ?? "Other";
	const matchExists = (query: string) =>
		props.options.some((option) => {
			const current = optionValue(option);
			return normalizeName(current) === normalizeName(query);
		});
	const hasNoMatch =
		props.allowOther && props.value.trim() !== "" && !matchExists(props.value);

	return (
		<>
			<input
				id={props.name}
				name={props.name}
				list={listId}
				value={props.value}
				placeholder={props.placeholder}
				autoComplete='off'
				onChange={(event) => props.onChange(event.target.value)}
			/>
			{hasNoMatch && (
				<button
					type='button'
					className='btn btn-ghost btn-small'
					onClick={() => props.onChange(otherLabel)}
					style={{ marginTop: 8 }}
				>
					{otherLabel}
				</button>
			)}
			<datalist id={listId}>
				{props.options.map((option, index) => (
					<option key={optionKey(option, index)} value={optionValue(option)} />
				))}
				{props.allowOther && <option value={otherLabel} />}
			</datalist>
		</>
	);
}

export function RegistrationForm() {
	const [step, setStep] = useState(0);
	const [values, setValues] = useState<Values>(INITIAL);
	const [errors, setErrors] = useState<Errors>({});
	const [submitting, setSubmitting] = useState(false);
	const [formError, setFormError] = useState("");
	const [reference, setReference] = useState("");
	const [stateOptions, setStateOptions] = useState<ApiRecord[]>([]);
	const [lgaOptions, setLgaOptions] = useState<ApiRecord[]>([]);
	const [wardOptions, setWardOptions] = useState<ApiRecord[]>([]);
	const [courseStudyOptions, setCourseStudyOptions] = useState<string[]>([]);
	const topRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		let ignore = false;
		const loadLocationData = async () => {
			try {
				const [statesRes, lgasRes, wardsRes, studyOptionsRes] =
					await Promise.all([
						fetch("https://api.openadmindata.org/api/v1/ng/state.json").then(
							(response) => response.json(),
						),
						fetch("https://api.openadmindata.org/api/v1/ng/lga.json").then(
							(response) => response.json(),
						),
						fetch("https://api.openadmindata.org/api/v1/ng/ward.json").then(
							(response) => response.json(),
						),
						fetch("/api/universities").then((response) => response.json()),
					]);

				if (ignore) return;

				const states = normalizeList(statesRes);
				const lgas = normalizeList(lgasRes);
				const wards = normalizeList(wardsRes);
				const studyOptions = Array.isArray(studyOptionsRes)
					? [
							...new Set(
								studyOptionsRes
									.map((value) => String(value).trim())
									.filter(Boolean),
							),
						].sort((a, b) => a.localeCompare(b))
					: [];

				setStateOptions(states);
				setLgaOptions(lgas);
				setWardOptions(wards);
				setCourseStudyOptions(studyOptions);
			} catch {
				if (!ignore) {
					setStateOptions([]);
					setLgaOptions([]);
					setWardOptions([]);
					setCourseStudyOptions([]);
				}
			}
		};

		void loadLocationData();
		return () => {
			ignore = true;
		};
	}, []);

	const selectedState = useMemo(() => {
		const stateName = values.stateOfOrigin || "Imo";
		return (
			stateOptions.find((state) => {
				return normalizeName(getRecordName(state)) === normalizeName(stateName);
			}) ??
			stateOptions.find((state) => {
				return normalizeName(getRecordName(state)).includes("imo");
			})
		);
	}, [stateOptions, values.stateOfOrigin]);

	const localGovernmentOptions = useMemo(() => {
		if (!selectedState) return lgaOptions;
		const selectedStateId = String(
			selectedState.id ??
				selectedState.state_id ??
				selectedState.parent_id ??
				"",
		);

		return lgaOptions.filter((lga) => {
			const parentId = String(lga.parent_id ?? lga.state_id ?? "");
			return (
				parentId === selectedStateId ||
				normalizeName(
					lga.state ?? lga.state_name ?? getRecordName(lga),
				).includes("imo")
			);
		});
	}, [lgaOptions, selectedState]);

	const wardOptionsForLga = useMemo(() => {
		const selectedLga = findMatchingRecord(
			localGovernmentOptions,
			values.localGovernment,
			(record) => getRecordName(record),
		);
		if (!selectedLga) return wardOptions;
		const selectedLgaId = String(
			selectedLga.id ?? selectedLga.lga_id ?? selectedLga.parent_id ?? "",
		);
		return wardOptions.filter((ward) => {
			const parentId = String(
				ward.parent_id ?? ward.lga_id ?? ward.state_id ?? "",
			);
			return parentId === selectedLgaId;
		});
	}, [localGovernmentOptions, values.localGovernment, wardOptions]);

	const courseOfStudyHasNoMatch =
		values.courseOfStudy.trim() !== "" &&
		!courseStudyOptions.some(
			(option) => normalizeName(option) === normalizeName(values.courseOfStudy),
		);

	const resetWardIfNeeded = (nextLga: string) => {
		if (nextLga !== values.localGovernment) set("ward", "");
	};

	const set = (name: string, value: string) => {
		setValues((v) => ({ ...v, [name]: value }));
		if (errors[name]) setErrors((e) => ({ ...e, [name]: "" }));
	};

	const bind = (name: string, digitsOnly = false) => ({
		id: name,
		name,
		value: values[name],
		onChange: (e: { target: { value: string } }) =>
			set(
				name,
				digitsOnly ? e.target.value.replace(/\D/g, "") : e.target.value,
			),
		"aria-invalid": errors[name] ? true : undefined,
		"aria-describedby": errors[name] ? `${name}-error` : undefined,
	});

	const select = (
		name: string,
		options: readonly string[],
		placeholder: string,
	) => (
		<select {...bind(name)}>
			<option value=''>{placeholder}</option>
			{options.map((o) => (
				<option key={o} value={o}>
					{o}
				</option>
			))}
		</select>
	);

	const goTo = (i: number) => {
		setStep(i);
		topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
	};

	function next() {
		const found = validate(values, STEPS[step].fields);
		setErrors(found);
		if (Object.keys(found).length === 0) goTo(step + 1);
	}

	async function onSubmit(e: FormEvent) {
		e.preventDefault();
		if (step < STEPS.length - 1) return next();

		const all = validate(values);
		if (Object.keys(all).length) {
			setErrors(all);
			const bad = STEPS.findIndex((s) => s.fields.some((f) => all[f]));
			if (bad >= 0) goTo(bad);
			return;
		}

		setSubmitting(true);
		setFormError("");
		try {
			const res = await fetch("/api/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});
			const data = await res.json();
			if (res.ok && data.ok) {
				setReference(data.reference);
				return;
			}
			if (data.errors) {
				const mapped: Errors = {};
				for (const [k, v] of Object.entries<string[]>(data.errors))
					mapped[k] = v[0];
				setErrors(mapped);
				const bad = STEPS.findIndex((s) => s.fields.some((f) => mapped[f]));
				if (bad >= 0) goTo(bad);
			} else {
				setFormError(data.message ?? "Something went wrong. Please try again.");
			}
		} catch {
			setFormError("No connection. Check your network and try again.");
		} finally {
			setSubmitting(false);
		}
	}

	if (reference) {
		return (
			<div className='card success' role='status'>
				<h2>You are registered</h2>
				<p>
					Keep this reference number. You will need it if you contact the
					programme team.
				</p>
				<p className='ref'>{reference}</p>
				<dl className='summary'>
					<div>
						<dt>Name</dt>
						<dd>{values.fullName}</dd>
					</div>
					<div>
						<dt>Course</dt>
						<dd>{values.selectedCourse}</dd>
					</div>
					<div>
						<dt>Centre</dt>
						<dd>{values.selectedCenter}</dd>
					</div>
					<div>
						<dt>Duration</dt>
						<dd>{TIME_FRAME}</dd>
					</div>
				</dl>
				<button
					className='btn btn-ghost'
					type='button'
					onClick={() => {
						setValues(INITIAL);
						setReference("");
						setStep(0);
					}}
				>
					Register another person
				</button>
			</div>
		);
	}

	return (
		<form className='card' onSubmit={onSubmit} noValidate>
			<div ref={topRef} />
			<ol className='steps' aria-label='Progress'>
				{STEPS.map((s, i) => (
					<li
						key={s.title}
						className={i === step ? "on" : i < step ? "done" : ""}
						aria-current={i === step ? "step" : undefined}
					>
						<span>{i + 1}</span> {s.title}
					</li>
				))}
			</ol>

			{/* Honeypot */}
			<div className='hp' aria-hidden='true'>
				<label htmlFor='website'>Website</label>
				<input
					id='website'
					name='website'
					tabIndex={-1}
					autoComplete='off'
					value={values.website}
					onChange={(e) => set("website", e.target.value)}
				/>
			</div>

			{step === 0 && (
				<fieldset>
					<legend>Tell us about yourself</legend>
					<Field
						error={errors.fullName}
						name='fullName'
						label='Full name'
						hint='As it appears on your NIN slip'
					>
						<input {...bind("fullName")} autoComplete='name' />
					</Field>
					<div className='row'>
						<Field
							error={errors.phoneNumber}
							name='phoneNumber'
							label='Phone number'
						>
							<input
								{...bind("phoneNumber", true)}
								type='tel'
								inputMode='numeric'
								maxLength={13}
								autoComplete='tel'
								placeholder='08012345678'
							/>
						</Field>
						<Field error={errors.email} name='email' label='Email address'>
							<input {...bind("email")} type='email' autoComplete='email' />
						</Field>
					</div>
					<div className='row'>
						<Field error={errors.gender} name='gender' label='Gender'>
							{select("gender", GENDERS, "Select")}
						</Field>
						<Field
							error={errors.ageBracket}
							name='ageBracket'
							label='Age range'
						>
							{select("ageBracket", AGE_BRACKETS, "Select")}
						</Field>
					</div>
					<Field
						error={errors.maritalStatus}
						name='maritalStatus'
						label='Marital status'
						optional
					>
						{select("maritalStatus", MARITAL_STATUSES, "Select")}
					</Field>
					<div className='row'>
						<Field error={errors.nin} name='nin' label='NIN' hint='11 digits'>
							<input
								{...bind("nin", true)}
								inputMode='numeric'
								maxLength={11}
								autoComplete='off'
							/>
						</Field>
						<Field
							error={errors.imssbn}
							name='imssbn'
							label='IMSSBN number'
							hint='10 digits'
						>
							<input
								{...bind("imssbn", true)}
								inputMode='numeric'
								maxLength={10}
								autoComplete='off'
							/>
						</Field>
					</div>
				</fieldset>
			)}

			{step === 1 && (
				<fieldset>
					<legend>Where you live and what you will learn</legend>
					<div className='row'>
						<Field
							error={errors.stateOfOrigin}
							name='stateOfOrigin'
							label='State of residence'
						>
							<input disabled {...bind("stateOfOrigin")} />
						</Field>
						<Field
							error={errors.localGovernment}
							name='localGovernment'
							label='Local Government of residence'
						>
							<SearchSelect
								name='localGovernment'
								value={values.localGovernment}
								options={localGovernmentOptions}
								placeholder='Search and select your LGA or choose Other'
								allowOther
								onChange={(nextValue) => {
									set("localGovernment", nextValue);
									resetWardIfNeeded(nextValue);
								}}
							/>
						</Field>
					</div>
					<div className='row'>
						<Field error={errors.town} name='town' label='Town'>
							<input {...bind("town")} />
						</Field>
						<Field error={errors.ward} name='ward' label='Ward'>
							<SearchSelect
								name='ward'
								value={values.ward}
								options={wardOptionsForLga}
								placeholder='Search and select your ward or choose Other'
								allowOther
								onChange={(nextValue) => set("ward", nextValue)}
							/>
						</Field>
					</div>
					<Field
						error={errors.residentialAddress}
						name='residentialAddress'
						label='Residential address'
						optional
					>
						<input
							{...bind("residentialAddress")}
							autoComplete='street-address'
						/>
					</Field>
					<Field
						error={errors.selectedCenter}
						name='selectedCenter'
						label='Preferred learning centre'
					>
						{select("selectedCenter", CENTRES, "Select a centre")}
					</Field>
					<Field
						error={errors.selectedCourse}
						name='selectedCourse'
						label='Course of choice'
						hint={`Training runs ${TIME_FRAME}`}
					>
						{select("selectedCourse", COURSES, "Select a course")}
					</Field>
				</fieldset>
			)}

			{step === 2 && (
				<fieldset>
					<legend>Your background and next of kin</legend>
					<p className='note'>
						Everything on this page is optional, but it helps the team plan your
						training.
					</p>
					<div className='row'>
						<Field
							error={errors.highestQualification}
							name='highestQualification'
							label='Highest qualification'
							optional
						>
							{select("highestQualification", QUALIFICATIONS, "Select")}
						</Field>
						<Field
							error={errors.digitalSkills}
							name='digitalSkills'
							label='Digital skills level'
							optional
						>
							{select("digitalSkills", DIGITAL_SKILL_LEVELS, "Select")}
						</Field>
					</div>
					<div className='row'>
						<Field
							error={errors.courseOfStudy}
							name='courseOfStudy'
							label='Course of study'
							optional
						>
							<>
								<input
									{...bind("courseOfStudy")}
									list='course-of-study-options'
									placeholder='Search and select your course of study'
									autoComplete='off'
								/>
								{courseOfStudyHasNoMatch && (
									<button
										type='button'
										className='btn btn-ghost btn-small'
										onClick={() => set("courseOfStudy", "Other")}
										style={{ marginTop: 8 }}
									>
										Other
									</button>
								)}
								<datalist id='course-of-study-options'>
									{courseStudyOptions.map((option) => (
										<option key={option} value={option} />
									))}
									<option value='Other' />
								</datalist>
							</>
						</Field>
						<Field
							error={errors.institution}
							name='institution'
							label='Institution'
							optional
						>
							<input {...bind("institution")} />
						</Field>
					</div>

					<h3>Next of kin</h3>
					<div className='row'>
						<Field
							error={errors.nokName}
							name='nokName'
							label='Full name'
							optional
						>
							<input {...bind("nokName")} />
						</Field>
						<Field
							error={errors.nokRelationship}
							name='nokRelationship'
							label='Relationship'
							optional
						>
							{select("nokRelationship", RELATIONSHIPS, "Select")}
						</Field>
					</div>
					<div className='row'>
						<Field
							error={errors.nokPhone}
							name='nokPhone'
							label='Phone number'
							optional
						>
							<input
								{...bind("nokPhone", true)}
								type='tel'
								inputMode='numeric'
								maxLength={13}
							/>
						</Field>
						<Field error={errors.nokNin} name='nokNin' label='NIN' optional>
							<input
								{...bind("nokNin", true)}
								inputMode='numeric'
								maxLength={11}
							/>
						</Field>
					</div>
				</fieldset>
			)}

			{formError && (
				<p className='error banner' role='alert'>
					{formError}
				</p>
			)}

			<div className='actions'>
				{step > 0 && (
					<button
						type='button'
						className='btn btn-ghost'
						onClick={() => goTo(step - 1)}
						disabled={submitting}
					>
						Back
					</button>
				)}
				<button type='submit' className='btn btn-primary' disabled={submitting}>
					{step < STEPS.length - 1
						? "Continue"
						: submitting
							? "Saving..."
							: "Submit registration"}
				</button>
			</div>
		</form>
	);
}
