import { NextResponse } from "next/server";
import { getNewsBySlug } from "../(main)/news/newsList";

// The previous (WordPress) site served articles from the root, e.g. /some-article-slug/.
// Those URLs are still indexed. Articles were migrated to /news/<same-slug>, so redirect them.
// A route handler (not a page) is used so crawlers get a real HTTP 308/404, not a streamed 200.
// Static routes (/about-us, /news, ...) take precedence over this dynamic segment.
export async function GET(request: Request, { params }: { params: Promise<{ legacySlug: string }> }) {
	const { legacySlug } = await params;
	// Only plain slugs: keeps odd input out of the CMS query and the redirect target.
	if (/^[a-z0-9-]{3,200}$/.test(legacySlug)) {
		const article = await getNewsBySlug(legacySlug);
		if (article) return NextResponse.redirect(new URL(`/news/${legacySlug}`, request.url), 308);
	}
	return new Response(
		'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Page not found</title></head><body><h1>Page not found</h1><p><a href="/">Go to the MDEEG homepage</a></p></body></html>',
		{ status: 404, headers: { "content-type": "text/html; charset=utf-8" } },
	);
}
