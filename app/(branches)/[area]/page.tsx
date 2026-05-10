import type { Metadata } from "next";
import { BRANCHES, getBranchBySlug } from "@/lib/branch-router";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ area: string }>;
}

export async function generateStaticParams() {
  return BRANCHES.map((b) => ({ area: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { area } = await params;
  const branch = getBranchBySlug(area);
  if (!branch) return {};

  return {
    title: `Sell Gold in ${branch.area} | Best Rate Today | MK Gold ${branch.city}`,
    description: `MK Gold ${branch.area} — Get instant cash for gold. Live MCX rates, XRF purity test, payment in 45 minutes. 11 years trusted. Call now.`,
    openGraph: {
      title: `Sell Gold in ${branch.area} | MK Gold`,
      description: `Live MCX rates, XRF purity test, payment in 45 minutes at MK Gold ${branch.area}.`,
      url: `https://mkgold.in/${area}`,
      siteName: "MK Gold",
      locale: "en_IN",
      type: "website",
    },
    alternates: { canonical: `https://mkgold.in/${area}` },
    robots: { index: true, follow: true },
  };
}

export default async function BranchPage({ params }: Props) {
  const { area } = await params;
  const branch = getBranchBySlug(area);

  if (!branch) notFound();

  return (
    <main>
      <p style={{ fontFamily: "Poppins, sans-serif", padding: "2rem" }}>
        MK Gold — {branch.name} ({branch.city}) — Branch page (scaffold)
      </p>
    </main>
  );
}
