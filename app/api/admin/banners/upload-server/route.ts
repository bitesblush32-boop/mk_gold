import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { requireAdmin } from "@/lib/admin-auth";

/**
 * Server-side blob upload endpoint.
 * Accepts FormData { file: File, prefix?: string }
 * Uploads to Vercel Blob (production) or local /public/banners (localhost).
 * Returns { url: string }.
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

  try {
    let url: string;

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const safeName = `${prefix}${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const blob = await put(safeName, file, { access: "public" });
      url = blob.url;
    } else {
      // localhost fallback — write to /public/banners/
      const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const dir = join(process.cwd(), "public", "banners");
      await mkdir(dir, { recursive: true });
      await writeFile(
        join(dir, filename),
        Buffer.from(await file.arrayBuffer()),
      );
      url = `/banners/${filename}`;
    }

    return NextResponse.json({ url });
  } catch (err) {
    console.error("[api/admin/banners/upload-server] error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
