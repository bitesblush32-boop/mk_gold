'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export interface BlogEditorPost {
  id?:              number;
  title:            string;
  slug:             string;
  excerpt:          string;
  body_json:        string;          // HTML string stored in DB
  category:         string;
  cover_image_url:  string;
  is_featured:      boolean;
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

/* ─── Toolbar button styles ─────────────────────────────────────── */

const BTN: React.CSSProperties = {
  fontFamily: 'Poppins, sans-serif',
  fontSize: '0.8rem',
  fontWeight: 600,
  lineHeight: 1,
  padding: '0.375rem 0.625rem',
  border: '1px solid var(--gallery-dk)',
  borderRadius: 4,
  background: 'var(--white)',
  color: 'var(--ink)',
  cursor: 'pointer',
  userSelect: 'none',
  WebkitUserSelect: 'none',
  transition: 'background 120ms, color 120ms',
};

const BTN_ACTIVE: React.CSSProperties = {
  ...BTN,
  background: 'var(--plum)',
  color: 'var(--white)',
  borderColor: 'var(--plum)',
};

const DIVIDER: React.CSSProperties = {
  width: 1,
  height: 24,
  background: 'var(--gallery-dk)',
  margin: '0 2px',
  flexShrink: 0,
};

export default function BlogEditor({ initialValues, mode }: Props) {
  const router  = useRouter();
  const editorRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<BlogEditorPost>({
    title:           initialValues?.title           ?? '',
    slug:            initialValues?.slug            ?? '',
    excerpt:         initialValues?.excerpt         ?? '',
    body_json:       initialValues?.body_json       ?? '',
    category:        initialValues?.category        ?? 'Gold Rate',
    cover_image_url: initialValues?.cover_image_url ?? '',
    is_featured:     initialValues?.is_featured     ?? false,
    published:       initialValues?.published       ?? false,
    id:              initialValues?.id,
  });

  const [saving,       setSaving]       = useState(false);
  const [message,      setMessage]      = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [imgUploading, setImgUploading] = useState(false);
  const [imgPreview,   setImgPreview]   = useState<string>(initialValues?.cover_image_url ?? '');
  const imgInputRef = useRef<HTMLInputElement>(null);

  // Populate contenteditable on mount / when editing
  useEffect(() => {
    if (editorRef.current && form.body_json) {
      editorRef.current.innerHTML = form.body_json;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ─── execCommand helpers ──────────────────────────────────────── */

  const exec = useCallback((cmd: string, value?: string) => {
    editorRef.current?.focus();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (document as any).execCommand(cmd, false, value ?? undefined);
    syncBody();
  }, []);

  function syncBody() {
    if (editorRef.current) {
      setForm(f => ({ ...f, body_json: editorRef.current!.innerHTML }));
    }
  }

  function handleLink() {
    const existing = (document as any).queryCommandValue('createLink');
    const url = window.prompt('Enter URL (include https://):', existing || 'https://');
    if (url === null) return; // cancelled
    if (url.trim() === '') {
      exec('unlink');
    } else {
      exec('createLink', url.trim());
    }
  }

  /* ─── Image upload ─────────────────────────────────────────────── */

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
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
        setImgPreview(form.cover_image_url);
      }
    } catch {
      setMessage({ type: 'err', text: 'Network error during image upload.' });
      setImgPreview(form.cover_image_url);
    } finally {
      setImgUploading(false);
      if (imgInputRef.current) imgInputRef.current.value = '';
    }
  }

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const title = e.target.value;
    setForm(f => ({
      ...f,
      title,
      slug: mode === 'new' ? slugify(title) : f.slug,
    }));
  }

  /* ─── Save ─────────────────────────────────────────────────────── */

  async function handleSave(e: React.FormEvent, publishNow?: boolean) {
    e.preventDefault();
    const currentBody = editorRef.current?.innerHTML ?? form.body_json;
    if (!form.title || !form.slug || !currentBody.trim()) {
      setMessage({ type: 'err', text: 'Title, slug and body are required.' });
      return;
    }
    setSaving(true);
    setMessage(null);

    const payload = {
      ...form,
      body_json: currentBody,
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

  /* ─── Render ────────────────────────────────────────────────────── */

  return (
    <form onSubmit={e => handleSave(e)} noValidate>
      {message && (
        <div className={`mk-admin-alert mk-admin-alert--${message.type === 'ok' ? 'success' : 'error'}`}>
          {message.text}
        </div>
      )}

      {/* ── Post Details ── */}
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
            <label className="mk-admin-label">Cover image</label>
            <div style={{ display: 'flex', gap: 'var(--s-4)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
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
                {form.cover_image_url && (
                  <p style={{ marginTop: '0.5rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: 'var(--mist)', wordBreak: 'break-all' }}>
                    {form.cover_image_url}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Featured article checkbox */}
          <div className="mk-admin-field" style={{ gridColumn: '1 / -1' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                cursor: 'pointer',
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))}
                style={{ width: 18, height: 18, accentColor: 'var(--plum)', cursor: 'pointer' }}
              />
              <span>
                <span className="mk-admin-label" style={{ margin: 0, display: 'block' }}>
                  Featured Article
                </span>
                <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'var(--t-xs)', color: 'var(--mist)' }}>
                  Shows as the highlighted article at the top of /blog. Only one post should be featured at a time.
                </span>
              </span>
            </label>
          </div>

        </div>
      </div>

      {/* ── Body / Rich Text Editor ── */}
      <div className="mk-admin-section" style={{ marginTop: 'var(--s-5)' }}>
        <h2 className="mk-admin-section-title">Body *</h2>

        {/* Toolbar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px',
            alignItems: 'center',
            padding: '8px 10px',
            background: 'var(--gallery)',
            border: '1px solid var(--gallery-dk)',
            borderBottom: 'none',
            borderRadius: '6px 6px 0 0',
          }}
        >
          {/* Text style */}
          <button type="button" style={BTN} title="Bold (Ctrl+B)" onMouseDown={e => { e.preventDefault(); exec('bold'); }}>
            <strong>B</strong>
          </button>
          <button type="button" style={BTN} title="Italic (Ctrl+I)" onMouseDown={e => { e.preventDefault(); exec('italic'); }}>
            <em>I</em>
          </button>
          <button type="button" style={{ ...BTN, textDecoration: 'underline' }} title="Underline (Ctrl+U)" onMouseDown={e => { e.preventDefault(); exec('underline'); }}>
            U
          </button>
          <button type="button" style={{ ...BTN, textDecoration: 'line-through' }} title="Strikethrough" onMouseDown={e => { e.preventDefault(); exec('strikeThrough'); }}>
            S
          </button>

          <div style={DIVIDER} />

          {/* Headings */}
          <button type="button" style={BTN} title="Heading 2" onMouseDown={e => { e.preventDefault(); exec('formatBlock', 'h2'); }}>
            H2
          </button>
          <button type="button" style={BTN} title="Heading 3" onMouseDown={e => { e.preventDefault(); exec('formatBlock', 'h3'); }}>
            H3
          </button>
          <button type="button" style={BTN} title="Normal paragraph" onMouseDown={e => { e.preventDefault(); exec('formatBlock', 'p'); }}>
            P
          </button>
          <button type="button" style={BTN} title="Blockquote" onMouseDown={e => { e.preventDefault(); exec('formatBlock', 'blockquote'); }}>
            &ldquo;&nbsp;&rdquo;
          </button>

          <div style={DIVIDER} />

          {/* Lists */}
          <button type="button" style={BTN} title="Bullet list" onMouseDown={e => { e.preventDefault(); exec('insertUnorderedList'); }}>
            &bull; List
          </button>
          <button type="button" style={BTN} title="Numbered list" onMouseDown={e => { e.preventDefault(); exec('insertOrderedList'); }}>
            1. List
          </button>

          <div style={DIVIDER} />

          {/* Alignment */}
          <button type="button" style={BTN} title="Align left" onMouseDown={e => { e.preventDefault(); exec('justifyLeft'); }}>
            Left
          </button>
          <button type="button" style={BTN} title="Align centre" onMouseDown={e => { e.preventDefault(); exec('justifyCenter'); }}>
            Centre
          </button>

          <div style={DIVIDER} />

          {/* Link */}
          <button type="button" style={BTN} title="Insert / edit link" onMouseDown={e => { e.preventDefault(); handleLink(); }}>
            Link
          </button>
          <button type="button" style={BTN} title="Remove link" onMouseDown={e => { e.preventDefault(); exec('unlink'); }}>
            Unlink
          </button>

          <div style={DIVIDER} />

          {/* Indent */}
          <button type="button" style={BTN} title="Indent" onMouseDown={e => { e.preventDefault(); exec('indent'); }}>
            →
          </button>
          <button type="button" style={BTN} title="Outdent" onMouseDown={e => { e.preventDefault(); exec('outdent'); }}>
            ←
          </button>

          <div style={DIVIDER} />

          {/* Clear */}
          <button type="button" style={{ ...BTN, color: '#a03030' }} title="Remove all formatting from selection" onMouseDown={e => { e.preventDefault(); exec('removeFormat'); }}>
            Clear
          </button>
        </div>

        {/* Contenteditable editor */}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={syncBody}
          onBlur={syncBody}
          style={{
            minHeight: 420,
            padding: '1rem 1.25rem',
            border: '1px solid var(--gallery-dk)',
            borderRadius: '0 0 6px 6px',
            background: 'var(--white)',
            fontFamily: 'Poppins, sans-serif',
            fontSize: '0.9375rem',
            lineHeight: 1.75,
            color: 'var(--ink)',
            outline: 'none',
            overflowY: 'auto',
          }}
          data-placeholder="Write your post content here…"
        />

        {/* Placeholder text via CSS */}
        <style>{`
          [data-placeholder]:empty::before {
            content: attr(data-placeholder);
            color: var(--mist);
            pointer-events: none;
          }
          [contenteditable] h2 { font-family: Tanker, serif; font-size: 1.4rem; color: var(--plum); margin: 1.25rem 0 0.5rem; }
          [contenteditable] h3 { font-family: Poppins, sans-serif; font-size: 1.05rem; font-weight: 600; color: var(--plum); margin: 1rem 0 0.4rem; }
          [contenteditable] blockquote { border-left: 3px solid var(--gold); padding: 0.5rem 1rem; margin: 1rem 0; background: var(--gallery); font-style: italic; }
          [contenteditable] a { color: var(--purple); text-decoration: underline; }
          [contenteditable] ul, [contenteditable] ol { padding-left: 1.5rem; margin: 0.75rem 0; }
          [contenteditable] li { margin-bottom: 0.25rem; }
          [contenteditable] p { margin: 0 0 0.75rem; }
          [contenteditable]:focus { box-shadow: 0 0 0 2px rgba(81,37,97,0.18); }
        `}</style>
      </div>

      {/* ── Actions ── */}
      <div className="mk-admin-section mk-admin-form-actions" style={{ marginTop: 'var(--s-5)' }}>
        <div style={{ display: 'flex', gap: 'var(--s-3)', flexWrap: 'wrap', alignItems: 'center' }}>
          <button type="submit" className="mk-admin-btn mk-admin-btn--gold" disabled={saving}>
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

          <button type="button" className="mk-admin-btn-text" onClick={() => router.push('/admin/blog')}>
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
