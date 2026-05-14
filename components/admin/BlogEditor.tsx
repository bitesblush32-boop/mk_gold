'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export interface BlogEditorPost {
  id?:              number;
  title:            string;
  slug:             string;
  excerpt:          string;
  body_json:        string;          // plain markdown/text stored as JSON string
  category:         string;
  cover_image_url:  string;
  published:        boolean;
}

const CATEGORIES = [
  'Gold Rate',
  'Sell Gold',
  'Pledged Gold',
  'Market Insights',
  'Guide',
] as const;

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

interface Props {
  initialValues?: Partial<BlogEditorPost>;
  mode: 'new' | 'edit';
}

export default function BlogEditor({ initialValues, mode }: Props) {
  const router = useRouter();

  const [form, setForm] = useState<BlogEditorPost>({
    title:           initialValues?.title           ?? '',
    slug:            initialValues?.slug            ?? '',
    excerpt:         initialValues?.excerpt         ?? '',
    body_json:       initialValues?.body_json       ?? '',
    category:        initialValues?.category        ?? 'Guide',
    cover_image_url: initialValues?.cover_image_url ?? '',
    published:       initialValues?.published       ?? false,
    id:              initialValues?.id,
  });

  const [saving,  setSaving]  = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const title = e.target.value;
    setForm(f => ({
      ...f,
      title,
      // Auto-fill slug only if user hasn't manually changed it
      slug: mode === 'new' ? slugify(title) : f.slug,
    }));
  }

  async function handleSave(e: React.FormEvent, publishNow?: boolean) {
    e.preventDefault();
    if (!form.title || !form.slug || !form.body_json) {
      setMessage({ type: 'err', text: 'Title, slug and body are required.' });
      return;
    }
    setSaving(true);
    setMessage(null);

    const payload = {
      ...form,
      published: publishNow ?? form.published,
    };

    try {
      const res = await fetch('/api/admin/blog', {
        method:  mode === 'new' ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'ok', text: mode === 'new' ? 'Post created.' : 'Post saved.' });
        if (mode === 'new') {
          router.push('/admin/blog');
        } else {
          setForm(f => ({ ...f, published: publishNow ?? f.published }));
        }
      } else {
        setMessage({ type: 'err', text: data.error ?? 'Save failed.' });
      }
    } catch {
      setMessage({ type: 'err', text: 'Network error.' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={e => handleSave(e)} noValidate>
      {message && (
        <div className={`mk-admin-alert mk-admin-alert--${message.type === 'ok' ? 'success' : 'error'}`}>
          {message.text}
        </div>
      )}

      <div className="mk-admin-section">
        <h2 className="mk-admin-section-title">Post Details</h2>
        <div className="mk-admin-form-grid mk-admin-form-grid--2">
          {/* Title */}
          <div className="mk-admin-field" style={{ gridColumn: '1 / -1' }}>
            <label className="mk-admin-label">Title *</label>
            <input
              type="text"
              className="mk-admin-input"
              value={form.title}
              onChange={handleTitleChange}
              placeholder="e.g. Gold Rate Today in Bangalore — Live MCX Price"
              required
            />
          </div>

          {/* Slug */}
          <div className="mk-admin-field">
            <label className="mk-admin-label">Slug *</label>
            <input
              type="text"
              className="mk-admin-input"
              value={form.slug}
              onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
              placeholder="gold-rate-today-bangalore"
              required
            />
          </div>

          {/* Category */}
          <div className="mk-admin-field">
            <label className="mk-admin-label">Category</label>
            <select
              className="mk-admin-select"
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            >
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Excerpt */}
          <div className="mk-admin-field" style={{ gridColumn: '1 / -1' }}>
            <label className="mk-admin-label">Excerpt (for card preview)</label>
            <textarea
              className="mk-admin-input mk-admin-textarea"
              value={form.excerpt}
              onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
              placeholder="2–3 sentence summary shown on blog index page."
              rows={3}
            />
          </div>

          {/* Cover image */}
          <div className="mk-admin-field" style={{ gridColumn: '1 / -1' }}>
            <label className="mk-admin-label">Cover image URL</label>
            <input
              type="url"
              className="mk-admin-input"
              value={form.cover_image_url}
              onChange={e => setForm(f => ({ ...f, cover_image_url: e.target.value }))}
              placeholder="https://..."
            />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mk-admin-section" style={{ marginTop: 'var(--s-5)' }}>
        <h2 className="mk-admin-section-title">Body *</h2>
        <p className="mk-admin-muted" style={{ marginBottom: 'var(--s-3)' }}>
          Write in plain text or basic Markdown. This is stored as-is and rendered on the blog post page.
        </p>
        <textarea
          className="mk-admin-input mk-admin-textarea mk-admin-body-editor"
          value={form.body_json}
          onChange={e => setForm(f => ({ ...f, body_json: e.target.value }))}
          placeholder="Write your post content here…"
          rows={24}
          required
        />
      </div>

      {/* Actions */}
      <div className="mk-admin-section mk-admin-form-actions" style={{ marginTop: 'var(--s-5)' }}>
        <div style={{ display: 'flex', gap: 'var(--s-3)', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            type="submit"
            className="mk-admin-btn mk-admin-btn--gold"
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save Draft'}
          </button>

          {!form.published && (
            <button
              type="button"
              className="mk-admin-btn mk-admin-btn--plum"
              disabled={saving}
              onClick={e => handleSave(e as unknown as React.FormEvent, true)}
            >
              Publish Now
            </button>
          )}

          {form.published && (
            <button
              type="button"
              className="mk-admin-btn mk-admin-btn--plum"
              disabled={saving}
              onClick={e => handleSave(e as unknown as React.FormEvent, false)}
            >
              Unpublish
            </button>
          )}

          <button
            type="button"
            className="mk-admin-btn-text"
            onClick={() => router.push('/admin/blog')}
          >
            Cancel
          </button>
        </div>

        {form.published && (
          <p style={{ color: '#22a85a', fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 'var(--t-sm)', marginTop: 'var(--s-3)' }}>
            This post is live at /blog/{form.slug}
          </p>
        )}
      </div>
    </form>
  );
}
