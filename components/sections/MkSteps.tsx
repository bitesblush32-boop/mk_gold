// F07 — 6-step sell gold process

/* ─── Data ────────────────────────────────────────────────────── */

const STEPS = [
  {
    n:     '01',
    title: 'Book Appointment',
    body:  'Call, WhatsApp, or book online in 30 seconds. No documents or paperwork needed at this stage.',
  },
  {
    n:     '02',
    title: 'Visit Any Branch',
    body:  'Walk into any of our 16 branches with your gold and a valid government ID. Walk-ins always welcome.',
  },
  {
    n:     '03',
    title: 'Weigh & Assess',
    body:  'Your gold is weighed on certified precision scales in front of you. Transparent process, zero hidden deductions.',
  },
  {
    n:     '04',
    title: 'XRF Purity Test',
    body:  'Our German XRF spectrometer reads exact gold content in under 2 minutes. No acid test. No scratches.',
  },
  {
    n:     '05',
    title: 'Receive Your Offer',
    body:  'You get an offer based on live MCX rates. We show you our margin openly, side by side. Zero pressure.',
  },
  {
    n:     '06',
    title: 'Get Paid Instantly',
    body:  'Accept and receive payment in cash, NEFT, or UPI within 45 minutes. Walk in with gold, walk out with money.',
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
          <h2 className="mk-steps__title">
            Six steps. 45 minutes.<br />
            That&apos;s all it takes.
          </h2>
          <p className="mk-steps__subtitle">
            Sell your gold at fair, transparent rates backed by live MCX prices
            and certified XRF purity testing.
          </p>
        </div>

        {/* Grid */}
        <ol className="mk-steps__grid" aria-label="Steps to sell your gold">
          {STEPS.map((step, i) => (
            <li
              key={step.n}
              className={`mk-step reveal delay-${(i % 3) + 1}`}
            >
              <div className="mk-step__circle-wrap">
                <div className="mk-step__line" aria-hidden="true" />
                <div className="mk-step__coin">
                  <div className="mk-step__circle">
                    <span className="mk-step__num">{step.n}</span>
                  </div>
                </div>
              </div>
              <h3 className="mk-step__title">{step.title}</h3>
              <p className="mk-step__body">{step.body}</p>
            </li>
          ))}
        </ol>

      </div>
    </section>
  );
}
