import { MkTicker } from '@/components/layout/MkTicker';

export default function BranchesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MkTicker />
      {children}
    </>
  );
}
