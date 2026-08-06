import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MkNavbar } from "@/components/layout/MkNavbar";
import { MkFooter } from "@/components/layout/MkFooter";
import { MkBadge } from "@/components/ui/MkBadge";
import { MkButton } from "@/components/ui/MkButton";
import { MkRateWidget } from "@/components/features/MkRateWidget";
import { MkCtaBand } from "@/components/sections/MkCtaBand";
import { articleSchema } from "@/lib/schema/article";
import { getPostBySlug, getRelatedPosts } from "@/lib/db/blog";
import type { BlogPost } from "@/lib/db/blog";

export const revalidate = 300; // ISR: blog is manually published, 5-min cadence is sufficient

/* ─── Params type (Next.js 15+ async params) ────────────────────── */

interface Props {
  params: Promise<{ slug: string }>;
}

/* ─── generateMetadata ──────────────────────────────────────────── */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post Not Found | MK Gold" };

  const ogImage = post.cover_image_url
    ? [{ url: post.cover_image_url, width: 1200, height: 630, alt: post.title }]
    : [
        {
          url: "https://mkgold.in/brand/og-default.jpg",
          width: 1200,
          height: 630,
          alt: "MK Gold — Gold Buying Experts",
        },
      ];

  return {
    title: `${post.title} | MK Gold`,
    description: post.excerpt,
    alternates: { canonical: `https://mkgold.in/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://mkgold.in/blog/${slug}`,
      siteName: "MK Gold",
      locale: "en_IN",
      type: "article",
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      section: post.category,
      authors: ["MK Gold Editorial Team"],
      images: ogImage,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: ogImage.map((i) => i.url),
    },
    robots: { index: true, follow: true },
  };
}

/* ─── Helpers ───────────────────────────────────────────────────── */

const BADGE_VARIANT: Record<string, "gold" | "plum" | "gallery"> = {
  "Gold Rate": "gold",
  "Sell Gold": "plum",
  "Pledged Gold": "gallery",
  "Market Insights": "gallery",
  News: "gallery",
};

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Render body_json as readable HTML.
 * Handles plain text (seed data, paragraphs split by \n\n) and
 * basic Portable Text JSON arrays.
 * Swap for @portabletext/react when Sanity is integrated in Phase 3.
 */
function renderBody(bodyJson: string): React.ReactNode {
  // HTML content from the rich-text editor — detect any HTML tag anywhere in the string,
  // not just at the start (e.g. "Text... <a href="...">link</a> ...more text")
  if (/<[a-z][^>]*>/i.test(bodyJson)) {
    // External links: open new tab + rel="noopener noreferrer"
    // Internal links (start with / or point to mkgold.in): stay in same tab, pass link equity
    const safe = bodyJson.replace(/<a(\s[^>]*)>/gi, (_match, attrs) => {
      const hrefMatch = attrs.match(/href=["']([^"']*)["']/i);
      const href = hrefMatch ? hrefMatch[1] : "";
      const isExternal = /^https?:\/\/(?!(?:www\.)?mkgold\.in)/i.test(href);
      if (isExternal) {
        const hasTarget = /\btarget=/i.test(attrs);
        const hasRel = /\brel=/i.test(attrs);
        let out = attrs;
        if (!hasTarget) out += ' target="_blank"';
        if (!hasRel) out += ' rel="noopener noreferrer"';
        return `<a${out}>`;
      }
      return `<a${attrs}>`;
    });
    return (
      <div
        className="mk-article__body"
        dangerouslySetInnerHTML={{ __html: safe }}
      />
    );
  }

  // Attempt Portable Text JSON
  let parsed: unknown = null;
  try {
    parsed = JSON.parse(bodyJson);
  } catch {
    /* not JSON */
  }

  if (Array.isArray(parsed)) {
    return (parsed as Array<Record<string, unknown>>).map((block, i) => {
      const style = String(block.style ?? "normal");
      const text = Array.isArray(block.children)
        ? (block.children as Array<Record<string, unknown>>)
            .map((c) => String(c.text ?? ""))
            .join("")
        : "";
      if (style === "h2")
        return (
          <h2 key={i} className="mk-article__h2">
            {text}
          </h2>
        );
      if (style === "h3")
        return (
          <h3 key={i} className="mk-article__h3">
            {text}
          </h3>
        );
      if (style === "blockquote") {
        return (
          <blockquote key={i} className="mk-article__blockquote">
            <p>{text}</p>
          </blockquote>
        );
      }
      return (
        <p key={i} className="mk-article__para">
          {text}
        </p>
      );
    });
  }

  // Plain text — split by double newlines, render \n as <br>
  return bodyJson
    .split(/\n\n+/)
    .filter(Boolean)
    .map((para, i) => {
      const lines = para.split("\n");
      return (
        <p key={i} className="mk-article__para">
          {lines.map((line, j) => (
            <span key={j}>
              {line}
              {j < lines.length - 1 && <br />}
            </span>
          ))}
        </p>
      );
    });
}

function RelatedCard({ post }: { post: BlogPost }) {
  return (
    <article className="mk-card mk-card--gallery mk-blog-card">
      <div className="mk-blog-card__inner">
        <MkBadge variant={BADGE_VARIANT[post.category] ?? "gallery"}>
          {post.category}
        </MkBadge>
        <h3 className="mk-blog-card__title">
          <a href={`/blog/${post.slug}`} className="mk-blog-card__title-link">
            {post.title}
          </a>
        </h3>
        <p className="mk-blog-card__excerpt">{post.excerpt}</p>
        <div className="mk-blog-card__foot">
          <time className="mk-blog-card__date" dateTime={post.published_at}>
            {fmtDate(post.published_at)}
          </time>
          <a href={`/blog/${post.slug}`} className="mk-blog-card__read-more">
            Read More
          </a>
        </div>
      </div>
    </article>
  );
}

