import type { Metadata } from 'next';
import { CityHubPage } from '@/components/sections/CityHubPage';

export const metadata: Metadata = {
  title: 'Sell Gold in Mangalore | Best Rate | MK Gold — 2 Branches',
  description:
    'Sell gold in Mangalore at live MCX rates. MK Gold branches in Mangalore City and Kadri. XRF purity test. Payment in 45 minutes.',
  alternates: { canonical: 'https://mkgold.in/sell-gold-mangalore' },
  openGraph: {
    title: 'Sell Gold in Mangalore | Best Rate | MK Gold — 2 Branches',
    description:
      'Sell gold in Mangalore at live MCX rates. MK Gold has 2 branches. XRF purity test. Payment in 45 minutes.',
    url: 'https://mkgold.in/sell-gold-mangalore',
    siteName: 'MK Gold',
    locale: 'en_IN',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function SellGoldMangalorePage() {
  return <CityHubPage city="Mangalore" />;
}
