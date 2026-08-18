import { NextRequest, NextResponse } from "next/server";
import { getPublicationMetadata } from "../../../../../../lib/r2";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ key: string[] }>;
}

function decodeKey(segments: string[]): string {
  return segments.map((segment) => decodeURIComponent(segment)).join("/");
}

export async function GET(req: NextRequest, context: RouteContext) {
  const { key: segments } = await context.params;

  if (!segments || segments.length === 0) {
    return NextResponse.json({ error: "Missing object key." }, { status: 400 });
  }

  const key = decodeKey(segments);

  try {
    const metadata = await getPublicationMetadata(key);

    if (!metadata) {
      return NextResponse.json(
        { error: "Publication not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(metadata);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to fetch metadata.";

    const status = message.toLowerCase().includes("not configured") ? 503 : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
