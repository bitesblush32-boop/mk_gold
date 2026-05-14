/**
 * seed-initial.ts
 * Seeds Railway PostgreSQL with:
 *   - 3 blog posts (published)
 *   - 4 hero banners (pointing to /public paths)
 *   - No gold rate override (use live MCX by default)
 *
 * Run: npx tsx scripts/seed-initial.ts
 */

import postgres from 'postgres';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error('DATABASE_URL not set'); process.exit(1); }

const sql = postgres(DATABASE_URL, { ssl: 'require', connect_timeout: 20 });

/* ─── Blog posts ──────────────────────────────────────────────── */

const BLOG_POSTS = [
  {
    title: 'Gold Rate in Bangalore Today — Live MCX Price & MK Gold Buying Rate',
    slug: 'gold-rate-bangalore-today',
    excerpt: 'Check today\'s live gold rate in Bangalore. MK Gold pays based on the MCX spot price — we show you the MCX rate and our margin side by side so you always know what you\'re getting.',
    category: 'Gold Rate',
    cover_image_url: null,
    published: true,
    body_json: JSON.stringify([
      { type: 'heading', level: 2, text: 'What is today\'s gold rate in Bangalore?' },
      { type: 'paragraph', text: 'The gold buying rate in Bangalore is based on the MCX (Multi Commodity Exchange) spot price, which updates throughout the trading day. MK Gold applies a transparent 2.5% margin on the MCX rate — this margin is shown openly next to the MCX price at every branch and on this website.' },
      { type: 'heading', level: 2, text: 'How MK Gold calculates your payout' },
      { type: 'paragraph', text: 'Your payout = (Net weight in grams) × (MCX rate per gram for your purity) × 97.5%. For example, if you have 10 grams of 22K gold and the MCX 22K rate is ₹6,200/gram, you receive ₹60,450.' },
      { type: 'heading', level: 2, text: 'Factors that affect the gold buying price' },
      { type: 'paragraph', text: 'The MCX rate, purity (karat), and net weight after XRF testing are the only three factors that determine your payout at MK Gold. There are no hidden deductions for making charges, melting, or jewellery design.' },
      { type: 'heading', level: 2, text: 'Why use an XRF spectrometer for purity testing?' },
      { type: 'paragraph', text: 'MK Gold uses a German XRF spectrometer — the same technology used by RBI-authorised assay centres. XRF testing is non-destructive (no acid, no scratching) and gives purity readings to two decimal places. The test result is shown to you on the machine\'s screen before any price is quoted.' },
      { type: 'heading', level: 2, text: 'Gold rates by purity — today\'s reference' },
      { type: 'paragraph', text: 'Check the live rate widget on this page for current rates. Rates update every 5 minutes from the MCX feed. MK Gold branches across Bangalore — Rajajinagar, Malleshwaram, Jayanagar, Koramangala, Indiranagar, Whitefield, JP Nagar, Vijayanagar, Basaveshwaranagar, and Yeshwanthpur — all use the same MCX-linked rate.' },
    ]),
  },
  {
    title: 'How to Sell Gold in Bangalore: 6 Steps to Get Paid in 45 Minutes',
    slug: 'how-to-sell-gold-bangalore',
    excerpt: 'Selling gold doesn\'t have to be stressful. This guide explains every step of the MK Gold process — from walking in to receiving payment — so you know exactly what to expect.',
    category: 'Sell Gold',
    cover_image_url: null,
    published: true,
    body_json: JSON.stringify([
      { type: 'heading', level: 2, text: 'Step 1: Walk in — no appointment needed' },
      { type: 'paragraph', text: 'MK Gold\'s 16 branches across Karnataka are open Monday to Saturday, 9:30 AM to 7:00 PM. You don\'t need an appointment. Bring your gold and one valid government photo ID — Aadhaar, PAN, Passport, Voter ID, or Driving Licence.' },
      { type: 'heading', level: 2, text: 'Step 2: Weight check' },
      { type: 'paragraph', text: 'Your gold is weighed on a calibrated digital scale in front of you. The gross weight and the weight of any non-gold components (stones, clasps) are noted separately. Net gold weight is what determines your payout.' },
      { type: 'heading', level: 2, text: 'Step 3: XRF purity test' },
      { type: 'paragraph', text: 'The MK Gold XRF spectrometer analyses your gold\'s composition in under 60 seconds without any acid or scratching. The purity percentage (e.g. 91.6% for 22K) is displayed on the machine\'s screen and converted to karat value.' },
      { type: 'heading', level: 2, text: 'Step 4: Price quotation' },
      { type: 'paragraph', text: 'Based on the XRF purity, net weight, and live MCX rate, MK Gold generates a price quotation. The MCX rate and MK Gold\'s 2.5% margin are both shown side by side so you can verify the calculation yourself. There is no pressure to accept.' },
      { type: 'heading', level: 2, text: 'Step 5: KYC documentation' },
      { type: 'paragraph', text: 'As per RBI guidelines, all gold purchase transactions require a government-issued photo ID. Aadhaar is preferred. For transactions above ₹2 lakh, PAN card is also required. Your details are kept confidential and never shared.' },
      { type: 'heading', level: 2, text: 'Step 6: Payment' },
      { type: 'paragraph', text: 'Payment is made immediately — by cash (up to ₹1.99 lakh per RBI rules), NEFT, RTGS, or UPI. The entire process from walking in to receiving payment takes 30 to 45 minutes.' },
    ]),
  },
  {
    title: 'Releasing Pledged Gold: How MK Gold Pays Your Lender Directly',
    slug: 'release-pledged-gold-from-bank',
    excerpt: 'If your gold is pledged at a bank or NBFC, MK Gold can release it on your behalf — paying the lender directly so you receive the difference. Here\'s how it works.',
    category: 'Pledged Gold',
    cover_image_url: null,
    published: true,
    body_json: JSON.stringify([
      { type: 'heading', level: 2, text: 'What is a pledged gold release?' },
      { type: 'paragraph', text: 'When gold is pledged as collateral for a loan at a bank or NBFC, the lender holds it until the loan is repaid. If you are unable to repay, MK Gold can purchase the gold and pay the lender directly — releasing the pledge and giving you the difference between MK Gold\'s buying price and your outstanding loan amount.' },
      { type: 'heading', level: 2, text: 'Which lenders does MK Gold work with?' },
      { type: 'paragraph', text: 'MK Gold works with most major banks (SBI, HDFC, ICICI, Canara Bank, Union Bank, Axis Bank, Kotak, Federal Bank) and NBFCs (Muthoot Finance, Manappuram, IIFL Gold Loan, Shriram Finance, Bajaj Finance). If your lender is not listed, contact us — we work with most RBI-regulated lenders.' },
      { type: 'heading', level: 2, text: 'The 3-step process' },
      { type: 'paragraph', text: 'Step 1: Share your loan account details with MK Gold — loan amount, lender name, and branch. Step 2: MK Gold evaluates the gold value and provides a quotation. If you accept, MK Gold pays the lender the outstanding amount directly — in front of you. Step 3: The lender releases the gold to you or directly to MK Gold. You receive the difference.' },
      { type: 'heading', level: 2, text: 'Is this process confidential?' },
      { type: 'paragraph', text: 'Yes. MK Gold\'s pledged gold release service is handled with complete discretion. Your details are not shared beyond what is required for the lender transaction. There is no judgment about your financial situation — pledging gold is a practical financial tool used by thousands of families.' },
      { type: 'heading', level: 2, text: 'How quickly can the gold be released?' },
      { type: 'paragraph', text: 'Same-day release is possible for most lenders, provided the lender\'s branch is open and all documentation is in order. MK Gold recommends contacting us before visiting to confirm the process with your specific lender.' },
    ]),
  },
];

