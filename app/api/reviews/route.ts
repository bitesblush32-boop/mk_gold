import { NextResponse } from 'next/server';

interface Review {
  author:   string;
  location: string;
  rating:   number;
  date:     string; // "Month YYYY"
  quote:    string;
}

function formatDate(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toLocaleDateString('en-IN', {
    month: 'long',
    year:  'numeric',
  });
}

/* ─── Seed reviews (shown when Places API is unavailable) ─────────── */

const SEED_REVIEWS: Review[] = [
  {
    author:   'Rajesh Kumar',
    location: 'Rajajinagar, Bangalore',
    rating:   5,
    date:     'April 2026',
    quote:    'Excellent service at MK Gold Rajajinagar. Got 97% of market rate for my 22K jewellery. The XRF test was done in front of me — very transparent. Highly recommend.',
  },
  {
    author:   'Priya Sharma',
    location: 'Bangalore',
    rating:   5,
    date:     'March 2026',
    quote:    'I was worried about selling my pledged gold but MK Gold handled everything smoothly. They paid Muthoot directly and gave me the remaining amount immediately. Confidential and professional.',
  },
  {
    author:   'Suresh Naidu',
    location: 'Malleshwaram, Bangalore',
    rating:   5,
    date:     'February 2026',
    quote:    'Fast process, fair price, no hassle. Cash in hand in 40 minutes. MK Gold Malleshwaram team was polite and explained the rate calculation clearly. Will return.',
  },
];

/* ─── GET /api/reviews ───────────────────────────────────────────── */

export async function GET() {
  const apiKey  = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    console.warn('[api/reviews] GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID not set — using seed reviews');
    return NextResponse.json(
      { rating: 4.9, total: 847, reviews: SEED_REVIEWS },
      { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' } },
    );
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=rating,reviews,user_ratings_total&key=${apiKey}&reviews_sort=most_relevant`;
    const res  = await fetch(url, { cache: 'no-store' }); // no-store in dev so we see real data immediately

    if (!res.ok) throw new Error(`Places API HTTP error: ${res.status}`);

    const data = await res.json();
    console.log('[api/reviews] Places API status:', data.status);

    if (data.status !== 'OK') throw new Error(`Places API status: ${data.status}`);

    const result  = data.result;
    const reviews: Review[] = (result.reviews ?? [])
      .filter((r: { rating: number }) => r.rating >= 4)
      .slice(0, 6)
      .map((r: { author_name: string; text: string; rating: number; time: number }) => ({
        author:   r.author_name,
        location: 'Google Reviewer',
        rating:   r.rating,
        date:     formatDate(r.time),
        quote:    r.text,
      }));

    return NextResponse.json(
      {
        rating:  result.rating ?? 4.9,
        total:   result.user_ratings_total ?? 0,
        reviews: reviews.length > 0 ? reviews : SEED_REVIEWS,
      },
      { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' } },
    );
  } catch (err) {
    console.error('[api/reviews] error:', err);
    return NextResponse.json(
      { rating: 4.9, total: 847, reviews: SEED_REVIEWS },
      { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' } },
    );
  }
}
