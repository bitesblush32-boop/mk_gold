import { db } from '@/db';
import { faqs } from '@/db/schema';
import type { FaqRow } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

/* ─── Public type ────────────────────────────────────────────────── */

export interface FaqItem { q: string; a: string; }

/* ─── Hardcoded fallbacks (shown when DB is empty or unreachable) ── */

const FALLBACK: Record<string, FaqItem[]> = {
  general: [
    { q: 'How is gold purity tested at MK Gold?', a: 'We use a Bruker S1 Titan XRF (X-Ray Fluorescence) spectrometer — a German instrument used by jewellers and refineries worldwide. It reads the exact elemental composition of your gold in under 2 minutes without any acid, scratching, or damage to your jewellery.' },
    { q: 'What types of gold do you buy?', a: 'We buy gold jewellery (any design, any age), gold coins, gold bars, and broken or damaged gold pieces. We accept 22K and 24K gold. We do not accept gold-plated items or gold-filled jewellery.' },
    { q: 'How is the buying rate calculated?', a: 'Our rate is based on live MCX (Multi Commodity Exchange) gold prices, updated every 5 minutes. We pay 97.5% of the MCX rate — our 2.5% margin is shown openly next to the MCX rate so you can verify it yourself.' },
    { q: 'How long does the entire process take?', a: 'From the moment you walk in to receiving payment, the process takes around 30 minutes for most customers. Weighing takes 5 minutes, XRF testing takes 2 minutes, and payment is immediate once you accept the offer.' },
    { q: 'What documents do I need to bring?', a: 'You need any one valid government-issued photo ID: Aadhaar card, PAN card, Passport, Voter ID, or Driving Licence. No original purchase receipts or hallmark certificates are required.' },
    { q: 'Can you help release gold pledged at a bank or NBFC?', a: 'Yes. We pay the outstanding loan amount directly to your bank or NBFC in front of you, and you receive the balance amount. We handle the full paperwork. Your privacy is protected throughout the process.' },
    { q: 'Do I need an appointment or can I walk in?', a: 'Walk-ins are welcome at all 16 branches during working hours (Monday to Saturday, 9:30 AM to 7:00 PM). Booking an appointment ensures you are attended to immediately, but it is never required.' },
  ],
  'pledged-gold': [
    { q: 'How quickly can the release happen?', a: 'In most cases, the same day. Once you share your loan details and lender branch, we coordinate a visit together. The lender releases your gold the moment the outstanding amount is settled — which we do directly in front of you.' },
    { q: 'What documents do you need from me?', a: 'Your original loan agreement or pledge card from the lender, and one valid government photo ID — Aadhaar, PAN, or Passport. You do not need original purchase receipts or hallmark certificates for the gold.' },
    { q: 'What if my gold is pledged with multiple lenders?', a: 'We handle each lender separately. Each outstanding loan is settled individually, and you receive the balance from each transaction. There is no additional complexity or paperwork for you to manage.' },
    { q: 'Is this process fully legal?', a: 'Yes. We repay your outstanding loan through a standard banking transaction, directly to the lender in front of you. The lender then releases your gold. We then proceed with the purchase if you choose to sell. Every step follows RBI guidelines for gold loan settlement.' },
    { q: 'Will MK Gold buy my gold after it is released?', a: 'That is entirely your choice. Once your gold is released, you decide what to do with it. Many customers choose to sell to us at the same visit, but there is no obligation at any point. We are here to help you recover your gold — nothing more.' },
  ],
  'gold-rate': [
    { q: 'What is the MCX gold rate?', a: 'MCX (Multi Commodity Exchange of India) is the regulated exchange where gold is traded in futures contracts. The MCX gold rate is the benchmark price in Indian Rupees per 10 grams for 24K (999 purity) gold. It updates continuously during market hours (9:00 AM to 11:30 PM on trading days) and is the most trusted reference point for gold pricing in India.' },
    { q: 'How often does MK Gold update its rate?', a: 'Our rate is refreshed automatically every 5 minutes from the live MCX feed. The rate shown on this page is never more than 5 minutes old. At our branches, the buying rate is updated throughout the day in line with MCX movement — so the rate you see online closely matches what you will receive when you walk in.' },
    { q: 'Is the rate different for 22K vs 24K gold?', a: 'Yes. The base MCX rate is always for 24K (pure) gold. For 22K gold, the rate is calculated by multiplying by the purity factor: 22K = 91.67%. Our Bruker XRF spectrometer tests the exact elemental purity of your gold — not the hallmark stamp — so you are always paid for what you actually have, not what is printed on the jewellery.' },
    { q: "Can I lock in today's rate?", a: "Gold rates are live and fluctuate during market hours. We are unable to lock a rate in advance. However, once you visit a branch and accept our offer, the agreed rate is binding and payment is made immediately. If the rate moves between the time you check online and when you arrive, the branch will quote based on the live MCX rate at that moment — both rates are shown to you openly." },
  ],
};

/* ─── Public: get active FAQs for a page ─────────────────────────── */

export async function getFaqsByPage(page: string): Promise<FaqItem[]> {
  try {
    const rows = await db
      .select()
      .from(faqs)
      .where(eq(faqs.is_active, true))
      .orderBy(asc(faqs.order), asc(faqs.created_at))
      .then(all => all.filter(r => r.page === page));

    if (rows.length > 0) {
      return rows.map(r => ({ q: r.question, a: r.answer }));
    }
    return FALLBACK[page] ?? [];
  } catch {
    return FALLBACK[page] ?? [];
  }
}

/* ─── Admin: get all FAQs for a page (active + inactive) ─────────── */

export async function getAllFaqsByPageAdmin(page: string): Promise<FaqRow[]> {
  return db
    .select()
    .from(faqs)
    .where(eq(faqs.page, page))
    .orderBy(asc(faqs.order), asc(faqs.created_at));
}

/* ─── Admin: create ──────────────────────────────────────────────── */

export async function createFaq(data: {
  page: string; question: string; answer: string; order?: number;
}): Promise<FaqRow> {
  const [row] = await db.insert(faqs).values({
    page:     data.page,
    question: data.question,
    answer:   data.answer,
    order:    data.order ?? 0,
    is_active: true,
  }).returning();
  return row;
}

/* ─── Admin: update ──────────────────────────────────────────────── */

export async function updateFaq(id: number, data: Partial<{
  question: string; answer: string; is_active: boolean; order: number;
}>): Promise<void> {
  await db.update(faqs)
    .set({ ...data, updated_at: new Date() })
    .where(eq(faqs.id, id));
}

/* ─── Admin: delete ──────────────────────────────────────────────── */

export async function deleteFaq(id: number): Promise<void> {
  await db.delete(faqs).where(eq(faqs.id, id));
}

/* ─── Admin: bulk reorder ────────────────────────────────────────── */

export async function reorderFaqs(orderedIds: number[]): Promise<void> {
  await Promise.all(
    orderedIds.map((id, idx) =>
      db.update(faqs).set({ order: idx, updated_at: new Date() }).where(eq(faqs.id, id))
    )
  );
}
