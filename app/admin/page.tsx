'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Stats {
  totalLeads:        number;
  appointmentsToday: number;
  goldRate: {
    status:    'manual' | 'live';
    rate24k?:  string;
    expiresAt?: string | Date | null;
    updatedAt?: string | Date;
  };
}

function fmtTime(val: string | Date | null | undefined): string {
  if (!val) return '—';
  return new Date(val as string).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

export default function AdminDashboard() {
  const [stats, setStats]   = useState<Stats | null>(null);
  const [error, setError]   = useState('');

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(d => setStats(d))
      .catch(() => setError('Could not load stats.'));
  }, []);

  return (
    <div className="mk-admin-page">
      <div className="mk-admin-topbar">
        <h1 className="mk-admin-page-title">Dashboard</h1>
      </div>

      {error && <div className="mk-admin-alert mk-admin-alert--error">{error}</div>}

      {/* Stats row */}
      <div className="mk-admin-stats">
        {/* Total Leads */}
        <div className="mk-admin-stat-card">
          <div className="mk-admin-stat-card__value">
            {stats ? stats.totalLeads : '—'}
          </div>
          <div className="mk-admin-stat-card__label">Total Leads</div>
        </div>

        {/* Appointments Today */}
        <div className="mk-admin-stat-card">
          <div className="mk-admin-stat-card__value">
            {stats ? stats.appointmentsToday : '—'}
          </div>
          <div className="mk-admin-stat-card__label">Appointments Today</div>
        </div>

        {/* Gold Rate Status */}
        <div className="mk-admin-stat-card">
          {stats ? (
            stats.goldRate.status === 'manual' ? (
              <>
                <div
                  className="mk-admin-stat-card__value"
                  style={{ fontSize: '1rem', color: 'var(--gold)' }}
                >
                  Manual Override
                </div>
                <div className="mk-admin-stat-card__label">
                  Expires {fmtTime(stats.goldRate.expiresAt)}
                </div>
              </>
            ) : (
              <>
                <div
                  className="mk-admin-stat-card__value"
                  style={{ fontSize: '1rem', color: '#22a85a' }}
                >
                  Live MCX Rate
                </div>
                <div className="mk-admin-stat-card__label">
                  Updated {fmtTime(stats.goldRate.updatedAt)}
                </div>
              </>
            )
          ) : (
            <>
              <div className="mk-admin-stat-card__value">—</div>
              <div className="mk-admin-stat-card__label">Gold Rate Status</div>
            </>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="mk-admin-section" style={{ marginTop: 'var(--s-6)' }}>
        <h2 className="mk-admin-section-title">Quick Actions</h2>
        <div className="mk-admin-quick-links">
          <Link href="/admin/banners" className="mk-admin-quick-link">
            Manage Banners →
          </Link>
          <Link href="/admin/blog/new" className="mk-admin-quick-link">
            Write a Blog Post →
          </Link>
          <Link href="/admin/gold-rate" className="mk-admin-quick-link">
            Set Gold Rate →
          </Link>
          <Link href="/admin/leads" className="mk-admin-quick-link">
            View Leads →
          </Link>
        </div>
      </div>
    </div>
  );
}
