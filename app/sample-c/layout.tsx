import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sample C — Full Production | MK Gold Karnataka',
  description: 'MK Gold — Sell gold in Karnataka. Live MCX rates, XRF purity test, payment in 45 minutes. 16 branches across Bangalore, Mysore, Mangalore, Davangere.',
  robots: { index: false, follow: false },
};

export default function SampleCLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
