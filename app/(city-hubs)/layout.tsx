import { MkTicker } from '@/components/layout/MkTicker';

export default function CityHubsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MkTicker />
      {children}
    </>
  );
}
