import postgres from "postgres";

// Railway Postgres connection
const connectionString = process.env.DATABASE_URL;

function createSqlClient() {
  if (connectionString) {
    return postgres(connectionString, { ssl: "require" });
  }
  // In dev without DATABASE_URL, create a client that will fail on first query
  // rather than at module load — prevents build-time errors
  return postgres("postgresql://localhost:5432/mkgold_dev", {
    connection: { application_name: "mkgold_dev" },
  });
}

export const sql = createSqlClient();

// ─── DB Types ──────────────────────────────────────────────────

export interface Lead {
  id?: number;
  name: string;
  phone: string;
  area?: string;
  branch_slug?: string;
  gold_type?: string;
  weight_grams?: number;
  purity_karat?: number;
  estimated_value?: number;
  source: "website" | "whatsapp" | "call" | "walkin";
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  created_at?: string;
}

export interface Appointment {
  id?: number;
  lead_id?: number;
  name: string;
  phone: string;
  branch_slug: string;
  slot_date: string;
  slot_time: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  notes?: string;
  created_at?: string;
}
