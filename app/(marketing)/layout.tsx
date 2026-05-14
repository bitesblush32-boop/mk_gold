import { MkTicker } from '@/components/layout/MkTicker';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MkTicker />
      {children}
    </>
  );
}
