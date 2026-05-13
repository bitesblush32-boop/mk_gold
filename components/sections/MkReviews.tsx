// F05 — Google Reviews section (static seed data; replace with Places API in Phase 2)

/* ─── Data ────────────────────────────────────────────────────── */

const REVIEWS = [
  {
    author:   'Priya Sharma',
    location: 'Rajajinagar, Bangalore',
    rating:   5,
    date:     'March 2025',
    quote:    'Got \u20b987,000 for my old jewellery in under 40 minutes. The XRF test result was shown to me on screen — no guessing game at all. Staff were professional and friendly.',
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
] as const;

/* ─── Star renderer ───────────────────────────────────────────── */

function Stars({ rating }: { rating: number }) {
  return (
    <div className="mk-review-card__stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`mk-review-card__star${i < rating ? ' mk-review-card__star--filled' : ''}`}
          aria-hidden="true"
        >
          {/* CSS-drawn star via ::before */}
        </span>
      ))}
    </div>
  );
}

/* ─── Component ───────────────────────────────────────────────── */

export function MkReviews() {
  return (
    <section className="mk-reviews mk-bg-light section" id="reviews">
      <div className="mk-container">

        {/* Header */}
        <div className="mk-reviews__header reveal">
          <p className="mk-section-overline">Customer Reviews</p>
          <div className="mk-reviews__aggregate">
            <span className="mk-reviews__aggregate-score">4.9</span>
            <div className="mk-reviews__aggregate-right">
              <Stars rating={5} />
              <p className="mk-reviews__aggregate-count">
                Based on 200+ Google Reviews
              </p>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="mk-reviews__grid">
          {REVIEWS.map((r, i) => (
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
                    {r.author.split(' ').map(n => n[0]).join('').slice(0, 2)}
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
