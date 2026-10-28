import { z } from "zod";
import { AGE_BRACKETS, CENTRES, COURSES, GENDERS } from "./constants";

const NG_PHONE = /^(?:\+234|234|0)[789][01]\d{8}$/;
const strip = (v: string) => v.replace(/[\s-]/g, "");
const choose = (what: string) => ({
	message: `Select ${what}`,
});

const optionalText = (max = 200) =>
	z
		.string()
		.trim()
		.max(max, `Keep this under ${max} characters`)
		.optional()
		.transform((v) => (v ? v : undefined));

const phone = z
	.string()
	.trim()
	.transform(strip)
	.refine(
		(v) => NG_PHONE.test(v),
		"Enter a valid Nigerian number, e.g. 08012345678",
	);

const optionalPhone = z
	.string()
	.trim()
	.transform(strip)
	.refine(
		(v) => v === "" || NG_PHONE.test(v),
		"Enter a valid Nigerian number, e.g. 08012345678",
	)
	.transform((v) => (v ? v : undefined))
	.optional();

const optionalNin = z
	.string()
	.trim()
	.refine(
		(v) => v === "" || /^\d{11}$/.test(v),
		"NIN must be exactly 11 digits",
	)
	.transform((v) => (v ? v : undefined))
	.optional();

export const registrationSchema = z.object({
	fullName: z.string().trim().min(3, "Enter your full name").max(120),
	phoneNumber: phone,
	email: z
		.string()
		.trim()
		.toLowerCase()
		.email("Enter a valid email address")
		.max(160),
	gender: z.enum(GENDERS, choose("your gender")),
	ageBracket: z.enum(AGE_BRACKETS, choose("your age range")),
	maritalStatus: optionalText(40),
	stateOfOrigin: optionalText(60),

	nin: z
		.string()
		.trim()
		.regex(/^\d{11}$/, "NIN must be exactly 11 digits"),
	imssbn: z
		.string()
		.trim()
		.regex(/^\d{10}$/, "IMSSBN must be exactly 10 digits"),

	localGovernment: z
		.string()
		.trim()
		.min(1, "Select your Local Government Area")
		.max(100),
	town: z.string().trim().min(2, "Enter your town").max(100),
	ward: z.string().trim().min(1, "Enter your ward").max(100),
	residentialAddress: optionalText(250),

	selectedCenter: z.enum(CENTRES, choose("a learning centre")),
	selectedCourse: z.enum(COURSES, choose("a course")),

	highestQualification: optionalText(80),
	courseOfStudy: optionalText(120),
	institution: optionalText(160),
	digitalSkills: optionalText(40),

	nokName: optionalText(120),
	nokPhone: optionalPhone,
	nokNin: optionalNin,
	nokRelationship: optionalText(40),

	// Honeypot: real people never see or fill this field.
	website: z.string().optional(),
});

export type RegistrationInput = z.input<typeof registrationSchema>;
export type RegistrationData = z.output<typeof registrationSchema>;
