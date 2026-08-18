import { listPublications, getR2Prefix } from "../../../../lib/r2";
import type { Publication } from "../../../../lib/types";

export interface FetchPublicationsOptions {
  category?: string;
  search?: string;
}

export interface FetchPublicationsResult {
  items: Publication[];
  total: number;
  categories: string[];
  error?: string;
}

export async function fetchPublications(
  options: FetchPublicationsOptions = {}
): Promise<FetchPublicationsResult> {
  try {
    const result = await listPublications({
      prefix: getR2Prefix(),
      category: options.category,
      search: options.search,
    });

    const categories = Array.from(
      new Set(result.items.map((item) => item.category))
    ).sort((a, b) => a.localeCompare(b));

    return {
      items: result.items,
      total: result.items.length,
      categories,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to load publications.";

    if (message.toLowerCase().includes("not configured")) {
      return {
        items: [],
        total: 0,
        categories: [],
        error:
          "Publications are temporarily unavailable because the document store has not been configured.",
      };
    }

    return {
      items: [],
      total: 0,
      categories: [],
      error: message,
    };
  }
}

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "—";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  const formatted =
    value < 10 && unitIndex > 0 ? value.toFixed(1) : Math.round(value).toString();
  return `${formatted} ${units[unitIndex]}`;
}

export function formatPublicationDate(isoDate: string): string {
  if (!isoDate) return "—";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getFileIconType(contentType: string, filename: string): "pdf" | "doc" | "sheet" | "image" | "other" {
  const lower = `${contentType} ${filename}`.toLowerCase();
  if (lower.includes("pdf")) return "pdf";
  if (
    lower.includes("msword") ||
    lower.includes("officedocument.word") ||
    lower.endsWith(".doc") ||
    lower.endsWith(".docx")
  )
    return "doc";
  if (
    lower.includes("spreadsheet") ||
    lower.includes("excel") ||
    lower.endsWith(".xls") ||
    lower.endsWith(".xlsx") ||
    lower.endsWith(".csv")
  )
    return "sheet";
  if (lower.startsWith("image/")) return "image";
  return "other";
}
