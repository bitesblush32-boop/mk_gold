import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { password } = body;
  const secret = process.env.ADMIN_SECRET;

  if (!secret) {
    console.error('[admin/login] ADMIN_SECRET env var is not set');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  if (!password || password !== secret) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set('admin_auth', secret, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   86400, // 24 hours
    path:     '/',
  });
  return res;
}
