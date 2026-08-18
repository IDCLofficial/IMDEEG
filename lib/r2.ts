import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  HeadObjectCommand,
  type _Object,
} from "@aws-sdk/client-s3";

export interface PublicationObject {
  key: string;
  title: string;
  filename: string;
  size: number;
  lastModified: string;
  contentType: string;
  category: string;
  downloadUrl: string;
  viewUrl: string;
}

export interface ListPublicationsOptions {
  prefix?: string;
  category?: string;
  search?: string;
  limit?: number;
  cursor?: string;
}

export interface ListPublicationsResult {
  items: PublicationObject[];
  total: number;
  nextCursor?: string;
}

export interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  publicUrlBase?: string;
}

const DEFAULT_PREFIX = "publications/";

let cachedClient: S3Client | null = null;
let cachedConfig: R2Config | null = null;

function readConfig(): R2Config {
  if (cachedConfig) return cachedConfig;

  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET_NAME;
  const publicUrlBase = process.env.R2_PUBLIC_URL_BASE;

  if (!accountId || !accessKeyId || !secretAccessKey || !bucket) {
    throw new Error(
      "Cloudflare R2 is not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY and R2_BUCKET_NAME."
    );
  }

  cachedConfig = {
    accountId,
    accessKeyId,
    secretAccessKey,
    bucket,
    publicUrlBase,
  };

  return cachedConfig;
}

export function getR2Client(): S3Client {
  if (cachedClient) return cachedClient;

  const config = readConfig();

  cachedClient = new S3Client({
    region: "auto",
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });

  return cachedClient;
}

export function getR2Bucket(): string {
  return readConfig().bucket;
}

function getContentTypeFromKey(key: string): string {
  const lower = key.toLowerCase();
  if (lower.endsWith(".pdf")) return "application/pdf";
  if (lower.endsWith(".doc") || lower.endsWith(".docx"))
    return "application/msword";
  if (lower.endsWith(".xls") || lower.endsWith(".xlsx"))
    return "application/vnd.ms-excel";
  if (lower.endsWith(".ppt") || lower.endsWith(".pptx"))
    return "application/vnd.ms-powerpoint";
  if (lower.endsWith(".txt")) return "text/plain";
  if (lower.endsWith(".csv")) return "text/csv";
  if (lower.endsWith(".json")) return "application/json";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".svg")) return "image/svg+xml";
  return "application/octet-stream";
}

function humaniseFilename(filename: string): string {
  const dot = filename.lastIndexOf(".");
  const stem = dot > 0 ? filename.slice(0, dot) : filename;
  return stem
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function deriveCategoryFromKey(key: string, prefix: string): string {
  const remainder = key.startsWith(prefix) ? key.slice(prefix.length) : key;
  const parts = remainder.split("/").filter(Boolean);
  if (parts.length < 2) return "General";
  return humaniseFilename(parts[0]);
}

function filenameFromKey(key: string): string {
  const parts = key.split("/").filter(Boolean);
  return parts[parts.length - 1] || key;
}

function buildApiPath(action: "view" | "download", key: string): string {
  const encoded = key
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `/api/publications/${action}/${encoded}`;
}

function toPublication(object: _Object, prefix: string): PublicationObject | null {
  if (!object.Key || !object.Size || !object.LastModified) return null;

  const contentType = getContentTypeFromKey(object.Key);
  const filename = filenameFromKey(object.Key);
  const category = deriveCategoryFromKey(object.Key, prefix);

  return {
    key: object.Key,
    title: humaniseFilename(filename),
    filename,
    size: object.Size,
    lastModified: object.LastModified.toISOString(),
    contentType,
    category,
    downloadUrl: buildApiPath("download", object.Key),
    viewUrl: buildApiPath("view", object.Key),
  };
}

export async function listPublications(
  options: ListPublicationsOptions = {}
): Promise<ListPublicationsResult> {
  const client = getR2Client();
  const bucket = getR2Bucket();
  const prefix = options.prefix ?? DEFAULT_PREFIX;

  const items: PublicationObject[] = [];
  let isTruncated = true;
  let continuationToken: string | undefined = options.cursor;
  let total = 0;
  let nextCursor: string | undefined;

  const limit = options.limit ?? 1000;

  while (isTruncated) {
    const command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
      ContinuationToken: continuationToken,
    });

    const response = await client.send(command);
    const objects = (response.Contents ?? []).filter(
      (object) => object.Key && !object.Key.endsWith("/")
    );

    total += objects.length;

    for (const object of objects) {
      const publication = toPublication(object, prefix);
      if (!publication) continue;

      if (
        options.category &&
        publication.category.toLowerCase() !== options.category.toLowerCase()
      ) {
        continue;
      }

      if (options.search) {
        const needle = options.search.toLowerCase();
        const haystack = `${publication.title} ${publication.filename} ${publication.category}`.toLowerCase();
        if (!haystack.includes(needle)) continue;
      }

      items.push(publication);

      if (items.length >= limit) {
        break;
      }
    }

    isTruncated = !!response.IsTruncated;
    continuationToken = response.NextContinuationToken;
    nextCursor = continuationToken;

    if (items.length >= limit) {
      break;
    }
  }

  items.sort((a, b) => (a.lastModified < b.lastModified ? 1 : -1));

  return {
    items,
    total,
    nextCursor,
  };
}

export async function getPublicationMetadata(key: string): Promise<{
  contentType: string;
  contentLength: number;
  lastModified: string;
  filename: string;
} | null> {
  const client = getR2Client();
  const bucket = getR2Bucket();

  try {
    const command = new HeadObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    const response = await client.send(command);

    return {
      contentType:
        response.ContentType || getContentTypeFromKey(key),
      contentLength: response.ContentLength ?? 0,
      lastModified: (response.LastModified ?? new Date()).toISOString(),
      filename: filenameFromKey(key),
    };
  } catch (error) {
    console.error("Error fetching publication metadata:", error);
    return null;
  }
}

export async function getPublicationStream(key: string): Promise<{
  body: ReadableStream | ReadableStream<Uint8Array> | undefined;
  contentType: string;
  contentLength: number;
  lastModified: string;
  filename: string;
} | null> {
  const client = getR2Client();
  const bucket = getR2Bucket();

  try {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    const response = await client.send(command);

    if (!response.Body) return null;

    return {
      body: response.Body.transformToWebStream(),
      contentType:
        response.ContentType || getContentTypeFromKey(key),
      contentLength: response.ContentLength ?? 0,
      lastModified: (response.LastModified ?? new Date()).toISOString(),
      filename: filenameFromKey(key),
    };
  } catch (error) {
    console.error("Error fetching publication stream:", error);
    return null;
  }
}

export async function getPublicationBuffer(key: string): Promise<{
  buffer: Buffer;
  contentType: string;
  contentLength: number;
  lastModified: string;
  filename: string;
} | null> {
  const client = getR2Client();
  const bucket = getR2Bucket();

  try {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    const response = await client.send(command);

    if (!response.Body) return null;

    const bytes = await response.Body.transformToByteArray();
    const buffer = Buffer.from(bytes);

    return {
      buffer,
      contentType:
        response.ContentType || getContentTypeFromKey(key),
      contentLength: response.ContentLength ?? buffer.length,
      lastModified: (response.LastModified ?? new Date()).toISOString(),
      filename: filenameFromKey(key),
    };
  } catch (error) {
    console.error("Error fetching publication buffer:", error);
    return null;
  }
}

export function getR2Prefix(): string {
  return process.env.R2_PUBLICATIONS_PREFIX || DEFAULT_PREFIX;
}
