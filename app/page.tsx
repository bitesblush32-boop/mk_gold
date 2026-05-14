// Server component wrapper — exports page-specific metadata for the homepage
// The actual page UI lives in HomeClient.tsx ('use client')
import type { Metadata } from 'next';
import HomeClient from './HomeClient';

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

export default function HomePage() {
  return <HomeClient />;
}
