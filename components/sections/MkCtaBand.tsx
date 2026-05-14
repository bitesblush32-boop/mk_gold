'use client';
// Final CTA band — mk-bg-purple + pattern

import { MkButton } from '@/components/ui/MkButton';
import { trackCallConversion } from '@/lib/analytics';

const MAIN_PHONE = '+917019500600';

export function MkCtaBand() {
  return (
    <section className="mk-cta-band mk-bg-dark section" aria-labelledby="cta-band-headline">
      <div className="mk-container mk-cta-band__inner">

        <div className="mk-cta-band__copy reveal">
          <p className="mk-section-overline">Get Started Today</p>
          <h2 className="mk-cta-band__headline" id="cta-band-headline">
            Your gold is worth<br />
            more than you think.
          </h2>
          <p className="mk-cta-band__sub">
            Get a certified XRF valuation at any MK Gold branch in Karnataka.
            No appointment needed. Payment in 45 minutes.
          </p>
        </div>

        <div className="mk-cta-band__actions reveal delay-2">
          <MkButton variant="gold" href="/contact" size="lg">
            Book Appointment
          </MkButton>
          <MkButton
            variant="outline-light"
            href={`tel:${MAIN_PHONE}`}
            size="lg"
            onClick={trackCallConversion}
          >
            Call Us Now
          </MkButton>
        </div>

        <p className="mk-cta-band__note reveal delay-3">
          16 branches across Bangalore, Mysore, Mangalore &amp; Davangere
          &nbsp;&middot;&nbsp; Open Mon–Sun, 10:00 AM – 8:00 PM
        </p>

      </div>
    </section>
  );
}
