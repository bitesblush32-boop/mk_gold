export interface GoldRate {
  timestamp: string;           // ISO string
  rate24k: number;             // per gram, INR
  rate22k: number;
  mcxRate: number;             // MCX per 10g
  source: "goldapi" | "fallback";
}

const FALLBACK_RATE_24K = 7200; // fallback per gram (update periodically)

function buildRates(rate24kPerGram: number): GoldRate {
  return {
    timestamp: new Date().toISOString(),
    rate24k: Math.round(rate24kPerGram),
    rate22k: Math.round(rate24kPerGram * (22 / 24)),
    mcxRate: Math.round(rate24kPerGram * 10),
    source: "goldapi",
  };
}

export async function fetchGoldRate(): Promise<GoldRate> {
  const apiKey = process.env.GOLD_API_KEY;

  if (!apiKey) {
    return { ...buildRates(FALLBACK_RATE_24K), source: "fallback" };
  }

  // USD/INR rate — update via USD_INR_RATE env var or defaults to 87
  const usdInr = parseFloat(process.env.USD_INR_RATE ?? "87");

  try {
    // GoldAPI free tier supports XAU/USD only; paid tier supports XAU/INR.
    // We fetch USD and convert to INR using the configured rate.
    const res = await fetch("https://www.goldapi.io/api/XAU/USD", {
      headers: { "x-access-token": apiKey },
      next: { revalidate: 300 },
    });

    if (res.status === 401 || res.status === 403) {
      throw new Error(`GoldAPI key invalid or plan insufficient (${res.status}). Check GOLD_API_KEY in .env.local.`);
    }
    if (!res.ok) throw new Error(`GoldAPI error: ${res.status}`);

    const data = await res.json();
    // GoldAPI returns price per troy oz — convert to per gram, then to INR
    // 1 troy oz = 31.1035 g
    const perGram = (data.price / 31.1035) * usdInr;
    return buildRates(perGram);
  } catch (err) {
    console.error("[gold-rate] fetch failed, using fallback", err);
    return { ...buildRates(FALLBACK_RATE_24K), source: "fallback" };
  }
}
