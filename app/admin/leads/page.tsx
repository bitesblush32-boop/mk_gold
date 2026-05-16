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

const CITIES     = ['All', 'Bangalore', 'Mysore', 'Mangalore', 'Davangere'] as const;
const GOLD_TYPES = ['jewellery', 'coins', 'bars', 'broken', 'mixed'] as const;
const PURITIES   = [24, 22, 20, 18] as const;

const BLANK_FORM = {
  name: '', phone: '', email: '', city: '', area: '',
  gold_type: '', purity_karat: '', weight_grams: '', notes: '',
};

function fmtDate(val: string | Date): string {
  return new Date(val as string).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

function cell(v: string | number | null | undefined): string {
  return v != null && v !== '' ? String(v) : '—';
}

function downloadCSV(rows: Lead[]) {
  const headers = [
    'ID', 'Name', 'Phone', 'Email', 'City', 'Area', 'Branch',
    'Gold Type', 'Purity (K)', 'Weight (g)', 'Est. Value (Rs)',
    'Source', 'Source Page', 'UTM Source', 'UTM Medium', 'UTM Campaign',
    'Status', 'Notes', 'Date',
  ];
  const escape = (v: string | number | null | undefined) =>
    `"${String(v ?? '').replace(/"/g, '""')}"`;

  const data = rows.map(l => [
    l.id, l.name, l.phone, l.email ?? '', l.city ?? '', l.area ?? '',
    l.branch_slug ?? '', l.gold_type ?? '', l.purity_karat ?? '',
    l.weight_grams ?? '', l.estimated_value ?? '', l.source,
    l.source_page ?? '', l.utm_source ?? '', l.utm_medium ?? '',
    l.utm_campaign ?? '', l.status, l.notes ?? '', fmtDate(l.created_at),
  ]);

  const csv = [headers, ...data]
    .map(row => row.map(escape).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `mk-gold-leads-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function LeadsPage() {
  const [leads, setLeads]         = useState<Lead[]>([]);
  const [loading, setLoading]     = useState(true);
  const [expandId, setExpandId]   = useState<number | null>(null);
  const [remarks, setRemarks]     = useState<Record<number, string>>({});
  const [savingId, setSavingId]   = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Filters
  const [city, setCity]         = useState<string>('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo]     = useState('');
  const [filtered, setFiltered] = useState<Lead[]>([]);

  // Add lead form
  const [showAdd, setShowAdd]   = useState(false);
  const [addForm, setAddForm]   = useState({ ...BLANK_FORM });
  const [addError, setAddError] = useState('');
  const [addSaving, setAddSaving] = useState(false);

  useEffect(() => {
    fetch('/api/leads?limit=500')
      .then(r => r.json())
      .then(d => {
        const data = d.leads ?? [];
        setLeads(data);
        setFiltered(data);
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

  async function handleAddLead(e: React.FormEvent) {
    e.preventDefault();
    setAddError('');
    if (!addForm.name.trim() || !addForm.phone.trim()) {
      setAddError('Name and phone are required.');
      return;
    }
    setAddSaving(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...addForm,
          source: 'admin',
          purity_karat: addForm.purity_karat ? Number(addForm.purity_karat) : undefined,
          weight_grams: addForm.weight_grams || undefined,
          email:        addForm.email || undefined,
          city:         addForm.city || undefined,
          area:         addForm.area || undefined,
          gold_type:    addForm.gold_type || undefined,
          notes:        addForm.notes || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAddError(data.error ?? 'Failed to add lead.');
        return;
      }
      // Prepend the new lead to local state
      const newLead: Lead = {
        id:              data.id,
        name:            addForm.name,
        phone:           addForm.phone,
        email:           addForm.email || null,
        city:            addForm.city || null,
        area:            addForm.area || null,
        branch_slug:     null,
        gold_type:       addForm.gold_type || null,
        weight_grams:    addForm.weight_grams || null,
        purity_karat:    addForm.purity_karat ? Number(addForm.purity_karat) : null,
        estimated_value: null,
        source:          'admin',
        source_page:     null,
        utm_source:      null,
        utm_medium:      null,
        utm_campaign:    null,
        utm_content:     null,
        status:          'new',
        notes:           addForm.notes || null,
        created_at:      new Date().toISOString(),
      };
      setLeads(prev => [newLead, ...prev]);
      setFiltered(prev => [newLead, ...prev]);
      setRemarks(prev => ({ ...prev, [data.id]: addForm.notes ?? '' }));
      setAddForm({ ...BLANK_FORM });
      setShowAdd(false);
    } catch {
      setAddError('Network error. Please try again.');
    } finally {
      setAddSaving(false);
    }
  }

  return (
    <div className="mk-admin-page">
      <div className="mk-admin-topbar">
        <h1 className="mk-admin-page-title">Lead Viewer</h1>
        <div style={{ display: 'flex', gap: '0.6rem', marginLeft: 'auto' }}>
          <button
            className="mk-admin-btn"
            style={{ fontSize: '0.85rem', padding: '0.45rem 1.1rem', background: 'transparent', border: '1.5px solid var(--plum)', color: 'var(--plum)' }}
            onClick={() => downloadCSV(filtered)}
            disabled={filtered.length === 0}
          >
            Download CSV {filtered.length > 0 && `(${filtered.length})`}
          </button>
          <button
            className="mk-admin-btn mk-admin-btn--plum"
            style={{ fontSize: '0.85rem', padding: '0.45rem 1.1rem' }}
            onClick={() => { setShowAdd(v => !v); setAddError(''); }}
          >
            {showAdd ? 'Cancel' : '+ Add Lead'}
          </button>
        </div>
      </div>
      <p className="mk-admin-subtitle">All website leads. {leads.length} total.</p>

      {/* Add Lead Form */}
      {showAdd && (
        <div className="mk-admin-section" style={{ marginBottom: 'var(--s-4)', borderLeft: '3px solid var(--plum)' }}>
          <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1rem', fontWeight: 600, color: 'var(--ink)', marginBottom: 'var(--s-4)' }}>
            Add Lead Manually
          </h2>
          <form onSubmit={handleAddLead}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>

              <div className="mk-admin-field">
                <label className="mk-admin-label">Name *</label>
                <input
                  className="mk-admin-input"
                  value={addForm.name}
                  onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Customer name"
                  required
                />
              </div>

              <div className="mk-admin-field">
                <label className="mk-admin-label">Phone *</label>
                <input
                  className="mk-admin-input"
                  value={addForm.phone}
                  onChange={e => setAddForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="10-digit mobile"
                  required
                />
              </div>

              <div className="mk-admin-field">
                <label className="mk-admin-label">Email</label>
                <input
                  className="mk-admin-input"
                  type="email"
                  value={addForm.email}
                  onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="Optional"
                />
              </div>

              <div className="mk-admin-field">
                <label className="mk-admin-label">City</label>
                <select
                  className="mk-admin-select"
                  value={addForm.city}
                  onChange={e => setAddForm(f => ({ ...f, city: e.target.value }))}
                >
                  <option value="">Select city</option>
                  {CITIES.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="mk-admin-field">
                <label className="mk-admin-label">Area</label>
                <input
                  className="mk-admin-input"
                  value={addForm.area}
                  onChange={e => setAddForm(f => ({ ...f, area: e.target.value }))}
                  placeholder="e.g. Rajajinagar"
                />
              </div>

              <div className="mk-admin-field">
                <label className="mk-admin-label">Gold Type</label>
                <select
                  className="mk-admin-select"
                  value={addForm.gold_type}
                  onChange={e => setAddForm(f => ({ ...f, gold_type: e.target.value }))}
                >
                  <option value="">Select type</option>
                  {GOLD_TYPES.map(t => (
                    <option key={t} value={t} style={{ textTransform: 'capitalize' }}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div className="mk-admin-field">
                <label className="mk-admin-label">Purity</label>
                <select
                  className="mk-admin-select"
                  value={addForm.purity_karat}
                  onChange={e => setAddForm(f => ({ ...f, purity_karat: e.target.value }))}
                >
                  <option value="">Select purity</option>
                  {PURITIES.map(p => (
                    <option key={p} value={p}>{p}K</option>
                  ))}
                </select>
              </div>

              <div className="mk-admin-field">
                <label className="mk-admin-label">Weight (grams)</label>
                <input
                  className="mk-admin-input"
                  type="number"
                  min="0"
                  step="0.1"
                  value={addForm.weight_grams}
                  onChange={e => setAddForm(f => ({ ...f, weight_grams: e.target.value }))}
                  placeholder="e.g. 12.5"
                />
              </div>

            </div>

            <div className="mk-admin-field" style={{ marginBottom: '1rem' }}>
              <label className="mk-admin-label">Notes</label>
              <textarea
                className="mk-admin-input"
                rows={2}
                style={{ width: '100%', resize: 'vertical', fontFamily: 'inherit', fontSize: '0.85rem' }}
                value={addForm.notes}
                onChange={e => setAddForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="Walk-in, referral source, any context…"
              />
            </div>

            {addError && (
              <p style={{ color: '#c0392b', fontSize: '0.82rem', marginBottom: '0.75rem', fontFamily: 'Poppins, sans-serif' }}>
                {addError}
              </p>
            )}

            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button
                type="submit"
                className="mk-admin-btn mk-admin-btn--plum"
                disabled={addSaving}
              >
                {addSaving ? 'Saving…' : 'Save Lead'}
              </button>
              <button
                type="button"
                className="mk-admin-btn"
                style={{ background: 'transparent', border: '1.5px solid var(--gallery-dk)', color: 'var(--ink-mid)' }}
                onClick={() => { setShowAdd(false); setAddForm({ ...BLANK_FORM }); setAddError(''); }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

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
