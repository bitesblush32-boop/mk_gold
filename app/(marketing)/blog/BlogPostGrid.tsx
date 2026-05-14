'use client';

import { useState } from 'react';
import type { BlogPost } from '@/lib/db/blog';
import { MkBadge } from '@/components/ui/MkBadge';

/* ─── Constants ─────────────────────────────────────────────────── */

const CATEGORIES = ['All', 'Gold Rate', 'Sell Gold', 'Pledged Gold', 'Market Insights'] as const;
type Category = (typeof CATEGORIES)[number];

const BADGE_VARIANT: Record<string, 'gold' | 'plum' | 'gallery'> = {
  'Gold Rate':       'gold',
  'Sell Gold':       'plum',
  'Pledged Gold':    'gallery',
  'Market Insights': 'gallery',
  'News':            'gallery',
};

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

/* ─── Component ─────────────────────────────────────────────────── */

interface BlogPostGridProps { posts: BlogPost[]; }

export function BlogPostGrid({ posts }: BlogPostGridProps) {
  const [active, setActive] = useState<Category>('All');

  const filtered = active === 'All' ? posts : posts.filter(p => p.category === active);

  return (
    <section className="mk-bg-light section" id="post-grid">
      <div className="mk-container">

        {/* ── Category filter tabs ── */}
        <div
          className="mk-blog-filters reveal"
          role="tablist"
          aria-label="Filter posts by category"
        >
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              role="tab"
              aria-selected={active === cat}
              className={`mk-blog-filter${active === cat ? ' mk-blog-filter--active' : ''}`}
              onClick={() => setActive(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Post grid ── */}
        {filtered.length === 0 ? (
          <p className="mk-blog-empty">No posts in this category yet — check back soon.</p>
        ) : (
          <div className="mk-blog-grid">
            {filtered.map((post, i) => (
              <article
                key={post.slug}
                className={`mk-card mk-card--gallery mk-blog-card reveal delay-${Math.min(i + 1, 6)}`}
              >
                <div className="mk-blog-card__inner">
                  <MkBadge
                    variant={BADGE_VARIANT[post.category] ?? 'gallery'}
                    className="mk-blog-card__badge"
                  >
                    {post.category}
                  </MkBadge>

                  <h3 className="mk-blog-card__title">
                    <a href={`/blog/${post.slug}`} className="mk-blog-card__title-link">
                      {post.title}
                    </a>
                  </h3>

                  <p className="mk-blog-card__excerpt">{post.excerpt}</p>

                  <div className="mk-blog-card__foot">
                    <time
                      className="mk-blog-card__date"
                      dateTime={post.published_at}
                    >
                      {fmtDate(post.published_at)}
                    </time>
                    <a
                      href={`/blog/${post.slug}`}
                      className="mk-blog-card__read-more"
                      aria-label={`Read ${post.title}`}
                    >
                      Read More
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
