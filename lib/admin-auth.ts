import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/** Returns a 401 response if admin_auth cookie doesn't match ADMIN_SECRET. */
export function requireAdmin(request: NextRequest): NextResponse | null {
  const auth   = request.cookies.get('admin_auth');
  const secret = process.env.ADMIN_SECRET;
  if (!secret || auth?.value !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null; // allowed
}
