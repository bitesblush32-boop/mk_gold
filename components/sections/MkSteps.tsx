// F07 — 4-step gold evaluation process

import Image from "next/image";

/* ─── Data ────────────────────────────────────────────────────── */

const STEPS = [
  {
    n: "01",
    title: "Weight Check",
    body: "Accurate weight checking systems — your gold weighed on certified precision scales in front of you.",
    icon: "/weight.png",
    alt: "Weight check scale",
  },
  {
    n: "02",
    title: "Purity Verification",
    body: "Using advanced XRF Machine — German spectrometer reads exact gold content in under 2 minutes. No acid test.",
    icon: "/purity.png",
    alt: "XRF purity verification machine",
  },
  {
    n: "03",
    title: "Rate Calculation",
    body: "Based on live markets — your offer is calculated against live MCX rates. We show our margin openly.",
    icon: "/rate_calc.png",
    alt: "Rate calculation chart",
  },
  {
    n: "04",
    title: "Payment Transfer",
    body: "Instant payment to your bank account — receive cash, NEFT, or UPI within 30 minutes of evaluation.",
    icon: "/payment.png",
    alt: "Instant payment transfer",
  },
] as const;

/* ─── Component ───────────────────────────────────────────────── */

export function MkSteps() {
  return (
    <section className="mk-steps mk-bg-light section" id="how-it-works">
      <div className="mk-container">
        {/* Header */}
        <div className="mk-steps__header reveal">
          <p className="mk-section-overline">How It Works</p>
          <h2 className="mk-steps__title">Our Gold Evaluation Process</h2>
          <p className="mk-steps__subtitle">
            We follow a transparent process to ensure you get the best value
          </p>
        </div>

        {/* Grid */}
        <ol
          className="mk-steps__grid"
          aria-label="Gold evaluation process steps"
        >
          {STEPS.map((step, i) => (
            <li key={step.n} className={`mk-step reveal delay-${i + 1}`}>
              <div className="mk-step__icon-wrap">
                <Image
                  src={step.icon}
                  alt={step.alt}
                  width={80}
                  height={80}
                  className="mk-step__icon"
                />
              </div>
              <span className="mk-step__num">{step.n}</span>
              <h3 className="mk-step__title">{step.title}</h3>
              <p className="mk-step__body">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
