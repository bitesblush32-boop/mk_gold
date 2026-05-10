import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import type { Lead } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      phone,
      area,
      branch_slug,
      gold_type,
      weight_grams,
      purity_karat,
      estimated_value,
      source = "website",
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
    } = body as Lead;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "name and phone are required" },
        { status: 400 }
      );
    }

    const [lead] = await sql`
      INSERT INTO leads (
        name, phone, area, branch_slug, gold_type,
        weight_grams, purity_karat, estimated_value, source,
        utm_source, utm_medium, utm_campaign, utm_content
      ) VALUES (
        ${name}, ${phone}, ${area ?? null}, ${branch_slug ?? null}, ${gold_type ?? null},
        ${weight_grams ?? null}, ${purity_karat ?? null}, ${estimated_value ?? null}, ${source},
        ${utm_source ?? null}, ${utm_medium ?? null}, ${utm_campaign ?? null}, ${utm_content ?? null}
      )
      RETURNING id, created_at
    `;

    return NextResponse.json({ success: true, id: lead.id }, { status: 201 });
  } catch (err) {
    console.error("[api/leads] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
