interface Props {
  params: Promise<{ "city]-gold-sell": string }>;
}

export default async function LpCityGoldSellPage({ params }: Props) {
  const resolvedParams = await params;
  const city = resolvedParams["city]-gold-sell"];

  return (
    <main>
      <p style={{ fontFamily: "Poppins, sans-serif", padding: "2rem" }}>
        MK Gold — LP: {city} Gold Sell (scaffold)
      </p>
    </main>
  );
}
