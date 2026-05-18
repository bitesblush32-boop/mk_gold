// F05 — Google Reviews section (fetches directly from Google Places API)

/* ─── Types ───────────────────────────────────────────────────── */

interface Review {
  author: string;
  location: string;
  rating: number;
  date: string;
  quote: string;
}

interface ReviewsData {
  rating: number;
  total: number;
  reviews: Review[];
}

/* ─── Data fetch (direct Places API — no HTTP self-call) ──────── */

async function getReviews(): Promise<ReviewsData> {
  const apiKey  = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    throw new Error('GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID not configured');
  }

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=rating,reviews,user_ratings_total&key=${apiKey}&reviews_sort=most_relevant`;
  const res = await fetch(url, { next: { revalidate: 3600 } });

  if (!res.ok) throw new Error(`Places API HTTP ${res.status}`);

  const data = await res.json();
  if (data.status !== 'OK') throw new Error(`Places API status: ${data.status}`);

  const result = data.result;
  const reviews: Review[] = (result.reviews ?? [])
    .filter((r: { rating: number }) => r.rating >= 4)
    .slice(0, 6)
    .map((r: { author_name: string; text: string; rating: number; time: number }) => ({
      author:   r.author_name,
      location: 'Google Reviewer',
      rating:   r.rating,
      date:     new Date(r.time * 1000).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
      quote:    r.text,
    }));

  return {
    rating:  result.rating  ?? 4.9,
    total:   result.user_ratings_total ?? 0,
    reviews,
  };
}

/* ─── Star renderer ───────────────────────────────────────────── */

function Stars({ rating, animated = false }: { rating: number; animated?: boolean }) {
  return (
    <div className="mk-review-card__stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`mk-review-card__star${i < rating ? ' mk-review-card__star--filled' : ''}`}
          aria-hidden="true"
          style={animated ? {
            display: 'inline-block',
            animation: `mk-star-in 0.35s cubic-bezier(0.34,1.56,0.64,1) both`,
            animationDelay: `${i * 0.08}s`,
          } : undefined}
        />
      ))}
    </div>
  );
}

/* ─── Component ───────────────────────────────────────────────── */

export async function MkReviews() {
  let data: ReviewsData;
  try {
    data = await getReviews();
  } catch (err) {
    console.error('[MkReviews] failed to fetch reviews:', err);
    return null;
  }
  const reviews = data.reviews.slice(0, 3);
  const rating = data.rating ?? 4.9;
  const total  = data.total  ?? 200;

  return (
    <section className="mk-reviews mk-bg-light section" id="reviews">
      {/* Keyframes for star + glow animations */}
      <style>{`
        @keyframes mk-star-in {
          from { transform: scale(0) rotate(-30deg); opacity: 0; }
          to   { transform: scale(1) rotate(0deg);  opacity: 1; }
        }
        @keyframes mk-rating-glow {
          0%, 100% { filter: drop-shadow(0 0 4px rgba(223,193,96,0.4)); }
          50%       { filter: drop-shadow(0 0 12px rgba(223,193,96,0.85)); }
        }
      `}</style>

      <div className="mk-container">

        {/* Header */}
        <div className="mk-reviews__header reveal">
          <p className="mk-section-overline">Customer Reviews</p>
          <div className="mk-reviews__aggregate">

            {/* Animated 4.9 score block */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', flexWrap: 'wrap' }}>
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                background: 'var(--plum)', borderRadius: 'var(--r-xl)',
                padding: '0.75rem 1.25rem',
                animation: 'mk-rating-glow 2.5s ease-in-out infinite',
              }}>
                <span style={{
                  fontFamily: 'Tanker, serif',
                  fontSize: 'clamp(2.5rem,5vw,3.5rem)',
                  color: 'var(--gold)',
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                }}>
                  {rating}
                </span>
                <Stars rating={5} animated />
                <span style={{
                  fontFamily: 'Poppins, sans-serif', fontSize: 'var(--t-2xs)',
                  fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.75)', marginTop: '0.25rem',
                }}>
                  Google Rating
                </span>
              </div>

              <div>
                <p style={{ fontFamily: 'Tanker, serif', fontSize: 'var(--t-h3)', color: 'var(--ink)', margin: 0 }}>
                  Trusted by {total}+ customers
                </p>
                <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'var(--t-sm)', color: 'var(--ink-mid)', margin: '0.25rem 0 0' }}>
                  Based on verified Google Reviews
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Cards */}
        <div className="mk-reviews__grid">
          {reviews.map((r, i) => (
            <article
              key={r.author}
              className={`mk-review-card reveal delay-${i + 1}`}
              aria-label={`Review by ${r.author}`}
            >
              <Stars rating={r.rating} />
              <span className="mk-review-card__deco-quote" aria-hidden="true">&ldquo;</span>
              <blockquote className="mk-review-card__quote">
                &ldquo;{r.quote}&rdquo;
              </blockquote>
              <footer className="mk-review-card__footer">
                <div className="mk-review-card__author-row">
                  <div className="mk-review-card__avatar" aria-hidden="true">
                    {r.author.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="mk-review-card__author-info">
                    <strong className="mk-review-card__author">{r.author}</strong>
                    <span className="mk-review-card__meta">
                      {r.location} &middot; {r.date}
                    </span>
                  </div>
                </div>
                <span className="mk-review-card__source" aria-label="Source: Google">
                  Google
                </span>
              </footer>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
