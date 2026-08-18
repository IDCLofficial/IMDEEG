import { NextRequest, NextResponse } from "next/server";
import { listPublications, getR2Prefix } from "../../../../lib/r2";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("q") || undefined;
    const cursor = searchParams.get("cursor") || undefined;
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? Number.parseInt(limitParam, 10) : undefined;

    const result = await listPublications({
      prefix: getR2Prefix(),
      category,
      search,
      cursor,
      limit: Number.isFinite(limit) ? limit : undefined,
    });

    return NextResponse.json({
      items: result.items,
      total: result.total,
      nextCursor: result.nextCursor,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to load publications.";

    const status = message.toLowerCase().includes("not configured") ? 503 : 500;

    return NextResponse.json(
      {
        error: message,
      },
      { status }
    );
  }
}
