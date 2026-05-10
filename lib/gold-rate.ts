export interface GoldRate {
  timestamp: string;           // ISO string
  rate24k: number;             // per gram, INR
  rate22k: number;
  rate20k: number;
  rate18k: number;
  mcxRate: number;             // MCX per 10g
  source: "goldapi" | "fallback";
}

const FALLBACK_RATE_24K = 7200; // fallback per gram (update periodically)

function buildRates(rate24kPerGram: number): GoldRate {
  return {
    timestamp: new Date().toISOString(),
    rate24k: Math.round(rate24kPerGram),
    rate22k: Math.round(rate24kPerGram * (22 / 24)),
    rate20k: Math.round(rate24kPerGram * (20 / 24)),
    rate18k: Math.round(rate24kPerGram * (18 / 24)),
    mcxRate: Math.round(rate24kPerGram * 10),
    source: "goldapi",
  };
}

export async function fetchGoldRate(): Promise<GoldRate> {
  const apiKey = process.env.GOLD_API_KEY;

  if (!apiKey) {
    return { ...buildRates(FALLBACK_RATE_24K), source: "fallback" };
  }

  try {
    const res = await fetch("https://www.goldapi.io/api/XAU/INR", {
      headers: { "x-access-token": apiKey },
      next: { revalidate: 300 },
    });

    if (!res.ok) throw new Error(`GoldAPI error: ${res.status}`);

    const data = await res.json();
    // GoldAPI returns price per troy oz — convert to per gram
    // 1 troy oz = 31.1035 g
    const perGram = data.price / 31.1035;
    return buildRates(perGram);
  } catch (err) {
    console.error("[gold-rate] fetch failed, using fallback", err);
    return { ...buildRates(FALLBACK_RATE_24K), source: "fallback" };
  }
}
