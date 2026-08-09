"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Compress an image to fit within maxBytes using Canvas.
 * Converts to JPEG and reduces quality until under the target size.
 * Returns the compressed Blob (or the original if already small enough).
 */
async function compressImage(file: File, maxBytes = 3_500_000): Promise<Blob> {
  if (file.size <= maxBytes) return file;
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objUrl);
      const MAX_DIM = 1920;
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      if (w > MAX_DIM || h > MAX_DIM) {
        const r = Math.min(MAX_DIM / w, MAX_DIM / h);
        w = Math.round(w * r);
        h = Math.round(h * r);
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      let quality = 0.85;
      const attempt = () => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Canvas compression failed"));
              return;
            }
            if (blob.size <= maxBytes || quality < 0.25) {
              resolve(blob);
              return;
            }
            quality -= 0.1;
            attempt();
          },
          "image/jpeg",
          quality,
        );
      };
      attempt();
    };
    img.onerror = () => {
      URL.revokeObjectURL(objUrl);
      reject(new Error("Image load failed"));
    };
    img.src = objUrl;
  });
}

/**
 * Compress the file client-side, then POST FormData to our server-side upload route.
 * The server calls Vercel Blob put() directly using BLOB_READ_WRITE_TOKEN — no client token needed.
 */
async function uploadFileToBlob(file: File, prefix: string): Promise<string> {
  let uploadFile: Blob;
  try {
    uploadFile = await compressImage(file, 3_500_000);
  } catch {
    uploadFile = file;
  }

  const compressedName = file.name.replace(/\.[^.]+$/, ".jpg");
  const fd = new FormData();
  fd.append(
    "file",
    new File([uploadFile], compressedName, { type: "image/jpeg" }),
  );
  fd.append("prefix", prefix);

  const res = await fetch("/api/admin/banners/upload-server", {
    method: "POST",
    body: fd,
  });
  const data = await res.json();
  if (res.ok && data.url) return data.url as string;
  throw new Error(data.error ?? "Upload failed");
}

interface Banner {
  id: number;
  src: string;
  src_mobile: string | null;
  alt: string;
  order: number;
  is_active: boolean;
  created_at: string;
}

