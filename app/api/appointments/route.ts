import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import type { Appointment } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      phone,
      branch_slug,
      slot_date,
      slot_time,
      notes,
    } = body as Appointment;

    if (!name || !phone || !branch_slug || !slot_date || !slot_time) {
      return NextResponse.json(
        { error: "name, phone, branch_slug, slot_date, slot_time are required" },
        { status: 400 }
      );
    }

    const [appt] = await sql`
      INSERT INTO appointments (
        name, phone, branch_slug, slot_date, slot_time, status, notes
      ) VALUES (
        ${name}, ${phone}, ${branch_slug}, ${slot_date}, ${slot_time}, 'pending', ${notes ?? null}
      )
      RETURNING id, created_at
    `;

    return NextResponse.json(
      { success: true, id: appt.id },
      { status: 201 }
    );
  } catch (err) {
    console.error("[api/appointments] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const branch = searchParams.get("branch");
  const date = searchParams.get("date");

  if (!branch || !date) {
    return NextResponse.json(
      { error: "branch and date query params required" },
      { status: 400 }
    );
  }

  const slots = await sql`
    SELECT slot_time, COUNT(*) as booked
    FROM appointments
    WHERE branch_slug = ${branch}
      AND slot_date = ${date}
      AND status != 'cancelled'
    GROUP BY slot_time
  `;

  return NextResponse.json({ slots });
}
