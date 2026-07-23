import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const UPLOADS_ROOT = path.join(process.cwd(), "public", "uploads");

const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "gif", "avif"]);

function sanitizeFilename(name: string): string {
  const ext = (name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const safeExt = ALLOWED_EXTENSIONS.has(ext) ? ext : "jpg";
  return `${randomUUID()}.${safeExt}`;
}

/**
 * Saves an uploaded image to public/uploads/{category}/ and returns the
 * public URL path (e.g. "/uploads/properties/abc123.jpg"). Files land on
 * the persistent volume mounted at public/uploads in production, so they
 * survive redeploys — see Dockerfile / docker-entrypoint.sh.
 */
export async function saveUpload(file: File, category: string): Promise<string> {
  if (!file || file.size === 0) {
    throw new Error("No file provided");
  }
  const safeCategory = category.replace(/[^a-z0-9-]/gi, "") || "general";
  const dir = path.join(UPLOADS_ROOT, safeCategory);
  await fs.mkdir(dir, { recursive: true });

  const filename = sanitizeFilename(file.name);
  const filePath = path.join(dir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);

  return `/uploads/${safeCategory}/${filename}`;
}

/** Deletes a previously-uploaded image given its public URL path. Safe no-op if missing. */
export async function deleteUpload(relativePath: string): Promise<void> {
  if (!relativePath || !relativePath.startsWith("/uploads/")) return;
  const filePath = path.join(process.cwd(), "public", relativePath);
  // Guard against path traversal escaping the uploads root.
  if (!filePath.startsWith(UPLOADS_ROOT)) return;
  try {
    await fs.unlink(filePath);
  } catch {
    // File already gone — nothing to do.
  }
}