const MAX_BANNERS = 12;

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);
  const [blobConfigured, setBlobConfigured] = useState<boolean | null>(null);

  // Desktop upload state
  const [desktopFile, setDesktopFile] = useState<File | null>(null);
  const [desktopPreview, setDesktopPreview] = useState<string | null>(null);
  const desktopInputRef = useRef<HTMLInputElement>(null);

  // Mobile upload state
  const [mobileFile, setMobileFile] = useState<File | null>(null);
  const [mobilePreview, setMobilePreview] = useState<string | null>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const [altText, setAltText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [resetting, setResetting] = useState(false);

  // Drag state
  const dragId = useRef<number | null>(null);

  async function fetchBanners() {
    try {
      const res = await fetch("/api/admin/banners");
      const data = await res.json();
      setBanners(data.banners ?? []);
      if ("blob_configured" in data) setBlobConfigured(data.blob_configured);
    } catch {
      setMessage({ type: "err", text: "Could not load banners." });
    } finally {
      setLoading(false);
    }
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    fetchBanners();
  }, []);

  function handleDesktopChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setDesktopFile(f);
    setDesktopPreview(URL.createObjectURL(f));
  }

  function handleMobileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setMobileFile(f);
    setMobilePreview(URL.createObjectURL(f));
  }

  function clearMobile() {
    setMobileFile(null);
    setMobilePreview(null);
    if (mobileInputRef.current) mobileInputRef.current.value = "";
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    // Require at least one image AND alt text
    if ((!desktopFile && !mobileFile) || !altText) return;
    if (banners.length >= MAX_BANNERS) {
      setMessage({
        type: "err",
        text: `Maximum ${MAX_BANNERS} banners allowed.`,
      });
      return;
    }
    setUploading(true);
    setMessage(null);

    try {
      // 1. Upload desktop image (optional)
      let desktopUrl: string | null = null;
      if (desktopFile) {
        desktopUrl = await uploadFileToBlob(desktopFile, "banners/");
      }

      // 2. Upload mobile image (optional) — completely independent
      let mobileUrl: string | null = null;
      let mobileWarning: string | null = null;
      if (mobileFile) {
        try {
          mobileUrl = await uploadFileToBlob(mobileFile, "banners/mobile/");
        } catch (err) {
          mobileWarning = `Mobile image could not be uploaded and was skipped: ${String(err)}`;
        }
      }

      // 3. Save to DB — src can be empty string when desktop not provided
      const res = await fetch("/api/admin/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          src: desktopUrl ?? "",
          src_mobile: mobileUrl,
          alt: altText,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        const parts: string[] = [];
        if (desktopUrl) parts.push("desktop");
        if (mobileUrl) parts.push("mobile");
        const successText = `Banner uploaded (${parts.join(" + ")}).`;
        setMessage({
          type: mobileWarning ? "err" : "ok",
          text: mobileWarning
            ? `${successText} Warning: ${mobileWarning}`
            : successText,
        });
        setDesktopFile(null);
        setDesktopPreview(null);
        setAltText("");
        clearMobile();
        if (desktopInputRef.current) desktopInputRef.current.value = "";
        await fetchBanners();
      } else {
        setMessage({ type: "err", text: data.error ?? "DB save failed." });
      }
    } catch (err) {
      setMessage({ type: "err", text: `Upload failed: ${String(err)}` });
    } finally {
      setUploading(false);
    }
  }

  async function handleToggle(banner: Banner) {
    try {
      await fetch("/api/admin/banners", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: banner.id, is_active: !banner.is_active }),
      });
      setBanners((bs) =>
        bs.map((b) =>
          b.id === banner.id ? { ...b, is_active: !b.is_active } : b,
        ),
      );
    } catch {
      setMessage({ type: "err", text: "Failed to update banner." });
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this banner?")) return;
    try {
      await fetch("/api/admin/banners", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setBanners((bs) => bs.filter((b) => b.id !== id));
      setMessage({ type: "ok", text: "Banner deleted." });
    } catch {
      setMessage({ type: "err", text: "Delete failed." });
    }
  }

  async function handleReset() {
    if (
      !window.confirm(
        "Reset all banners to the 4 default images? This cannot be undone.",
      )
    )
      return;
    setResetting(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/banners", { method: "PUT" });
      const data = await res.json();
      if (res.ok) {
        setBanners(data.banners ?? []);
        setMessage({ type: "ok", text: "Banners reset to defaults." });
      } else {
        setMessage({ type: "err", text: data.error ?? "Reset failed." });
      }
    } catch {
      setMessage({ type: "err", text: "Network error." });
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
    const fromIdx = banners.findIndex((b) => b.id === dragId.current);
    const toIdx = banners.findIndex((b) => b.id === targetId);
    if (fromIdx === -1 || toIdx === -1) return;

    const reordered = [...banners];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);

    const updated = reordered.map((b, i) => ({ ...b, order: i }));
    setBanners(updated);
    dragId.current = null;

    await Promise.all(
      updated.map((b) =>
        fetch("/api/admin/banners", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: b.id, sort_order: b.order }),
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
          {resetting ? "Resetting…" : "Reset to defaults"}
        </button>
      </div>
      <p className="mk-admin-subtitle">
        These appear in the homepage slideshow. Drag to reorder. (
        {banners.length}/{MAX_BANNERS} banners)
      </p>

      {blobConfigured === false && (
        <div
          style={{
            background: "rgba(223,193,96,0.12)",
            border: "1px solid rgba(223,193,96,0.4)",
            borderRadius: 6,
            padding: "10px 14px",
            marginBottom: "var(--s-3)",
            fontFamily: "Poppins,sans-serif",
            fontSize: "var(--t-sm)",
            color: "#1C0A24",
            lineHeight: 1.5,
          }}
        >
          <strong>Local mode:</strong> <code>BLOB_READ_WRITE_TOKEN</code> is not
          set. Uploaded images will be saved to <code>/public/banners/</code> on
          the local filesystem. These files will{" "}
          <strong>not persist on Vercel deployments</strong>. Add{" "}
          <code>BLOB_READ_WRITE_TOKEN</code> to your <code>.env.local</code>{" "}
          (from Vercel dashboard &rarr; Storage &rarr; Blob) for production use.
        </div>
      )}

      {message && (
        <div
          className={`mk-admin-alert mk-admin-alert--${message.type === "ok" ? "success" : "error"}`}
        >
          {message.text}
        </div>
      )}

      {/* ── Banner list ── */}
      <div className="mk-admin-section">
        <h2 className="mk-admin-section-title">Current Banners</h2>
        {loading ? (
          <p className="mk-admin-muted">Loading…</p>
        ) : banners.length === 0 ? (
          <p className="mk-admin-muted">No banners yet. Upload one below.</p>
        ) : (
          <div className="mk-admin-banner-list">
            {banners.map((banner) => (
              <div
                key={banner.id}
                className="mk-admin-banner-row"
                draggable
                onDragStart={() => onDragStart(banner.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDrop(banner.id)}
              >
                {/* Drag handle */}
                <span className="mk-admin-drag-handle" title="Drag to reorder">
                  ⠿
                </span>

                {/* Thumbnails */}
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    flexShrink: 0,
                    alignItems: "center",
                  }}
                >
                  {/* Desktop thumbnail — only when src is non-empty */}
                  {banner.src ? (
                    <div style={{ position: "relative" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={banner.src}
                        alt={banner.alt}
                        title={`Desktop: ${banner.src}`}
                        className="mk-admin-banner-thumb"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.opacity =
                            "0.3";
                        }}
                      />
                      <span
                        style={{
                          position: "absolute",
                          bottom: 2,
                          left: 2,
                          background: "rgba(81,37,97,0.85)",
                          color: "#fff",
                          fontSize: "0.5rem",
                          fontFamily: "Poppins,sans-serif",
                          fontWeight: 700,
                          padding: "1px 4px",
                          borderRadius: 2,
                          letterSpacing: "0.05em",
                        }}
                      >
                        DESKTOP
                      </span>
                    </div>
                  ) : (
                    <div
                      style={{
                        width: 80,
                        height: 45,
                        border: "1px dashed var(--gallery-dk)",
                        borderRadius: 4,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "Poppins,sans-serif",
                          fontSize: "0.5rem",
                          color: "var(--mist)",
                          textAlign: "center",
                          lineHeight: 1.3,
                        }}
                      >
                        No
                        <br />
                        desktop
                      </span>
                    </div>
                  )}

                  {/* Mobile thumbnail (only if uploaded) */}
                  {banner.src_mobile ? (
                    <div style={{ position: "relative" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={banner.src_mobile}
                        alt={`Mobile: ${banner.alt}`}
                        title={`Mobile: ${banner.src_mobile}`}
                        style={{
                          width: 45,
                          height: 80,
                          objectFit: "cover",
                          borderRadius: 4,
                          border: "1px solid var(--gallery-dk)",
                          flexShrink: 0,
                          display: "block",
                        }}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.opacity =
                            "0.3";
                        }}
                      />
                      <span
                        style={{
                          position: "absolute",
                          bottom: 2,
                          left: 2,
                          background: "rgba(81,37,97,0.85)",
                          color: "#fff",
                          fontSize: "0.5rem",
                          fontFamily: "Poppins,sans-serif",
                          fontWeight: 700,
                          padding: "1px 4px",
                          borderRadius: 2,
                          letterSpacing: "0.05em",
                        }}
                      >
                        MOBILE
                      </span>
                    </div>
                  ) : (
                    <div
                      style={{
                        width: 45,
                        height: 80,
                        border: "1px dashed var(--gallery-dk)",
                        borderRadius: 4,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "Poppins,sans-serif",
                          fontSize: "0.5rem",
                          color: "var(--mist)",
                          textAlign: "center",
                          lineHeight: 1.3,
                        }}
                      >
                        No
                        <br />
                        mobile
                      </span>
                    </div>
                  )}
                </div>

                {/* Alt text */}
                <input
                  type="text"
                  defaultValue={banner.alt}
                  className="mk-admin-input mk-admin-input--sm"
                  onBlur={async (e) => {
                    const newAlt = e.target.value.trim();
                    if (newAlt && newAlt !== banner.alt) {
                      await fetch("/api/admin/banners", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id: banner.id, alt: newAlt }),
                      });
                    }
                  }}
                  style={{ flex: 1 }}
                />

                {/* Active toggle */}
                <label
                  className="mk-admin-toggle"
                  title={banner.is_active ? "Active" : "Inactive"}
                >
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

      {/* ── Upload form ── */}
      <div className="mk-admin-section" style={{ marginTop: "var(--s-5)" }}>
        <h2 className="mk-admin-section-title">Upload New Banner</h2>

        <p className="mk-admin-muted" style={{ marginBottom: "var(--s-4)" }}>
          Upload a <strong>desktop (landscape)</strong> image, a{" "}
          <strong>mobile (portrait)</strong> image, or both. Desktop images are
          shown on tablets &amp; desktops only. Mobile images are shown on
          phones only. They are completely independent — phones will{" "}
          <strong>never</strong> crop a desktop image.
        </p>

        {banners.length >= MAX_BANNERS ? (
          <p className="mk-admin-muted" style={{ color: "#c0392b" }}>
            Maximum {MAX_BANNERS} banners reached. Delete one to upload a new
            banner.
          </p>
        ) : (
          <form onSubmit={handleUpload} noValidate>
            <div className="mk-admin-form-grid mk-admin-form-grid--2">
              {/* Desktop image (optional) */}
              <div className="mk-admin-field">
                <label className="mk-admin-label">
                  Desktop image — landscape
                  <span
                    style={{
                      fontFamily: "Poppins,sans-serif",
                      fontSize: "var(--t-2xs)",
                      fontWeight: 400,
                      color: "var(--mist)",
                      marginLeft: 6,
                    }}
                  >
                    shown on tablet &amp; desktop
                  </span>
                </label>
                <label
                  className={`mk-admin-drop-zone${desktopFile ? " mk-admin-drop-zone--over" : ""}`}
                  style={{ cursor: "pointer" }}
                >
                  <input
                    ref={desktopInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleDesktopChange}
                    style={{ display: "none" }}
                  />
                  {desktopPreview ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={desktopPreview}
                      alt="Desktop preview"
                      className="mk-admin-upload-preview"
                      style={{ margin: "0 auto" }}
                    />
                  ) : (
                    <>
                      <p className="mk-admin-drop-zone__label">
                        Click to choose desktop image
                      </p>
                      <p className="mk-admin-drop-zone__sub">
                        Landscape · 1920×600 px recommended · JPG, PNG or WebP ·
                        max 5 MB · skip if not needed
                      </p>
                    </>
                  )}
                </label>
                {desktopFile && (
                  <p
                    className="mk-admin-muted"
                    style={{ marginTop: "0.375rem" }}
                  >
                    {desktopFile.name} ({(desktopFile.size / 1024).toFixed(0)}{" "}
                    KB)
                  </p>
                )}
              </div>

              {/* Mobile image (optional) */}
              <div className="mk-admin-field">
                <label className="mk-admin-label">
                  Mobile image — portrait (optional)
                  <span
                    style={{
                      fontFamily: "Poppins,sans-serif",
                      fontSize: "var(--t-2xs)",
                      fontWeight: 400,
                      color: "var(--mist)",
                      marginLeft: 6,
                    }}
                  >
                    shown on phones instead of cropping desktop
                  </span>
                </label>
                <label
                  className={`mk-admin-drop-zone${mobileFile ? " mk-admin-drop-zone--over" : ""}`}
                  style={{ cursor: "pointer", borderStyle: "dashed" }}
                >
                  <input
                    ref={mobileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleMobileChange}
                    style={{ display: "none" }}
                  />
                  {mobilePreview ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={mobilePreview}
                      alt="Mobile preview"
                      style={{
                        height: 160,
                        width: "auto",
                        maxWidth: "100%",
                        objectFit: "contain",
                        margin: "0 auto",
                        display: "block",
                      }}
                    />
                  ) : (
                    <>
                      <p className="mk-admin-drop-zone__label">
                        Click to choose mobile image
                      </p>
                      <p className="mk-admin-drop-zone__sub">
                        Portrait 9:16 · 1080×1920 px recommended · JPG, PNG or
                        WebP · max 5 MB · skip if not needed
                      </p>
                    </>
                  )}
                </label>
                {mobileFile && (
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                      marginTop: "0.375rem",
                    }}
                  >
                    <p className="mk-admin-muted" style={{ flex: 1 }}>
                      {mobileFile.name} ({(mobileFile.size / 1024).toFixed(0)}{" "}
                      KB)
                    </p>
                    <button
                      type="button"
                      className="mk-admin-btn-text mk-admin-btn-text--plum"
                      onClick={clearMobile}
                      style={{ fontSize: "var(--t-xs)" }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Alt text */}
              <div className="mk-admin-field" style={{ gridColumn: "1 / -1" }}>
                <label className="mk-admin-label">
                  Alt text (accessibility &amp; SEO)
                </label>
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="e.g. MK Gold Bangalore — instant cash for gold"
                  className="mk-admin-input"
                  required
                />
                <p
                  className="mk-admin-muted"
                  style={{ marginTop: "0.5rem", fontSize: "0.7rem" }}
                >
                  Describe the banner for screen readers and Google image
                  search.
                </p>
              </div>
            </div>

            <div style={{ marginTop: "var(--s-4)" }}>
              <button
                type="submit"
                className="mk-admin-btn mk-admin-btn--gold"
                disabled={
                  uploading || (!desktopFile && !mobileFile) || !altText
                }
              >
                {uploading
                  ? "Uploading…"
                  : desktopFile && mobileFile
                    ? "Upload Desktop + Mobile"
                    : desktopFile
                      ? "Upload Desktop Banner"
                      : "Upload Mobile Banner"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
