import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { requireAdmin } from "@/lib/admin-auth";

/**
 * Localhost-only file upload endpoint.
 *
 * Accepts: multipart/form-data { file: File, prefix?: string }
 * Returns: { url: string }
 *
 * This route ONLY saves the file to /public/banners/ (or /public/banners/mobile/)
 * and returns the public URL. It does NOT write to the database.
 * The DB record is created separately by the main POST /api/admin/banners handler
 * once all images (desktop + mobile) have been uploaded.
 *
 * Used as the fallback when BLOB_READ_WRITE_TOKEN is not set (local dev).
 */
export async function POST(req: NextRequest) {
  const deny = requireAdmin(req);
  if (deny) return deny;

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Expected multipart/form-data" },
      { status: 400 },
    );
  }

  const file = formData.get("file") as File | null;
  const prefix = (formData.get("prefix") as string | null) ?? "banners/";

  if (!file) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "File must be an image" },
      { status: 400 },
    );
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json(
      { error: "File size exceeds 5 MB limit" },
      { status: 400 },
    );
  }

  try {
    // Determine subdirectory from prefix (e.g. "banners/" → /public/banners/, "banners/mobile/" → /public/banners/mobile/)
    const subdir = prefix.replace(/^\//, "").replace(/\/$/, ""); // strip leading/trailing slashes
    const dir = join(process.cwd(), "public", subdir);
    await mkdir(dir, { recursive: true });

    const safeFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(join(dir, safeFilename), buffer);

    const url = `/${subdir}/${safeFilename}`;
    return NextResponse.json({ url }, { status: 200 });
  } catch (err) {
    console.error("[api/admin/banners/upload-local] error:", err);
    return NextResponse.json({ error: "File save failed" }, { status: 500 });
  }
}
