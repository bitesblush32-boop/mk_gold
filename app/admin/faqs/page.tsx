'use client';

import React, { useEffect, useState, useCallback } from 'react';

/* ─── Types ──────────────────────────────────────────────────────── */

interface FaqRow {
  id:         number;
  page:       string;
  question:   string;
  answer:     string;
  order:      number;
  is_active:  boolean;
  created_at: string;
}

/* ─── Tabs ───────────────────────────────────────────────────────── */

const TABS = [
  { key: 'general',       label: 'General' },
  { key: 'sell-gold',     label: 'Sell Gold' },
  { key: 'pledged-gold',  label: 'Pledged Gold' },
  { key: 'gold-rate',     label: 'Gold Rate' },
] as const;
type TabKey = typeof TABS[number]['key'];

/* ─── Page ───────────────────────────────────────────────────────── */

export default function FaqsPage() {
  const [tab, setTab]         = useState<TabKey>('general');
  const [faqs, setFaqs]       = useState<FaqRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId]   = useState<number | null>(null);
  const [editQ, setEditQ]     = useState('');
  const [editA, setEditA]     = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [newQ, setNewQ]       = useState('');
  const [newA, setNewA]       = useState('');
  const [saving, setSaving]   = useState(false);

  const load = useCallback((page: TabKey) => {
    setLoading(true);
    fetch(`/api/admin/faqs?page=${page}`)
      .then(r => r.json())
      .then(d => setFaqs(d.faqs ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(tab); }, [tab, load]);

  /* ─── Toggle active ──────────────────────────────────────────── */
  async function handleToggle(faq: FaqRow) {
    setFaqs(prev => prev.map(f => f.id === faq.id ? { ...f, is_active: !f.is_active } : f));
    await fetch('/api/admin/faqs', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: faq.id, page: tab, is_active: !faq.is_active }),
    });
  }

  /* ─── Delete ─────────────────────────────────────────────────── */
  async function handleDelete(faq: FaqRow) {
    if (!window.confirm(`Delete this FAQ?\n\n"${faq.question}"`)) return;
    setFaqs(prev => prev.filter(f => f.id !== faq.id));
    await fetch(`/api/admin/faqs?id=${faq.id}&page=${tab}`, { method: 'DELETE' });
  }

  /* ─── Start edit ─────────────────────────────────────────────── */
  function startEdit(faq: FaqRow) {
    setEditId(faq.id);
    setEditQ(faq.question);
    setEditA(faq.answer);
  }

  /* ─── Save edit ──────────────────────────────────────────────── */
  async function saveEdit() {
    if (!editId || !editQ.trim() || !editA.trim()) return;
    setSaving(true);
    setFaqs(prev => prev.map(f => f.id === editId ? { ...f, question: editQ.trim(), answer: editA.trim() } : f));
    setEditId(null);
    await fetch('/api/admin/faqs', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editId, page: tab, question: editQ.trim(), answer: editA.trim() }),
    });
    setSaving(false);
  }

  /* ─── Reorder (up/down) ──────────────────────────────────────── */
  async function move(idx: number, dir: -1 | 1) {
    const next = [...faqs];
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= next.length) return;
    [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
    setFaqs(next);
    await fetch('/api/admin/faqs', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderedIds: next.map(f => f.id), page: tab }),
    });
  }

  /* ─── Add new ────────────────────────────────────────────────── */
  async function handleAdd() {
    if (!newQ.trim() || !newA.trim()) return;
    setSaving(true);
    const res = await fetch('/api/admin/faqs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: tab, question: newQ.trim(), answer: newA.trim(), order: faqs.length }),
    });
    if (res.ok) {
      const { faq } = await res.json();
      setFaqs(prev => [...prev, faq]);
      setNewQ(''); setNewA(''); setAddOpen(false);
    }
    setSaving(false);
  }

  return (
    <div className="mk-admin-page">
      <div className="mk-admin-topbar">
        <h1 className="mk-admin-page-title">FAQ Manager</h1>
      </div>
      <p className="mk-admin-subtitle">
        Edit FAQ content shown on the public website. Changes go live immediately.
      </p>

      {/* Tab bar */}
      <div className="mk-admin-section" style={{ paddingBottom: 0, borderBottom: '1px solid #2e1a3b' }}>
        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setEditId(null); setAddOpen(false); }}
              className={`mk-admin-tab${tab === t.key ? ' mk-admin-tab--active' : ''}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ list */}
      <div className="mk-admin-section" style={{ marginTop: 'var(--s-4)' }}>
        {loading ? (
          <p className="mk-admin-muted">Loading…</p>
        ) : faqs.length === 0 ? (
          <p className="mk-admin-muted">No FAQs yet for this section. Add one below.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {faqs.map((faq, idx) => (
              <div
                key={faq.id}
                style={{
                  background: '#2a1438',
                  border: '1px solid #3e1f50',
                  borderRadius: '8px',
                  padding: '1rem 1.25rem',
                  opacity: faq.is_active ? 1 : 0.5,
                }}
              >
                {editId === faq.id ? (
                  /* ── Inline edit form ── */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div>
                      <label className="mk-admin-label">Question</label>
                      <input
                        className="mk-admin-input"
                        value={editQ}
                        onChange={e => setEditQ(e.target.value)}
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div>
                      <label className="mk-admin-label">Answer</label>
                      <textarea
                        className="mk-admin-textarea"
                        value={editA}
                        onChange={e => setEditA(e.target.value)}
                        rows={4}
                        style={{ width: '100%', resize: 'vertical' }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="mk-admin-btn mk-admin-btn--gold"
                        onClick={saveEdit}
                        disabled={saving}
                      >
                        {saving ? 'Saving…' : 'Save'}
                      </button>
                      <button
                        className="mk-admin-btn"
                        onClick={() => setEditId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ── Display row ── */
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    {/* Reorder */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flexShrink: 0 }}>
                      <button
                        className="mk-admin-btn-text"
                        onClick={() => move(idx, -1)}
                        disabled={idx === 0}
                        title="Move up"
                        style={{ fontSize: '0.8rem', padding: '1px 4px', opacity: idx === 0 ? 0.3 : 1 }}
                      >
                        ▲
                      </button>
                      <button
                        className="mk-admin-btn-text"
                        onClick={() => move(idx, 1)}
                        disabled={idx === faqs.length - 1}
                        title="Move down"
                        style={{ fontSize: '0.8rem', padding: '1px 4px', opacity: idx === faqs.length - 1 ? 0.3 : 1 }}
                      >
                        ▼
                      </button>
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: 'var(--t-sm)',
                        fontWeight: 600,
                        color: 'var(--white)',
                        margin: '0 0 0.25rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {faq.question}
                      </p>
                      <p style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: 'var(--t-xs)',
                        color: 'var(--mist)',
                        margin: 0,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        {faq.answer}
                      </p>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                      <label className="mk-admin-toggle" title={faq.is_active ? 'Click to hide' : 'Click to show'}>
                        <input
                          type="checkbox"
                          checked={faq.is_active}
                          onChange={() => handleToggle(faq)}
                          className="mk-admin-toggle__input"
                        />
                        <span className="mk-admin-toggle__track" />
                      </label>
                      <button
                        className="mk-admin-btn-text"
                        onClick={() => startEdit(faq)}
                      >
                        Edit
                      </button>
                      <button
                        className="mk-admin-btn-text mk-admin-btn-text--plum"
                        onClick={() => handleDelete(faq)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add FAQ */}
        {addOpen ? (
          <div style={{
            marginTop: '1.25rem',
            background: '#2a1438',
            border: '1px solid var(--gold)',
            borderRadius: '8px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}>
            <p className="mk-admin-label" style={{ margin: 0 }}>New FAQ — {TABS.find(t => t.key === tab)?.label}</p>
            <div>
              <label className="mk-admin-label">Question</label>
              <input
                className="mk-admin-input"
                placeholder="Enter the question…"
                value={newQ}
                onChange={e => setNewQ(e.target.value)}
                style={{ width: '100%' }}
                autoFocus
              />
            </div>
            <div>
              <label className="mk-admin-label">Answer</label>
              <textarea
                className="mk-admin-textarea"
                placeholder="Enter the answer…"
                value={newA}
                onChange={e => setNewA(e.target.value)}
                rows={4}
                style={{ width: '100%', resize: 'vertical' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="mk-admin-btn mk-admin-btn--gold"
                onClick={handleAdd}
                disabled={saving || !newQ.trim() || !newA.trim()}
              >
                {saving ? 'Adding…' : 'Add FAQ'}
              </button>
              <button
                className="mk-admin-btn"
                onClick={() => { setAddOpen(false); setNewQ(''); setNewA(''); }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            className="mk-admin-btn mk-admin-btn--plum"
            style={{ marginTop: '1.25rem' }}
            onClick={() => { setAddOpen(true); setEditId(null); }}
          >
            + Add FAQ
          </button>
        )}
      </div>
    </div>
  );
}