/* ─── Hero banners ────────────────────────────────────────────── */

const HERO_BANNERS = [
  { src: '/brand/logo-dark.svg',    alt: 'MK Gold — Sell Gold Karnataka',            order: 1, is_active: true },
  { src: '/brand/logo-light.svg',   alt: 'MK Gold Instant Cash for Gold Karnataka',  order: 2, is_active: true },
  { src: '/brand/seal-en.svg',      alt: 'MK Gold — Trusted Gold Buyers Since 2014', order: 3, is_active: true },
  { src: '/brand/seal-kn.svg',      alt: 'MK Gold — ತಕ್ಷಣ ಹಣ ಶಾಶ್ವತ ವಿಶ್ವಾಸ',        order: 4, is_active: true },
];

/* ─── Main ────────────────────────────────────────────────────── */

async function main() {
  // Check existing data
  const existingPosts = await sql`SELECT COUNT(*) AS n FROM blog_posts`;
  const existingBanners = await sql`SELECT COUNT(*) AS n FROM hero_banners`;

  console.log(`Existing: ${existingPosts[0].n} blog posts, ${existingBanners[0].n} banners`);

  // Seed blog posts (skip slugs that already exist)
  let postsInserted = 0;
  for (const post of BLOG_POSTS) {
    const exists = await sql`SELECT id FROM blog_posts WHERE slug = ${post.slug}`;
    if (exists.length > 0) {
      console.log(`  - Skipping post (already exists): ${post.slug}`);
      continue;
    }
    await sql`
      INSERT INTO blog_posts (title, slug, excerpt, body_json, category, cover_image_url, published, published_at)
      VALUES (
        ${post.title}, ${post.slug}, ${post.excerpt}, ${post.body_json},
        ${post.category}, ${post.cover_image_url ?? null}, ${post.published}, NOW()
      )
    `;
    console.log(`  ✓ Blog post: ${post.title.slice(0, 60)}…`);
    postsInserted++;
  }

  // Seed banners only if table is empty
  let bannersInserted = 0;
  if (parseInt(existingBanners[0].n) === 0) {
    for (const banner of HERO_BANNERS) {
      await sql`
        INSERT INTO hero_banners (src, alt, "order", is_active)
        VALUES (${banner.src}, ${banner.alt}, ${banner.order}, ${banner.is_active})
      `;
      bannersInserted++;
    }
    console.log(`  ✓ ${bannersInserted} hero banners inserted`);
  } else {
    console.log(`  - Skipping banners (already seeded)`);
  }

  // Confirm gold_rate_override is empty (intentional — use live MCX)
  const overrides = await sql`SELECT COUNT(*) AS n FROM gold_rate_override`;
  console.log(`  ✓ gold_rate_override: ${overrides[0].n} rows (0 = live MCX, correct)`);

  console.log(`\nSeed complete. Inserted ${postsInserted} posts, ${bannersInserted} banners.`);
  await sql.end();
}

main().catch(e => { console.error(e); process.exit(1); });
