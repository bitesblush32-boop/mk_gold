import type { Metadata } from 'next';

export const revalidate = 3600; // ISR: city hub content changes infrequently

import { CityHubPage } from '@/components/sections/CityHubPage';

export const metadata: Metadata = {
  title: 'Sell Gold in Bangalore | Best Rate | MK Gold — 10 Branches',
  description:
    'Sell gold in Bangalore at live MCX rates. MK Gold has 10 branches across Rajajinagar, Malleshwaram, Indiranagar, Koramangala, Whitefield and more. XRF purity test. Payment in 30 minutes.',
  alternates: { canonical: 'https://mkgold.in/sell-gold-bangalore' },
  openGraph: {
    title: 'Sell Gold in Bangalore | Best Rate | MK Gold — 10 Branches',
    description:
      'Sell gold in Bangalore at live MCX rates. MK Gold has 10 branches. XRF purity test. Payment in 30 minutes.',
    url: 'https://mkgold.in/sell-gold-bangalore',
    siteName: 'MK Gold',
    locale: 'en_IN',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function SellGoldBangalorePage() {
  return <CityHubPage city="Bangalore" />;
}
