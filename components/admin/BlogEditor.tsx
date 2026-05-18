'use client';

import { useRef, useState } from 'react';
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
  'News',
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
    category:        initialValues?.category        ?? 'Gold Rate',
    cover_image_url: initialValues?.cover_image_url ?? '',
    published:       initialValues?.published       ?? false,
    id:              initialValues?.id,
  });

  const [saving,        setSaving]        = useState(false);
  const [message,       setMessage]       = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [imgUploading,  setImgUploading]  = useState(false);
  const [imgPreview,    setImgPreview]    = useState<string>(initialValues?.cover_image_url ?? '');
  const imgInputRef = useRef<HTMLInputElement>(null);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant local preview while uploading
    const localUrl = URL.createObjectURL(file);
    setImgPreview(localUrl);

    setImgUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res  = await fetch('/api/admin/blog-image', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok && data.url) {
        setForm(f => ({ ...f, cover_image_url: data.url }));
        setImgPreview(data.url);
      } else {
        setMessage({ type: 'err', text: data.error ?? 'Image upload failed.' });
        setImgPreview(form.cover_image_url); // revert preview
      }
    } catch {
      setMessage({ type: 'err', text: 'Network error during image upload.' });
      setImgPreview(form.cover_image_url);
    } finally {
      setImgUploading(false);
      // Reset file input so the same file can be re-chosen
      if (imgInputRef.current) imgInputRef.current.value = '';
    }
  }

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

          {/* Cover image — upload to Vercel Blob */}
          <div className="mk-admin-field" style={{ gridColumn: '1 / -1' }}>
            <label className="mk-admin-label">Cover image</label>
            <div style={{ display: 'flex', gap: 'var(--s-4)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              {/* Preview */}
              {imgPreview ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={imgPreview}
                  alt="Cover preview"
                  style={{
                    width: 160, height: 90,
                    objectFit: 'cover',
                    borderRadius: 6,
                    border: '1px solid var(--gallery-dk)',
                    flexShrink: 0,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 160, height: 90,
                    borderRadius: 6,
                    border: '1px dashed var(--gallery-dk)',
                    background: 'var(--gallery)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'var(--t-xs)', color: 'var(--mist)' }}>
                    No image
                  </span>
                </div>
              )}

              <div style={{ flex: 1, minWidth: 220 }}>
                {/* File upload */}
                <label
                  className={`mk-admin-drop-zone${imgUploading ? ' mk-admin-drop-zone--over' : ''}`}
                  style={{ cursor: imgUploading ? 'wait' : 'pointer', padding: '0.875rem 1rem' }}
                >
                  <input
                    ref={imgInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={imgUploading}
                    style={{ display: 'none' }}
                  />
                  <p className="mk-admin-drop-zone__label" style={{ margin: 0 }}>
                    {imgUploading ? 'Uploading to CDN…' : 'Click to upload cover image'}
                  </p>
                  <p className="mk-admin-drop-zone__sub" style={{ margin: '0.25rem 0 0' }}>
                    JPG, PNG or WebP · max 5 MB · uploads to Vercel Blob CDN
                  </p>
                </label>

                {/* CDN URL — read-only confirmation */}
                {form.cover_image_url && (
                  <p
                    style={{
                      marginTop: '0.5rem',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '0.65rem',
                      color: 'var(--mist)',
                      wordBreak: 'break-all',
                    }}
                  >
                    {form.cover_image_url}
                  </p>
                )}
              </div>
            </div>
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
