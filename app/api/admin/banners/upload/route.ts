import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';

/**
 * Vercel Blob client-upload handler.
 * The browser calls this route twice:
 *   1. type='blob.generate-client-token'  → we issue a short-lived upload token
 *   2. type='blob.upload-completed'       → Vercel notifies us the upload finished
 *
 * Using client upload means the file bytes go browser → Vercel Blob CDN directly,
 * completely bypassing the 4.5 MB API-route body limit.
 */
export async function POST(req: NextRequest) {
  let body: HandleUploadBody;
  try {
    body = (await req.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // Only the token-generation step is browser-initiated — require admin cookie for it.
  // The upload-completed callback originates from Vercel servers (no cookie).
  if (body.type === 'blob.generate-client-token') {
    const deny = requireAdmin(req);
    if (deny) return deny;
  }

  try {
    const jsonResponse = await handleUpload({
      body,
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
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
