'use client';

import React, { useEffect, useState } from 'react';
import { getChannel } from '@/lib/utm';

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

  // Remarks state per lead
  const [remarks, setRemarks]   = useState<Record<number, string>>({});
  const [savingId, setSavingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

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
        // Pre-populate remarks from existing notes
        const initial: Record<number, string> = {};
        data.forEach((l: Lead) => { initial[l.id] = l.notes ?? ''; });
        setRemarks(initial);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function saveRemarks(lead: Lead) {
    setSavingId(lead.id);
    try {
      await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: lead.id, notes: remarks[lead.id] ?? '' }),
      });
      // Update local state
      setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, notes: remarks[lead.id] ?? '' } : l));
      setFiltered(prev => prev.map(l => l.id === lead.id ? { ...l, notes: remarks[lead.id] ?? '' } : l));
    } catch { /* silent */ }
    finally { setSavingId(null); }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this lead permanently? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await fetch('/api/leads', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setLeads(prev => prev.filter(l => l.id !== id));
      setFiltered(prev => prev.filter(l => l.id !== id));
      if (expandId === id) setExpandId(null);
    } catch { /* silent */ }
    finally { setDeletingId(null); }
  }

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
      <p className="mk-admin-subtitle">All website leads. {leads.length} total.</p>

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
                  <th>Purity</th>
                  <th>Weight</th>
                  <th>Channel</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(lead => (
                  <React.Fragment key={lead.id}>
                    <tr
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
                      <td>{lead.purity_karat ? `${lead.purity_karat}K` : '—'}</td>
                      <td>{lead.weight_grams ? `${lead.weight_grams}g` : '—'}</td>
                      <td>
                        {(() => {
                          const ch = getChannel(lead);
                          return (
                            <span style={{
                              display: 'inline-block',
                              padding: '2px 8px',
                              borderRadius: '9999px',
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              background: ch.color + '22',
                              color: ch.color,
                              border: `1px solid ${ch.color}44`,
                              whiteSpace: 'nowrap',
                            }}>
                              {ch.label}
                            </span>
                          );
                        })()}
                      </td>
                      <td>{fmtDate(lead.created_at)}</td>
                    </tr>

                    {/* Expanded row */}
                    {expandId === lead.id && (
                      <tr className="mk-admin-expand-row">
                        <td colSpan={8}>
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

                            {/* Remarks */}
                            <div style={{ gridColumn: '1/-1', marginTop: '0.5rem' }}>
                              <span className="mk-admin-expand-label">Remarks</span>
                              <textarea
                                className="mk-admin-input"
                                rows={3}
                                style={{ width: '100%', marginTop: '0.25rem', resize: 'vertical', fontFamily: 'inherit', fontSize: '0.85rem' }}
                                placeholder="Add internal remarks about this lead…"
                                value={remarks[lead.id] ?? ''}
                                onChange={e => setRemarks(prev => ({ ...prev, [lead.id]: e.target.value }))}
                                onClick={e => e.stopPropagation()}
                              />
                              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', alignItems: 'center' }}>
                                <button
                                  className="mk-admin-btn mk-admin-btn--plum"
                                  style={{ fontSize: '0.8rem', padding: '0.3rem 0.9rem' }}
                                  disabled={savingId === lead.id}
                                  onClick={e => { e.stopPropagation(); saveRemarks(lead); }}
                                >
                                  {savingId === lead.id ? 'Saving…' : 'Save Remarks'}
                                </button>
                                <button
                                  className="mk-admin-btn"
                                  style={{ fontSize: '0.8rem', padding: '0.3rem 0.9rem', background: '#c0392b', color: '#fff', marginLeft: 'auto' }}
                                  disabled={deletingId === lead.id}
                                  onClick={e => { e.stopPropagation(); handleDelete(lead.id); }}
                                >
                                  {deletingId === lead.id ? 'Deleting…' : 'Delete Lead'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
