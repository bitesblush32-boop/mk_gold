import { MkNavbar }       from '@/components/layout/MkNavbar';
import { MkTicker }       from '@/components/layout/MkTicker';
import { MkFooter }       from '@/components/layout/MkFooter';
import { MkHero }         from '@/components/sections/MkHero';
import { MkStatBand }     from '@/components/sections/MkStatBand';
import { MkSteps }        from '@/components/sections/MkSteps';
import { MkTrust }        from '@/components/sections/MkTrust';
import { MkReviews }      from '@/components/sections/MkReviews';
import { MkFaq }          from '@/components/sections/MkFaq';
import { MkCtaBand }      from '@/components/sections/MkCtaBand';
import { MkBranchFinder } from '@/components/features/MkBranchFinder';

export default function HomePage() {
  return (
    <>
      <MkTicker />
      <MkNavbar />
      <main>
        <MkHero />
        <MkStatBand />
        <MkSteps />
        <MkTrust />
        <MkReviews />
        <MkBranchFinder />
        <MkFaq />
        <MkCtaBand />
      </main>
      <MkFooter />
    </>
  );
}
