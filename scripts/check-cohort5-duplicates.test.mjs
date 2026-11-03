import test from "node:test";
import assert from "node:assert/strict";
import {
	findDuplicateEntries,
	normalizeName,
	normalizeLga,
} from "./check-cohort5-duplicates.mjs";
import {
	COHORT_INELIGIBLE_MESSAGE,
	checkIdentityMatch,
	checkSameNameAndLga,
} from "../src/lib/cohortEligibility.ts";

test("normalizeName trims and collapses whitespace", () => {
	assert.equal(normalizeName("  Jane   Doe  "), "jane doe");
	assert.equal(normalizeName("JOHN   MICHAEL"), "john michael");
});

test("normalizeLga handles common variants", () => {
	assert.equal(normalizeLga("Ehime-mbano "), "EHIME MBANO");
	assert.equal(normalizeLga("Ohaji/Egbema"), "OHAJI EGBEMA");
});

test("findDuplicateEntries flags repeated same name and LGA when email, nin and isbm are all missing", () => {
	const rows = [
		{ name: "Jane Doe", lga: "Ehime Mbano", email: "", nin: "", isbm: "" },
		{ name: "jane doe", lga: "Ehime-Mbano", email: "", nin: "", isbm: "" },
		{
			name: "Jane Doe",
			lga: "Ehime Mbano",
			email: "jane@example.com",
			nin: "12345678901",
			isbm: "ISBM-1",
		},
		{ name: "John Smith", lga: "Owerri West", email: "", nin: "", isbm: "" },
		{
			name: "John Smith",
			lga: "Owerri West",
			email: "john@example.com",
			nin: "",
			isbm: "",
		},
	];

	const flagged = findDuplicateEntries(rows, "Cohort 5");
	assert.deepEqual(
		flagged.map((row) => row.name),
		["Jane Doe", "jane doe", "Jane Doe", "John Smith", "John Smith"],
	);
	assert.equal(flagged.length, 5);
});

test("findDuplicateEntries still flags same name and LGA when the new record has a different email or NIN", () => {
	const rows = [
		{
			name: "Jane Doe",
			lga: "Ehime Mbano",
			email: "old@example.com",
			nin: "12345678901",
			isbm: "ISBM-1",
		},
		{
			name: "Jane Doe",
			lga: "Ehime Mbano",
			email: "new@example.com",
			nin: "98765432109",
			isbm: "ISBM-999",
		},
		{
			name: "John Smith",
			lga: "Owerri West",
			email: "john@example.com",
			nin: "22222222222",
			isbm: "ISBM-2",
		},
	];

	const flagged = findDuplicateEntries(rows, "Cohort 5");
	assert.deepEqual(
		flagged.map((row) => row.email),
		["old@example.com", "new@example.com"],
	);
	assert.equal(flagged.length, 2);
});

test("separate cohort checks work independently", () => {
	const previousEntries = [
		{
			fullName: "Jane Doe",
			localGovernment: "Ehime Mbano",
			email: "old@example.com",
			nin: "12345678901",
			imssbn: "ISBM-1",
		},
		{
			fullName: "Mary Okafor",
			localGovernment: "Owerri West",
			email: "mary@example.com",
			nin: "33333333333",
			imssbn: "ISBM-333",
		},
	];

	assert.equal(
		checkSameNameAndLga(
			{
				fullName: "Jane Doe",
				localGovernment: "Ehime Mbano",
				email: "new@example.com",
				nin: "99999999999",
				imssbn: "ISBM-999",
			},
			previousEntries,
		),
		true,
	);

	const identityResult = checkIdentityMatch(
		{
			fullName: "Mary Okafor",
			localGovernment: "Owerri West",
			email: "mary@example.com",
			nin: "33333333333",
			imssbn: "ISBM-333",
		},
		previousEntries,
	);

	assert.deepEqual(identityResult, {
		field: "email",
		message: COHORT_INELIGIBLE_MESSAGE,
	});
});
