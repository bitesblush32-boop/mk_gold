import type { Metadata } from 'next';
import { CityHubPage } from '@/components/sections/CityHubPage';

export const metadata: Metadata = {
  title: 'Sell Gold in Davangere | Best Rate | MK Gold',
  description:
    'Sell gold in Davangere at live MCX rates. MK Gold Davangere branch. XRF purity test. Payment in 45 minutes.',
  alternates: { canonical: 'https://mkgold.in/sell-gold-davangere' },
  openGraph: {
    title: 'Sell Gold in Davangere | Best Rate | MK Gold',
    description:
      'Sell gold in Davangere at live MCX rates. XRF purity test. Payment in 45 minutes.',
    url: 'https://mkgold.in/sell-gold-davangere',
    siteName: 'MK Gold',
    locale: 'en_IN',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function SellGoldDavangerePage() {
  return <CityHubPage city="Davangere" />;
}
