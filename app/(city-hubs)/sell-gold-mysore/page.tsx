import type { Metadata } from 'next';
import { CityHubPage } from '@/components/sections/CityHubPage';

export const metadata: Metadata = {
  title: 'Sell Gold in Mysore | Best Rate | MK Gold — 3 Branches',
  description:
    'Sell gold in Mysore at live MCX rates. MK Gold has 3 branches in Mysore City, Gokulam and Vijayanagar. XRF purity test. Payment in 30 minutes.',
  alternates: { canonical: 'https://mkgold.in/sell-gold-mysore' },
  openGraph: {
    title: 'Sell Gold in Mysore | Best Rate | MK Gold — 3 Branches',
    description:
      'Sell gold in Mysore at live MCX rates. MK Gold has 3 branches. XRF purity test. Payment in 30 minutes.',
    url: 'https://mkgold.in/sell-gold-mysore',
    siteName: 'MK Gold',
    locale: 'en_IN',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function SellGoldMysorePage() {
  return <CityHubPage city="Mysore" />;
}
