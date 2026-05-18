// Server component wrapper — exports page-specific metadata for the homepage
// The actual page UI lives in HomeClient.tsx ('use client')
import type { Metadata } from 'next';

export const revalidate = 300; // ISR: matches gold-rate + banners API cadence
import HomeClient from './HomeClient';
import { getFaqsByPage } from '@/lib/db/faqs';
import { getActiveBanners } from '@/lib/db/banners';

/* ─── Homepage-only JSON-LD (moved from layout.tsx) ─────────────── */

const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Gold Buying Service",
  provider: { "@type": "LocalBusiness", name: "MKGOLD" },
  areaServed: { "@type": "City", name: "Bangalore" },
  description: "Sell your old gold for instant cash at the best price in Bangalore with transparent gold testing and zero hidden charges.",
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How can I sell gold in Bangalore?", acceptedAnswer: { "@type": "Answer", text: "Visit any MK Gold branch in Bangalore to get instant cash for your gold with transparent XRF testing and the best MCX-linked market price. No appointment needed." } },
    { "@type": "Question", name: "Do you provide instant payment for gold?", acceptedAnswer: { "@type": "Answer", text: "Yes, MK Gold provides payment within 30 minutes after gold evaluation — by cash, UPI, NEFT or RTGS. No hidden charges." } },
    { "@type": "Question", name: "Is gold testing free at MK Gold?", acceptedAnswer: { "@type": "Answer", text: "Yes, gold purity testing using our German XRF spectrometer is 100% free and transparent. The result is shown on the machine screen before any price is quoted." } },
    { "@type": "Question", name: "What gold can I sell at MK Gold?", acceptedAnswer: { "@type": "Answer", text: "We buy all gold jewellery (22K, 24K), gold coins, gold bars, and broken or damaged gold pieces. No original receipts or hallmark certificates required." } },
  ],
};

export const metadata: Metadata = {
  title: 'MK Gold — Sell Gold in Karnataka | Instant Cash | 15 Years Trusted',
  description:
    "Karnataka's most trusted gold buyer since 2014. Live MCX rates, XRF purity test, payment in 30 minutes. 16 branches in Bangalore, Mysore, Mangalore & Davangere.",
  alternates: {
    canonical: 'https://mkgold.in',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://mkgold.in',
    siteName: 'MK Gold',
    title: 'MK Gold — Sell Gold in Karnataka | Instant Cash | 15 Years Trusted',
    description:
      "Karnataka's trusted gold buyer since 2014. Live MCX rates, XRF purity test, payment in 30 minutes. 16 branches.",
    images: [
      {
        url: 'https://mkgold.in/mkgoldlogo.png',
        width: 400,
        height: 400,
        alt: 'MK Gold — Sell Gold in Karnataka',
      },
    ],
  },
  keywords: [
    'sell gold Karnataka',
    'sell gold Bangalore',
    'sell gold Mysore',
    'sell gold Mangalore',
    'sell gold Davangere',
    'gold buyer Bangalore',
    'gold rate today Karnataka',
    'sell gold jewellery',
    'pledged gold release',
    'XRF gold testing',
    'MK Gold',
  ],
};

export default async function HomePage() {
  const [faqs, initialBanners] = await Promise.all([
    getFaqsByPage('general').catch(() => []),
    getActiveBanners().catch(() => []),
  ]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICE_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <HomeClient homeFaqs={faqs} initialBanners={initialBanners} />
    </>
  );
}
