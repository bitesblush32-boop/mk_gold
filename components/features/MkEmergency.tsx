// N09 — Emergency cash callout — calm language, never "URGENT"
// Server component — no client-side hooks needed

import { MkButton } from '@/components/ui/MkButton';

export function MkEmergency() {
  return (
    <section
      className="mk-bg-light"
      style={{ paddingTop: 0, paddingBottom: '2.5rem' }}
      aria-label="Quick access"
    >
      <div className="mk-container">
        <div
          style={{
            background: 'var(--plum-deep)',
            borderLeft: '3px solid var(--gold)',
            borderRadius: '12px',
            padding: '1.75rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                fontSize: 'var(--t-base)',
                color: '#FFFFFF',
                margin: '0 0 0.375rem',
              }}
            >
              Need money today?
            </p>
            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: 'var(--t-sm)',
                color: 'rgba(255,255,255,0.65)',
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              Walk into any branch before 6&nbsp;PM.
              Payment in 45&nbsp;minutes.
            </p>
          </div>
          <MkButton variant="gold" size="sm" href="/contact">
            Find Nearest Branch
          </MkButton>
        </div>
      </div>
    </section>
  );
}
