import type { Metadata } from 'next';
import { MkNavbar } from '@/components/layout/MkNavbar';
import { MkFooter } from '@/components/layout/MkFooter';

export const metadata: Metadata = {
  title: 'Privacy Policy | MK Gold',
  description: 'MK Gold privacy policy — how we collect, use, and protect your personal information.',
  alternates: { canonical: 'https://mkgold.in/privacy-policy' },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = '1 January 2025';

export default function PrivacyPolicyPage() {
  return (
    <>
      <MkNavbar />
      <main style={{ paddingTop: 'var(--chrome-h)' }}>

        {/* Hero */}
        <section className="mk-bg-dark section--sm">
          <div className="mk-container" style={{ maxWidth: '800px' }}>
            <p className="mk-section-overline">Legal</p>
            <h1 style={{ fontFamily: 'Tanker, serif', fontSize: 'var(--t-h1)', color: 'white', lineHeight: 1.1, margin: '0.5rem 0 1rem' }}>
              Privacy Policy
            </h1>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'var(--t-sm)', color: 'rgba(255,255,255,0.55)', margin: 0 }}>
              Last updated: {LAST_UPDATED}
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="mk-bg-light section">
          <div className="mk-container" style={{ maxWidth: '800px' }}>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'var(--t-base)', color: 'var(--ink-mid)', lineHeight: 1.8 }}>

              <Section title="1. Introduction">
                MK Gold (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) is committed to protecting the privacy of every person who interacts with us — whether you visit our website, walk into a branch, or contact us via WhatsApp or phone. This Privacy Policy explains what information we collect, how we use it, and how we keep it safe.
              </Section>

              <Section title="2. Information We Collect">
                <p>When you use our website or contact us, we may collect:</p>
                <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                  <li style={{ marginBottom: '0.5rem' }}><strong>Contact details</strong> — name, phone number, email address</li>
                  <li style={{ marginBottom: '0.5rem' }}><strong>Gold details</strong> — type of gold, approximate weight, purity, and purpose (selling or pledged release)</li>
                  <li style={{ marginBottom: '0.5rem' }}><strong>Location data</strong> — city or pin code to find your nearest branch (only when you permit browser location access)</li>
                  <li style={{ marginBottom: '0.5rem' }}><strong>Usage data</strong> — pages visited, calculator interactions, and session duration, collected via Google Analytics</li>
                  <li style={{ marginBottom: '0.5rem' }}><strong>Device data</strong> — browser type, IP address, and operating system, collected automatically</li>
                </ul>
                <p style={{ marginTop: '1rem' }}>At our branches, we collect a government-issued photo ID (Aadhaar, PAN, Passport, Voter ID, or Driving Licence) as required by applicable law for gold purchase transactions.</p>
              </Section>

              <Section title="3. How We Use Your Information">
                <ul style={{ paddingLeft: '1.5rem' }}>
                  <li style={{ marginBottom: '0.5rem' }}>To call you back with a gold valuation estimate</li>
                  <li style={{ marginBottom: '0.5rem' }}>To book and confirm branch appointments</li>
                  <li style={{ marginBottom: '0.5rem' }}>To route your enquiry to the nearest MK Gold branch team</li>
                  <li style={{ marginBottom: '0.5rem' }}>To send appointment reminders via WhatsApp or SMS (only if you have contacted us)</li>
                  <li style={{ marginBottom: '0.5rem' }}>To improve our website experience using aggregated, anonymised analytics</li>
                  <li style={{ marginBottom: '0.5rem' }}>To comply with statutory obligations under the Prevention of Money Laundering Act (PMLA) and applicable RBI guidelines</li>
                </ul>
                <p style={{ marginTop: '1rem' }}>We do <strong>not</strong> sell, rent, or share your personal data with third-party marketers.</p>
              </Section>

              <Section title="4. Data Storage and Security">
                Your data is stored on secure servers hosted on Railway (PostgreSQL database, India region). We use industry-standard encryption for data in transit (HTTPS/TLS) and at rest. Access to personal data is restricted to authorised MK Gold staff only.
              </Section>

              <Section title="5. Third-Party Services">
                <p>Our website uses the following third-party services which may collect data in accordance with their own privacy policies:</p>
                <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                  <li style={{ marginBottom: '0.5rem' }}><strong>Google Analytics 4</strong> — website usage analytics</li>
                  <li style={{ marginBottom: '0.5rem' }}><strong>Google Tag Manager</strong> — tag and pixel management</li>
                  <li style={{ marginBottom: '0.5rem' }}><strong>Google Ads</strong> — conversion tracking for advertising</li>
                  <li style={{ marginBottom: '0.5rem' }}><strong>Meta Pixel (Facebook)</strong> — advertising performance tracking</li>
                  <li style={{ marginBottom: '0.5rem' }}><strong>WhatsApp Business</strong> — customer communication (Meta Inc.)</li>
                  <li style={{ marginBottom: '0.5rem' }}><strong>Vercel</strong> — website hosting and edge delivery</li>
                </ul>
                <p style={{ marginTop: '1rem' }}>We recommend reviewing the privacy policies of these providers for full details of their data practices.</p>
              </Section>

              <Section title="6. Cookies">
                We use cookies to remember your preferences and to enable analytics. You may disable cookies in your browser settings, though some website features may not function correctly as a result. We do not use cookies for advertising profiling on this website.
              </Section>

              <Section title="7. Your Rights">
                <p>You have the right to:</p>
                <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                  <li style={{ marginBottom: '0.5rem' }}>Request access to the personal data we hold about you</li>
                  <li style={{ marginBottom: '0.5rem' }}>Request correction of inaccurate data</li>
                  <li style={{ marginBottom: '0.5rem' }}>Request deletion of your data (subject to statutory retention obligations)</li>
                  <li style={{ marginBottom: '0.5rem' }}>Opt out of marketing communications at any time</li>
                </ul>
                <p style={{ marginTop: '1rem' }}>To exercise any of these rights, email us at <a href="mailto:grievance@mkgold.in" style={{ color: 'var(--plum)', fontWeight: 500 }}>grievance@mkgold.in</a>. We will respond within 30 days.</p>
              </Section>

              <Section title="8. Data Retention">
                Lead and appointment data is retained for up to 2 years. Transaction records at branches are retained as required by PMLA and applicable law. Analytics data is retained per Google&apos;s standard retention periods.
              </Section>

              <Section title="9. Children's Privacy">
                Our services are intended for adults (18 years and above). We do not knowingly collect personal information from minors. If you believe we have inadvertently collected data from a minor, please contact us immediately.
              </Section>

              <Section title="10. Changes to This Policy">
                We may update this Privacy Policy from time to time. The &ldquo;Last updated&rdquo; date at the top of this page reflects the most recent revision. Continued use of our website or services after any change constitutes acceptance of the revised policy.
              </Section>

              <Section title="11. Contact">
                <p>For privacy-related queries or complaints:</p>
                <p style={{ marginTop: '0.75rem' }}>
                  <strong>MK Gold</strong><br />
                  Email: <a href="mailto:grievance@mkgold.in" style={{ color: 'var(--plum)', fontWeight: 500 }}>grievance@mkgold.in</a><br />
                  Phone: <a href="tel:+917019500600" style={{ color: 'var(--plum)', fontWeight: 500 }}>+91 70195 00600</a><br />
                  Address: MK Gold Head Office, Bangalore, Karnataka, India
                </p>
              </Section>

            </div>
          </div>
        </section>

      </main>
      <MkFooter />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <h2 style={{ fontFamily: 'Tanker, serif', fontSize: 'var(--t-h3)', color: 'var(--ink)', marginBottom: '0.875rem', lineHeight: 1.2 }}>
        {title}
      </h2>
      <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'var(--t-base)', color: 'var(--ink-mid)', lineHeight: 1.8 }}>
        {children}
      </div>
    </div>
  );
}
