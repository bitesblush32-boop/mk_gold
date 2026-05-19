import { NextRequest, NextResponse } from 'next/server';
import { createLead, getAllLeads, updateLeadRemarks, deleteLead } from '@/lib/db/leads';
import { getBranchBySlug } from '@/lib/branch-router';
import { sendWhatsApp } from '@/lib/whatsapp';
import { requireAdmin } from '@/lib/admin-auth';
import type { Lead } from '@/db/schema';

/* ─── Google Sheets sync (non-blocking, best-effort) ────────────── */

function sourceLabel(source: string, utmMedium?: string | null, utmSource?: string | null): string {
  const s = source.toLowerCase();
  if (s === 'admin') return 'Admin (Manual)';
  if (s.includes('whatsapp')) return 'WhatsApp';
  if (utmMedium === 'cpc' || utmMedium === 'ppc') return 'Paid Ad';
  if (utmSource?.toLowerCase().includes('facebook') || utmSource?.toLowerCase().includes('instagram')) return 'Social Ad';
  if (s === 'popup-lead-form' || s === 'popup') return 'Website Popup';
  if (s === 'contact-form') return 'Contact Form';
  if (s === 'appointment') return 'Appointment Form';
  if (s === 'branch-page') return 'Branch Page';
  if (s === 'sell-gold-page') return 'Sell Gold Page';
  if (s === 'pledged-gold-page') return 'Pledged Gold Page';
  if (s === 'chatbot') return 'AI Chatbot';
  return 'Website';
}

async function syncLeadToSheets(lead: Lead): Promise<void> {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!url) return;

  const ist     = new Date(lead.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const istDate = new Date(lead.created_at).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });

  const payload = JSON.stringify({
    date:         istDate,
    created_time: ist,
    name:         lead.name,
    phone:        lead.phone,
    city:         lead.city ?? '',
    gold_type:    lead.gold_type ?? '',
    weight:       lead.weight_grams ?? '',
    purity:       lead.purity_karat ? `${lead.purity_karat}K` : '',
    email:        lead.email ?? '',
    channel:      sourceLabel(lead.source, lead.utm_medium, lead.utm_source),
  });

  const postOptions: RequestInit = {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    payload,
  };

  try {
    // Google Apps Script /exec redirects POST → 302. Node fetch converts it to GET and
    // drops the body. Send with redirect:'manual', then manually re-POST to the Location.
    const res = await fetch(url, { ...postOptions, redirect: 'manual' });

    let finalRes: Response;
    if (res.status === 301 || res.status === 302 || res.status === 307 || res.status === 308) {
      const location = res.headers.get('location');
      if (!location) {
        console.error('[sheets-sync] redirect with no Location header');
        return;
      }
      finalRes = await fetch(location, postOptions);
    } else {
      finalRes = res;
    }

    if (!finalRes.ok) {
      const text = await finalRes.text().catch(() => '');
      console.error('[sheets-sync] HTTP error:', finalRes.status, text.slice(0, 200));
    }
  } catch (err) {
    console.error('[sheets-sync] failed:', err);
  }
}

/* ─── Simple in-memory rate limiter ─────────────────────────────── */

interface RateEntry { count: number; resetAt: number }
const rateLimitMap = new Map<string, RateEntry>();
const RATE_LIMIT   = 10;
const WINDOW_MS    = 60_000;

function checkRateLimit(ip: string): boolean {
  const now  = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

/* ─── GET /api/leads (admin-protected) ──────────────────────────── */

export async function GET(req: NextRequest) {
  const deny = requireAdmin(req);
  if (deny) return deny;

  const { searchParams } = new URL(req.url);
  const limitParam = searchParams.get('limit');
  const limit = limitParam ? Math.min(parseInt(limitParam, 10), 500) : 100;

  try {
    const all = await getAllLeads();
    const leads = all.slice(0, limit);
    return NextResponse.json({ leads, count: all.length });
  } catch (err) {
    console.error('[api/leads] GET error:', err);
    // Return empty on DB failure (table may not exist yet)
    return NextResponse.json({ leads: [], count: 0 });
  }
}

/* ─── PATCH /api/leads — update remarks (admin-protected) ───────── */

export async function PATCH(req: NextRequest) {
  const deny = requireAdmin(req);
  if (deny) return deny;

  let body: { id?: number; notes?: string };
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
  if (body.notes === undefined) return NextResponse.json({ error: 'notes is required' }, { status: 400 });

  try {
    const row = await updateLeadRemarks(body.id, body.notes);
    return NextResponse.json({ success: true, lead: row });
  } catch (err) {
    console.error('[api/leads] PATCH error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/* ─── DELETE /api/leads — delete lead (admin-protected) ─────────── */

export async function DELETE(req: NextRequest) {
  const deny = requireAdmin(req);
  if (deny) return deny;

  let body: { id?: number };
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

  try {
    await deleteLead(body.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[api/leads] DELETE error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/* ─── POST /api/leads ────────────────────────────────────────────── */

export async function POST(req: NextRequest) {
  // Rate limit by IP
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const {
    name,
    phone,
    email,
    city,
    area,
    branch_slug,
    gold_type,
    weight_grams,
    purity_karat,
    estimated_value,
    source     = 'website',
    source_page,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
  } = body as Record<string, string | number | undefined>;

  if (!name || !phone) {
    return NextResponse.json(
      { error: 'name and phone are required' },
      { status: 400 },
    );
  }

  if (typeof phone !== 'string' || !/^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''))) {
    return NextResponse.json(
      { error: 'Enter a valid 10-digit Indian mobile number' },
      { status: 400 },
    );
  }

  try {
    const lead = await createLead({
      name:            String(name),
      phone:           String(phone).replace(/\s/g, ''),
      email:           email ? String(email) : undefined,
      city:            city ? String(city) : undefined,
      area:            area ? String(area) : undefined,
      branch_slug:     branch_slug ? String(branch_slug) : undefined,
      gold_type:       gold_type ? String(gold_type) : undefined,
      weight_grams:    weight_grams != null ? String(weight_grams) : undefined,
      purity_karat:    purity_karat != null ? Number(purity_karat) : undefined,
      estimated_value: estimated_value != null ? String(estimated_value) : undefined,
      source:          String(source),
      source_page:     source_page ? String(source_page) : undefined,
      utm_source:      utm_source ? String(utm_source) : undefined,
      utm_medium:      utm_medium ? String(utm_medium) : undefined,
      utm_campaign:    utm_campaign ? String(utm_campaign) : undefined,
      utm_content:     utm_content ? String(utm_content) : undefined,
      status:          'new',
    });

    // Sync to Google Sheets (non-blocking)
    syncLeadToSheets(lead).catch(() => {});

    // Notify branch manager via WhatsApp (non-blocking)
    if (branch_slug) {
      const branch = getBranchBySlug(String(branch_slug));
      if (branch) {
        const msg = `New lead at MK Gold ${branch.area}:\nName: ${name}\nPhone: ${phone}${gold_type ? `\nGold: ${gold_type}` : ''}\nSource: ${source}`;
        sendWhatsApp(branch.whatsapp, msg).catch(() => {});
      }
    }

    return NextResponse.json({ success: true, id: lead.id }, { status: 201 });
  } catch (err) {
    console.error('[api/leads] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
