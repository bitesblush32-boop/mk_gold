'use client';

import { useEffect, useState } from 'react';

interface Lead {
  id:              number;
  name:            string;
  phone:           string;
  email:           string | null;
  city:            string | null;
  area:            string | null;
  branch_slug:     string | null;
  gold_type:       string | null;
  weight_grams:    string | null;
  purity_karat:    number | null;
  estimated_value: string | null;
  source:          string;
  source_page:     string | null;
  utm_source:      string | null;
  utm_medium:      string | null;
  utm_campaign:    string | null;
  utm_content:     string | null;
  status:          string;
  notes:           string | null;
  created_at:      string | Date;
}

const CITIES = ['All', 'Bangalore', 'Mysore', 'Mangalore', 'Davangere'] as const;

function fmtDate(val: string | Date): string {
  return new Date(val as string).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

function cell(v: string | number | null | undefined): string {
  return v != null && v !== '' ? String(v) : '—';
}

export default function LeadsPage() {
  const [leads, setLeads]       = useState<Lead[]>([]);
  const [loading, setLoading]   = useState(true);
  const [expandId, setExpandId] = useState<number | null>(null);

  // Filters
  const [city, setCity]         = useState<string>('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo]     = useState('');
  const [filtered, setFiltered] = useState<Lead[]>([]);

  useEffect(() => {
    fetch('/api/leads?limit=500')
      .then(r => r.json())
      .then(d => {
        const data = d.leads ?? [];
        setLeads(data);
        setFiltered(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function applyFilters() {
    let result = [...leads];
    if (city !== 'All') {
      result = result.filter(l => l.city?.toLowerCase() === city.toLowerCase());
    }
    if (dateFrom) {
      result = result.filter(l => new Date(l.created_at as string) >= new Date(dateFrom));
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      result = result.filter(l => new Date(l.created_at as string) <= to);
    }
    setFiltered(result);
  }

  return (
    <div className="mk-admin-page">
      <div className="mk-admin-topbar">
        <h1 className="mk-admin-page-title">Lead Viewer</h1>
      </div>
      <p className="mk-admin-subtitle">All website leads — read only. {leads.length} total.</p>

      {/* Filter bar */}
      <div className="mk-admin-section">
        <div className="mk-admin-filter-bar">
          <div className="mk-admin-field" style={{ minWidth: '160px' }}>
            <label className="mk-admin-label">City</label>
            <select
              className="mk-admin-select"
              value={city}
              onChange={e => setCity(e.target.value)}
            >
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="mk-admin-field" style={{ minWidth: '150px' }}>
            <label className="mk-admin-label">From</label>
            <input
              type="date"
              className="mk-admin-input"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
            />
          </div>
          <div className="mk-admin-field" style={{ minWidth: '150px' }}>
            <label className="mk-admin-label">To</label>
            <input
              type="date"
              className="mk-admin-input"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
            />
          </div>
          <button
            className="mk-admin-btn mk-admin-btn--plum"
            style={{ alignSelf: 'flex-end' }}
            onClick={applyFilters}
          >
            Apply
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="mk-admin-section" style={{ marginTop: 'var(--s-4)', padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <p className="mk-admin-muted" style={{ padding: 'var(--s-6)' }}>Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="mk-admin-muted" style={{ padding: 'var(--s-6)' }}>No leads match the filter.</p>
        ) : (
          <div className="mk-admin-table-wrap">
            <table className="mk-admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>City</th>
                  <th>Gold Type</th>
                  <th>Weight (g)</th>
                  <th>Source</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(lead => (
                  <>
                    <tr
                      key={lead.id}
                      className="mk-admin-table-row"
                      onClick={() => setExpandId(expandId === lead.id ? null : lead.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>{lead.name}</td>
                      <td>
                        <a href={`tel:${lead.phone}`} className="mk-admin-link" onClick={e => e.stopPropagation()}>
                          {lead.phone}
                        </a>
                      </td>
                      <td>{cell(lead.city)}</td>
                      <td>{cell(lead.gold_type)}</td>
                      <td>{cell(lead.weight_grams)}</td>
                      <td>{lead.source}</td>
                      <td>{fmtDate(lead.created_at)}</td>
                    </tr>

                    {/* Expanded row */}
                    {expandId === lead.id && (
                      <tr key={`${lead.id}-expand`} className="mk-admin-expand-row">
                        <td colSpan={7}>
                          <div className="mk-admin-expand-grid">
                            <div><span className="mk-admin-expand-label">Email</span>{cell(lead.email)}</div>
                            <div><span className="mk-admin-expand-label">Area</span>{cell(lead.area)}</div>
                            <div><span className="mk-admin-expand-label">Branch</span>{cell(lead.branch_slug)}</div>
                            <div><span className="mk-admin-expand-label">Purity</span>{lead.purity_karat ? `${lead.purity_karat}K` : '—'}</div>
                            <div><span className="mk-admin-expand-label">Est. Value</span>{lead.estimated_value ? `₹${Number(lead.estimated_value).toLocaleString('en-IN')}` : '—'}</div>
                            <div><span className="mk-admin-expand-label">Status</span>{lead.status}</div>
                            <div><span className="mk-admin-expand-label">Source Page</span>{cell(lead.source_page)}</div>
                            <div><span className="mk-admin-expand-label">UTM Source</span>{cell(lead.utm_source)}</div>
                            <div><span className="mk-admin-expand-label">UTM Medium</span>{cell(lead.utm_medium)}</div>
                            <div><span className="mk-admin-expand-label">UTM Campaign</span>{cell(lead.utm_campaign)}</div>
                            {lead.notes && <div style={{ gridColumn: '1/-1' }}><span className="mk-admin-expand-label">Notes</span>{lead.notes}</div>}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