/* ─── Page ──────────────────────────────────────────────────────── */

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  // Fetch post + related in parallel
  const post = await getPostBySlug(slug);
  if (!post || !post.published) notFound();

  const related = await getRelatedPosts(post.category, slug);
  const isGoldRatePost = post.category === "Gold Rate";

  const articleJsonLd = articleSchema({
    title: post.title,
    description: post.excerpt,
    url: `https://mkgold.in/blog/${slug}`,
    datePublished: post.published_at,
    dateModified: post.updated_at, // real last-edit timestamp
    imageUrl: post.cover_image_url,
  });

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://mkgold.in",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://mkgold.in/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.category,
        item: `https://mkgold.in/blog/${slug}`,
      },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <MkNavbar />

      {/* ── 1. Breadcrumb + post hero ─────────────────────────────── */}
      <section
        className={post.cover_image_url ? "section" : "mk-bg-dark section"}
        style={{
          paddingTop: "calc(var(--chrome-h) + var(--s-8))",
          paddingBottom: "var(--s-10)",
          position: "relative",
          overflow: "hidden",
          // Fallback bg colour when no image
          backgroundColor: post.cover_image_url
            ? "var(--plum-deep)"
            : undefined,
        }}
      >
        {/* Cover image + overlay — only when an image exists */}
        {post.cover_image_url && (
          <>
            {/* Actual <img> tag — required for Google Images + Discover indexing.
                CSS background-image is invisible to crawlers. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.cover_image_url}
              alt={post.title}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                zIndex: 0,
              }}
            />
            {/* Dark gradient overlay — darker at edges so text is readable */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to bottom, rgba(27,8,36,0.88) 0%, rgba(27,8,36,0.60) 45%, rgba(27,8,36,0.82) 100%)",
                zIndex: 1,
              }}
            />
          </>
        )}

        {/* Content sits above image + overlay */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <div
            className="mk-container"
            style={{ maxWidth: "860px", margin: "0 auto" }}
          >
            <nav aria-label="Breadcrumb" className="mk-breadcrumb reveal">
              <Link href="/" className="mk-breadcrumb__link">
                Home
              </Link>
              <span className="mk-breadcrumb__sep" aria-hidden="true">
                ›
              </span>
              <Link href="/blog" className="mk-breadcrumb__link">
                Blog
              </Link>
              <span className="mk-breadcrumb__sep" aria-hidden="true">
                ›
              </span>
              <span className="mk-breadcrumb__current">{post.category}</span>
            </nav>

            <div className="reveal delay-1" style={{ marginTop: "var(--s-5)" }}>
              <MkBadge variant={BADGE_VARIANT[post.category] ?? "white"}>
                {post.category}
              </MkBadge>

              <h1
                style={{
                  fontFamily: "Tanker, serif",
                  fontSize: "var(--t-h1)",
                  color: "var(--white)",
                  margin: "0.875rem 0 1.25rem",
                  lineHeight: 1.1,
                }}
              >
                {post.title}
              </h1>

              <div className="mk-post-hero-meta">
                <time
                  dateTime={post.published_at}
                  className="mk-post-hero-meta__date"
                >
                  {fmtDate(post.published_at)}
                </time>
                <span className="mk-post-hero-meta__sep" aria-hidden="true">
                  ·
                </span>
                <span className="mk-post-hero-meta__author">
                  By MK Gold Editorial Team
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Article body ───────────────────────────────────────── */}
      <section
        style={{ background: "var(--gallery)", paddingBlock: "var(--s-10)" }}
      >
        <div className="mk-container">
          <div
            className={`mk-article-layout${isGoldRatePost ? " mk-article-layout--with-aside" : ""}`}
          >
            <article className="mk-article">
              {renderBody(post.body_json)}
            </article>

            {isGoldRatePost && (
              <aside className="mk-post-rate-aside">
                <p
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "var(--t-xs)",
                    fontWeight: 700,
                    color: "var(--mist)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    margin: "0 0 0.875rem",
                  }}
                >
                  Live Rate
                </p>
                <MkRateWidget variant="compact" />
                <MkButton
                  variant="outline-plum"
                  href="/gold-rate-today"
                  style={{
                    marginTop: "1rem",
                    width: "100%",
                    textAlign: "center" as const,
                  }}
                >
                  Full Rate Page
                </MkButton>
              </aside>
            )}
          </div>
        </div>
      </section>

      {/* ── 3. Author block ───────────────────────────────────────── */}
      <section
        style={{ background: "var(--white)", paddingBlock: "var(--s-8)" }}
      >
        <div
          className="mk-container"
          style={{ maxWidth: "860px", margin: "0 auto" }}
        >
          <div className="mk-author-block">
            <div className="mk-author-block__avatar" aria-hidden="true">
              MK
            </div>
            <div className="mk-author-block__info">
              <p className="mk-author-block__name">MK Gold Editorial Team</p>
              <p className="mk-author-block__bio">
                Our editorial team consists of gold market experts with 15+
                years of experience in the Karnataka gold buying industry. We
                provide transparent, accurate information to help you make
                confident decisions about selling your gold.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Related posts ──────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="mk-bg-light section">
          <div className="mk-container">
            <p
              className="mk-section-overline reveal"
              style={{ marginBottom: "var(--s-6)" }}
            >
              Related Articles
            </p>
            <div className="mk-blog-grid">
              {related.map((r) => (
                <RelatedCard key={r.slug} post={r} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 5. CTA band ───────────────────────────────────────────── */}
      <MkCtaBand />
      <MkFooter />
    </main>
  );
}
