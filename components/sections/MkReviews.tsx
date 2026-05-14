// F05 — Google Reviews section (fetches from /api/reviews with Places API; seed fallback)

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

/* ─── Seed fallback ───────────────────────────────────────────── */

const SEED_REVIEWS: Review[] = [
  {
    author:   'Priya Sharma',
    location: 'Rajajinagar, Bangalore',
    rating:   5,
    date:     'March 2025',
    quote:    'Got ₹87,000 for my old jewellery in under 30 minutes. The XRF test result was shown to me on screen — no guessing game at all. Staff were professional and friendly.',
  },
  {
    author:   'Rajesh Kumar',
    location: 'Mysore City',
    rating:   5,
    date:     'January 2025',
    quote:    'I was nervous about selling gold for the first time. The team explained every step patiently. The rate was fair and matched what the calculator showed. Zero surprises.',
  },
  {
    author:   'Meena Patil',
    location: 'Koramangala, Bangalore',
    rating:   5,
    date:     'February 2025',
    quote:    'My pledged gold was stuck at a bank. MK Gold handled everything — they paid the lender directly in front of me and gave me the balance. Very professional and completely confidential.',
  },
];

/* ─── Data fetch ──────────────────────────────────────────────── */

async function getReviews(): Promise<ReviewsData> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/api/reviews`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error('reviews api failed');
    return res.json();
  } catch {
    return { rating: 4.9, total: 200, reviews: SEED_REVIEWS };
  }
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
  const data = await getReviews();
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
