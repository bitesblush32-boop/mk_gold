'use client';

import { useEffect, useRef, useState } from 'react';

interface Banner {
  id:         number;
  src:        string;
  alt:        string;
  order:      number;
  is_active:  boolean;
  created_at: string;
}

const MAX_BANNERS = 8;

export default function BannersPage() {
  const [banners, setBanners]   = useState<Banner[]>([]);
  const [loading, setLoading]   = useState(true);
  const [message, setMessage]   = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  // Upload form state
  const [file, setFile]         = useState<File | null>(null);
  const [preview, setPreview]   = useState<string | null>(null);
  const [altText, setAltText]   = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef            = useRef<HTMLInputElement>(null);

  const [resetting, setResetting] = useState(false);

  // Drag state
  const dragId = useRef<number | null>(null);

  async function fetchBanners() {
    try {
      const res  = await fetch('/api/admin/banners');
      const data = await res.json();
      setBanners(data.banners ?? []);
    } catch {
      setMessage({ type: 'err', text: 'Could not load banners.' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchBanners(); }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !altText) return;
    if (banners.length >= MAX_BANNERS) {
      setMessage({ type: 'err', text: `Maximum ${MAX_BANNERS} banners allowed.` });
      return;
    }
    setUploading(true);
    setMessage(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('alt', altText);
      const res  = await fetch('/api/admin/banners', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'ok', text: 'Banner uploaded.' });
        setFile(null);
        setAltText('');
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        await fetchBanners();
      } else {
        setMessage({ type: 'err', text: data.error ?? 'Upload failed.' });
      }
    } catch {
      setMessage({ type: 'err', text: 'Network error.' });
    } finally {
      setUploading(false);
    }
  }

  async function handleToggle(banner: Banner) {
    try {
      await fetch('/api/admin/banners', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ id: banner.id, is_active: !banner.is_active }),
      });
      setBanners(bs => bs.map(b => b.id === banner.id ? { ...b, is_active: !b.is_active } : b));
    } catch {
      setMessage({ type: 'err', text: 'Failed to update banner.' });
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Delete this banner?')) return;
    try {
      await fetch('/api/admin/banners', {
        method:  'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ id }),
      });
      setBanners(bs => bs.filter(b => b.id !== id));
      setMessage({ type: 'ok', text: 'Banner deleted.' });
    } catch {
      setMessage({ type: 'err', text: 'Delete failed.' });
    }
  }

  async function handleReset() {
    if (!window.confirm('Reset all banners to the 4 default images? This cannot be undone.')) return;
    setResetting(true);
    setMessage(null);
    try {
      const res  = await fetch('/api/admin/banners', { method: 'PUT' });
      const data = await res.json();
      if (res.ok) {
        setBanners(data.banners ?? []);
        setMessage({ type: 'ok', text: 'Banners reset to defaults.' });
      } else {
        setMessage({ type: 'err', text: data.error ?? 'Reset failed.' });
      }
    } catch {
      setMessage({ type: 'err', text: 'Network error.' });
    } finally {
      setResetting(false);
    }
  }

  // HTML5 native drag-and-drop reordering
  function onDragStart(id: number) {
    dragId.current = id;
  }

  async function onDrop(targetId: number) {
    if (dragId.current === null || dragId.current === targetId) return;
    const fromIdx = banners.findIndex(b => b.id === dragId.current);
    const toIdx   = banners.findIndex(b => b.id === targetId);
    if (fromIdx === -1 || toIdx === -1) return;

    const reordered = [...banners];
    const [moved]   = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);

    // Assign new order values
    const updated = reordered.map((b, i) => ({ ...b, order: i }));
    setBanners(updated);
    dragId.current = null;

    // Persist each reordered banner
    await Promise.all(
      updated.map(b =>
        fetch('/api/admin/banners', {
          method:  'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ id: b.id, sort_order: b.order }),
        }),
      ),
    );
  }

  return (
    <div className="mk-admin-page">
      <div className="mk-admin-topbar">
        <h1 className="mk-admin-page-title">Hero Banners</h1>
        <button
          className="mk-admin-btn mk-admin-btn--outline"
          onClick={handleReset}
          disabled={resetting}
          title="Wipe all DB rows and re-seed the 4 default banner images"
        >
          {resetting ? 'Resetting…' : 'Reset to defaults'}
        </button>
      </div>
      <p className="mk-admin-subtitle">
        These appear in the homepage slideshow. Drag to reorder.
        {' '}({banners.length}/{MAX_BANNERS} banners)
      </p>

      {message && (
        <div className={`mk-admin-alert mk-admin-alert--${message.type === 'ok' ? 'success' : 'error'}`}>
          {message.text}
        </div>
      )}

      {/* Banner list */}
      <div className="mk-admin-section">
        <h2 className="mk-admin-section-title">Current Banners</h2>
        {loading ? (
          <p className="mk-admin-muted">Loading…</p>
        ) : banners.length === 0 ? (
          <p className="mk-admin-muted">No banners yet. Upload one below.</p>
        ) : (
          <div className="mk-admin-banner-list">
            {banners.map(banner => (
              <div
                key={banner.id}
                className="mk-admin-banner-row"
                draggable
                onDragStart={() => onDragStart(banner.id)}
                onDragOver={e => e.preventDefault()}
                onDrop={() => onDrop(banner.id)}
              >
                {/* Drag handle */}
                <span className="mk-admin-drag-handle" title="Drag to reorder">⠿</span>

                {/* Thumbnail */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={banner.src}
                  alt={banner.alt}
                  title={banner.src}
                  className="mk-admin-banner-thumb"
                  onError={e => {
                    const img = e.currentTarget;
                    img.style.display = 'none';
                    const ph = img.nextElementSibling as HTMLElement | null;
                    if (ph) ph.style.display = 'flex';
                  }}
                />
                <div
                  style={{
                    display: 'none',
                    width: 80,
                    height: 45,
                    flexShrink: 0,
                    background: '#dddcdc',
                    borderRadius: 4,
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.55rem',
                    color: '#8a7898',
                    textAlign: 'center',
                    padding: '0 4px',
                    overflow: 'hidden',
                    wordBreak: 'break-all',
                    title: banner.src,
                  }}
                  title={banner.src}
                >
                  {banner.src.split('/').pop()}
                </div>

                {/* Alt text */}
                <input
                  type="text"
                  defaultValue={banner.alt}
                  className="mk-admin-input mk-admin-input--sm"
                  onBlur={async e => {
                    const newAlt = e.target.value.trim();
                    if (newAlt && newAlt !== banner.alt) {
                      await fetch('/api/admin/banners', {
                        method:  'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body:    JSON.stringify({ id: banner.id, alt: newAlt }),
                      });
                    }
                  }}
                  style={{ flex: 1 }}
                />

                {/* Active toggle */}
                <label className="mk-admin-toggle" title={banner.is_active ? 'Active' : 'Inactive'}>
                  <input
                    type="checkbox"
                    checked={banner.is_active}
                    onChange={() => handleToggle(banner)}
                    className="mk-admin-toggle__input"
                  />
                  <span className="mk-admin-toggle__track" />
                </label>

                {/* Delete */}
                <button
                  className="mk-admin-btn-text mk-admin-btn-text--plum"
                  onClick={() => handleDelete(banner.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload form */}
      <div className="mk-admin-section" style={{ marginTop: 'var(--s-5)' }}>
        <h2 className="mk-admin-section-title">Upload New Banner</h2>
        {banners.length >= MAX_BANNERS ? (
          <p className="mk-admin-muted" style={{ color: '#c0392b' }}>
            Maximum {MAX_BANNERS} banners reached. Delete one to upload a new banner.
          </p>
        ) : (
          <form onSubmit={handleUpload} noValidate>
            <div className="mk-admin-form-grid mk-admin-form-grid--2">
              <div className="mk-admin-field">
                <label className="mk-admin-label">Image file</label>
                <label
                  className={`mk-admin-drop-zone${file ? ' mk-admin-drop-zone--over' : ''}`}
                  style={{ cursor: 'pointer' }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    required
                  />
                  {preview ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={preview} alt="Preview" className="mk-admin-upload-preview" style={{ margin: '0 auto' }} />
                  ) : (
                    <>
                      <p className="mk-admin-drop-zone__label">Click to choose image</p>
                      <p className="mk-admin-drop-zone__sub">JPG, PNG or WebP · max 5MB</p>
                    </>
                  )}
                </label>
                {file && (
                  <p className="mk-admin-muted" style={{ marginTop: '0.375rem' }}>
                    {file.name} ({(file.size / 1024).toFixed(0)} KB)
                  </p>
                )}
              </div>
              <div className="mk-admin-field">
                <label className="mk-admin-label">Alt text (for accessibility & SEO)</label>
                <input
                  type="text"
                  value={altText}
                  onChange={e => setAltText(e.target.value)}
                  placeholder="e.g. MK Gold Bangalore — instant cash for gold"
                  className="mk-admin-input"
                  required
                />
                <p className="mk-admin-muted" style={{ marginTop: '0.5rem', fontSize: '0.7rem' }}>
                  Describe the banner image for screen readers and Google image search.
                </p>
              </div>
            </div>
            <div style={{ marginTop: 'var(--s-4)' }}>
              <button
                type="submit"
                className="mk-admin-btn mk-admin-btn--gold"
                disabled={uploading || !file || !altText}
              >
                {uploading ? 'Uploading…' : 'Upload Banner'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
