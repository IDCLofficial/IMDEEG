import { neon } from "@neondatabase/serverless";

export function getDb() {
	const url = process.env.NEXT_PUBLIC_DATABASE_URL;
	if (!url) throw new Error("DATABASE_URL is not set");
	return neon(url);
}
