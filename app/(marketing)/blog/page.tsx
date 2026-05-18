import type { Metadata } from 'next';
import Image               from 'next/image';
import { MkNavbar }        from '@/components/layout/MkNavbar';
import { MkFooter }        from '@/components/layout/MkFooter';
import { MkBadge }         from '@/components/ui/MkBadge';
import { MkButton }        from '@/components/ui/MkButton';
import { MkCtaBand }       from '@/components/sections/MkCtaBand';
import { getPublishedPosts } from '@/lib/db/blog';
import { BlogPostGrid }    from './BlogPostGrid';

export const revalidate = 300; // ISR: blog is manually published, 5-min cadence is sufficient

export const metadata: Metadata = {
  title: 'Gold Buying Guide | Expert Insights | MK Gold',
  description:
    "Expert insights on gold rates, selling tips, pledged gold release and market news from MK Gold — Karnataka's trusted gold buyer since 2014.",
  alternates: { canonical: 'https://mkgold.in/blog' },
  openGraph: {
    title: 'Gold Buying Guide | Expert Insights | MK Gold',
    description: 'Expert tips on gold rates, selling, and pledged gold from MK Gold.',
    url: 'https://mkgold.in/blog',
    siteName: 'MK Gold',
    locale: 'en_IN',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

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

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  const [featured, ...rest] = posts;

  return (
    <main>
      <MkNavbar />

      {/* ── 1. Hero ───────────────────────────────────────────────── */}
      <section
        className="mk-bg-dark section"
        style={{ paddingTop: 'calc(var(--chrome-h) + var(--s-10))', paddingBottom: 'var(--s-10)' }}
      >
        <div className="mk-container">
          <div className="reveal" style={{ maxWidth: '640px' }}>
            <p className="mk-section-overline">MK Gold Editorial</p>
            <h1
              style={{
                fontFamily: 'Tanker, serif',
                fontSize: 'var(--t-h1)',
                color: 'var(--white)',
                margin: '0.5rem 0 1rem',
                lineHeight: 1.1,
              }}
            >
              Gold Buying{' '}
              <span style={{ color: 'var(--gold)' }}>Guide</span>
            </h1>
            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: 'var(--t-lg)',
                color: 'rgba(255,255,255,0.68)',
                margin: 0,
                lineHeight: 1.65,
              }}
            >
              Expert insights on gold rates, selling tips, and market news from MK Gold.
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. Featured post ──────────────────────────────────────── */}
      {featured && (
        <section
          className="mk-bg-light section"
          style={{ paddingTop: 'var(--s-10)', paddingBottom: 'var(--s-10)' }}
          aria-label="Featured article"
        >
          <div className="mk-container">
            <p
              className="mk-section-overline reveal"
              style={{ marginBottom: 'var(--s-5)' }}
            >
              Featured Article
            </p>
            <article className="mk-blog-featured reveal delay-1">
              {/* Cover image / placeholder */}
              <div className="mk-blog-featured__img">
                {featured.cover_image_url ? (
                  <Image
                    src={featured.cover_image_url}
                    alt={featured.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 60vw"
                    style={{ objectFit: 'cover' }}
                    priority
                  />
                ) : (
                  <div className="mk-blog-featured__placeholder mk-bg-dark">
                    <span className="mk-blog-featured__placeholder-karat">
                      24K
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="mk-blog-featured__content">
                <MkBadge variant={BADGE_VARIANT[featured.category] ?? 'gold'}>
                  {featured.category}
                </MkBadge>

                <h2 className="mk-blog-featured__title">
                  {featured.title}
                </h2>

                <p className="mk-blog-featured__excerpt">{featured.excerpt}</p>

                <div className="mk-blog-featured__meta">
                  <time
                    className="mk-blog-featured__date"
                    dateTime={featured.published_at}
                  >
                    {fmtDate(featured.published_at)}
                  </time>
                  <span className="mk-blog-featured__byline">
                    MK Gold Editorial Team
                  </span>
                </div>

                <MkButton
                  variant="outline-plum"
                  href={`/blog/${featured.slug}`}
                  style={{ marginTop: '1.5rem' }}
                >
                  Read Article
                </MkButton>
              </div>
            </article>
          </div>
        </section>
      )}

      {/* ── 3 & 4. Category filter + Post grid (client island) ────── */}
      <BlogPostGrid posts={rest} />

      {/* ── 5. CTA band + Footer ──────────────────────────────────── */}
      <MkCtaBand />
      <MkFooter />
    </main>
  );
}
