import { NextRequest, NextResponse } from "next/server";
import { getPublicationStream } from "../../../../../../lib/r2";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ key: string[] }>;
}

function decodeKey(segments: string[]): string {
  return segments.map((segment) => decodeURIComponent(segment)).join("/");
}

function safeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9._-]+/g, "_");
}

export async function GET(req: NextRequest, context: RouteContext) {
  const { key: segments } = await context.params;

  if (!segments || segments.length === 0) {
    return NextResponse.json({ error: "Missing object key." }, { status: 400 });
  }

  const key = decodeKey(segments);

  try {
    const object = await getPublicationStream(key);

    if (!object || !object.body) {
      return NextResponse.json(
        { error: "Publication not found." },
        { status: 404 }
      );
    }

    const filename = safeFilename(object.filename);
    const headers = new Headers();
    headers.set(
      "Content-Type",
      object.contentType || "application/octet-stream"
    );
    headers.set(
      "Content-Disposition",
      `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(
        object.filename
      )}`
    );
    if (object.contentLength) {
      headers.set("Content-Length", String(object.contentLength));
    }
    headers.set("Cache-Control", "private, max-age=300");

    return new NextResponse(object.body as ReadableStream, {
      status: 200,
      headers,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to download file.";

    const status = message.toLowerCase().includes("not configured") ? 503 : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
