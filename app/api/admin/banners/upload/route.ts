import { handleUpload } from '@vercel/blob/client';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';

/**
 * Vercel Blob client-upload handler.
 *
 * The browser's @vercel/blob/client `upload()` calls this route twice:
 *   1. POST { type: 'blob.generate-client-token' }  — browser requests a short-lived token
 *   2. POST { type: 'blob.upload-completed' }        — Vercel webhook after upload finishes
 *
 * The file bytes travel browser → Vercel Blob CDN directly (step 3 in the SDK),
 * so they never pass through this API route. This bypasses Vercel's 4.5 MB body limit.
 */
export async function POST(req: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let body: Record<string, any>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // Only the token-generation step is browser-initiated and carries the admin cookie.
  // The upload-completed webhook originates from Vercel's servers (no user cookie).
  if (body.type === 'blob.generate-client-token') {
    const deny = requireAdmin(req);
    if (deny) return deny;
  }

  try {
    const jsonResponse = await handleUpload({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      body: body as any,
      request: req,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        maximumSizeInBytes: 10 * 1024 * 1024, // 10 MB
      }),
      onUploadCompleted: async ({ blob }) => {
        console.log('[blob] upload completed:', blob.url);
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (err) {
    console.error('[api/admin/banners/upload] error:', err);
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}

/** Quick health-check — confirms this route is deployed. */
export async function GET() {
  return NextResponse.json({ ok: true, route: 'banners/upload' });
}
