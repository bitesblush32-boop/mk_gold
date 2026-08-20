"use client";
// N03 — Lead capture popup (2s delay · session storage · portal)

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { MkSeal } from "@/components/ui/MkSeal";
import { MkButton } from "@/components/ui/MkButton";
import { trackFormSubmit } from "@/lib/analytics";
import { getUtmParams } from "@/lib/utm";

// Module-level — computed once when client bundle loads (Aug = month index 7)
const IS_TIRANGA_MONTH =
  typeof window !== "undefined" && new Date().getMonth() === 7;

export function MkLeadPopup() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    pincode: "",
    goldType: "",
    weight: "",
    purity: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => setOpen(true), 2000);
    const onOpen = () => setOpen(true);
    window.addEventListener("mk:openPopup", onOpen);
    return () => {
      clearTimeout(t);
      window.removeEventListener("mk:openPopup", onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function dismiss() {
    setOpen(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError("");

    const cleanPhone = form.phone.replace(/\s/g, "");
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setPhoneError("Enter a valid 10-digit Indian mobile number");
      return;
    }

    setStatus("loading");

    const puritiyKarat =
      form.purity === "24k" ? 24 : form.purity === "22k" ? 22 : undefined;
    const weightGrams =
      form.weight === "under30"
        ? 20
        : form.weight === "under50"
          ? 40
          : form.weight === "over100"
            ? 100
            : undefined;

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 15000);

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          name: form.name,
          phone: cleanPhone,
          city: form.city || undefined,
          area: form.pincode || undefined,
          gold_type: form.goldType || undefined,
          weight_grams: weightGrams != null ? String(weightGrams) : undefined,
          purity_karat: puritiyKarat,
          notes: form.message || undefined,
          source: "popup-lead-form",
          ...getUtmParams(),
        }),
      });
      clearTimeout(timer);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (
          data?.error?.toLowerCase().includes("phone") ||
          data?.error?.toLowerCase().includes("mobile")
        ) {
          setPhoneError(data.error);
        }
        throw new Error();
      }
      trackFormSubmit({ source: "popup" });
      setStatus("success");
    } catch {
      if (!phoneError) setStatus("error");
    }
  };

  if (!mounted || !open) return null;

  const popup = (
    <>
      <div
        aria-hidden="true"
        onClick={dismiss}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 500,
          background: "rgba(28,10,36,0.72)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          animation: "lp-fadeIn 300ms ease both",
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Get a free gold evaluation"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          zIndex: 501,
          width: "min(520px, calc(100vw - 2rem))",
          maxHeight: "calc(100svh - 4rem)",
          overflowY: "auto",
          borderRadius: "var(--r-2xl)",
          boxShadow:
            "0 24px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(223,193,96,0.2)",
          animation:
            "lp-popupSlideIn 350ms cubic-bezier(0.34, 1.56, 0.64, 1) both",
        }}
      >
        {/* Header */}
        <div style={{ background: "var(--plum-deep)", padding: "1.5rem 2rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "1rem",
            }}
          >
            <span
              style={{
                display: "inline-block",
                background: "var(--gold)",
                color: "var(--plum)",
                fontFamily: "Poppins, sans-serif",
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "0.25rem 0.75rem",
                borderRadius: "9999px",
              }}
            >
              Free Evaluation
            </span>
            <button
              onClick={dismiss}
              aria-label="Close"
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.12)",
                border: "none",
                color: "white",
                cursor: "pointer",
                flexShrink: 0,
                fontFamily: "Poppins, sans-serif",
                fontSize: "1.125rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ×
            </button>
          </div>
          <h2
            style={{
              fontFamily: "Tanker, serif",
              fontSize: "1.75rem",
              color: "white",
              textAlign: "center",
              lineHeight: 1.2,
              marginBottom: "0.625rem",
              marginTop: 0,
            }}
          >
            Get the <span style={{ color: "var(--gold)" }}>Best Price</span> for
            Your Gold
          </h2>
          <p
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "var(--t-sm)",
              color: "rgba(255,255,255,0.65)",
              textAlign: "center",
              margin: 0,
            }}
          >
            Fill in your details — we&apos;ll call you back within 30 minutes.
          </p>
        </div>

        {/* Body */}
        <div
          style={{
            background: IS_TIRANGA_MONTH
              ? "linear-gradient(155deg, rgba(255,153,51,0.45) 0%, rgba(255,255,255,1) 38%, rgba(255,255,255,1) 62%, rgba(19,136,8,0.45) 100%)"
              : "white",
            padding: "2rem",
            position: "relative",
          }}
        >
          {status === "success" ? (
            <div style={{ textAlign: "center", padding: "1rem 0" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "1rem",
                }}
              >
                <MkSeal variant="en" size="sm" />
              </div>
              <h3
                style={{
                  fontFamily: "Tanker, serif",
                  fontSize: "1.5rem",
                  color: "var(--gold)",
                  marginBottom: "0.75rem",
                  marginTop: 0,
                }}
              >
                We&apos;ll call you shortly.
              </h3>
              <p
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "var(--t-sm)",
                  color: "var(--ink-mid)",
                  marginBottom: "1.5rem",
                }}
              >
                Our team will reach out within 30 minutes during branch hours
                (9:30 AM – 7:00 PM).
              </p>
              <MkButton variant="outline-plum" onClick={dismiss}>
                Close
              </MkButton>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="lp-form-grid">
                <div>
                  <label className="lp-form-label">Full Name</label>
                  <input
                    type="text"
                    className="mk-input"
                    placeholder="Your name"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="lp-form-label">Phone Number</label>
                  <input
                    type="tel"
                    className={`mk-input${phoneError ? " mk-input--error" : ""}`}
                    placeholder="10-digit mobile number"
                    required
                    inputMode="numeric"
                    autoComplete="tel"
                    pattern="[6-9][0-9]{9}"
                    maxLength={10}
                    value={form.phone}
                    onChange={(e) => {
                      const digits = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10);
                      setForm((f) => ({ ...f, phone: digits }));
                      setPhoneError("");
                    }}
                  />
                  {phoneError && (
                    <p
                      style={{
                        fontFamily: "Poppins,sans-serif",
                        fontSize: "0.72rem",
                        color: "#dc2626",
                        margin: "0.25rem 0 0",
                      }}
                    >
                      {phoneError}
                    </p>
                  )}
                </div>
                <div>
                  <label className="lp-form-label">City</label>
                  <select
                    className="mk-select"
                    required
                    value={form.city}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        city: e.target.value,
                        pincode: "",
                      }))
                    }
                  >
                    <option value="" disabled>
                      Select your city
                    </option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Mysore">Mysore</option>
                    <option value="Mangalore">Mangalore</option>
                    <option value="Davangere">Davangere</option>
                  </select>
                </div>
                {form.city === "Bangalore" && (
                  <div>
                    <label className="lp-form-label">
                      Nearest Area / Pincode
                    </label>
                    <select
                      className="mk-select"
                      value={form.pincode}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, pincode: e.target.value }))
                      }
                    >
                      <option value="">Select your area (optional)</option>
                      <option value="Rajajinagar – 560010">
                        Rajajinagar – 560010
                      </option>
                      <option value="Malleshwaram – 560003">
                        Malleshwaram – 560003
                      </option>
                      <option value="Vijayanagar – 560040">
                        Vijayanagar – 560040
                      </option>
                      <option value="Basaveshwaranagar – 560079">
                        Basaveshwaranagar – 560079
                      </option>
                      <option value="Yeshwanthpur – 560022">
                        Yeshwanthpur – 560022
                      </option>
                      <option value="Jayanagar – 560041">
                        Jayanagar – 560041
                      </option>
                      <option value="Indiranagar – 560038">
                        Indiranagar – 560038
                      </option>
                      <option value="Koramangala – 560034">
                        Koramangala – 560034
                      </option>
                      <option value="Whitefield – 560066">
                        Whitefield – 560066
                      </option>
                      <option value="JP Nagar – 560078">
                        JP Nagar – 560078
                      </option>
                    </select>
                  </div>
                )}
                <div>
                  <label className="lp-form-label">Gold Type</label>
                  <select
                    className="mk-select"
                    required
                    value={form.goldType}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, goldType: e.target.value }))
                    }
                  >
                    <option value="" disabled>
                      Select type
                    </option>
                    <option value="jewellery">Gold Jewellery</option>
                    <option value="coins">Gold Coins</option>
                    <option value="bars">Gold Bars</option>
                    <option value="broken">Broken / Damaged Gold</option>
                    <option value="pledged">Pledged Gold (bank/NBFC)</option>
                  </select>
                </div>
                <div>
                  <label className="lp-form-label">Approx. Weight</label>
                  <select
                    className="mk-select"
                    value={form.weight}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, weight: e.target.value }))
                    }
                  >
                    <option value="" disabled>
                      Select weight range
                    </option>
                    <option value="under30">Under 30 gms</option>
                    <option value="under50">30 – 100 gms</option>
                    <option value="over100">More than 100 gms</option>
                  </select>
                </div>
                <div>
                  <label className="lp-form-label">Gold Purity</label>
                  <select
                    className="mk-select"
                    value={form.purity}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, purity: e.target.value }))
                    }
                  >
                    <option value="" disabled>
                      Select purity
                    </option>
                    <option value="24k">24K (Pure / Coins)</option>
                    <option value="22k">22K (Most common)</option>
                    <option value="unknown">Not sure (we test free)</option>
                  </select>
                </div>
              </div>
              <div style={{ marginTop: "1rem" }}>
                <label className="lp-form-label">Message / Notes</label>
                <textarea
                  className="mk-textarea"
                  rows={3}
                  placeholder="Any details about your gold (optional)"
                  value={form.message}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, message: e.target.value }))
                  }
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="mk-btn mk-btn--gold"
                style={{
                  width: "100%",
                  marginTop: "1.25rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1rem",
                  padding: "0.875rem 1.5rem",
                  opacity: status === "loading" ? 0.7 : 1,
                  cursor: status === "loading" ? "not-allowed" : "pointer",
                }}
              >
                {status === "loading" ? "Sending..." : "Get My Free Quote Now"}
              </button>
              {status === "error" && (
                <p
                  style={{
                    textAlign: "center",
                    color: "#dc2626",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "var(--t-xs)",
                    marginTop: "0.5rem",
                  }}
                >
                  Something went wrong. Please try again.
                </p>
              )}
              <p
                style={{
                  textAlign: "center",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "var(--t-xs)",
                  color: "var(--mist)",
                  marginTop: "0.75rem",
                }}
              >
                No spam. No pressure. We call once.
              </p>
            </form>
          )}

          {/* Red Fort + tricolor flag + birds — decorative illustration, Aug only */}
          {IS_TIRANGA_MONTH && (
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: "160px",
                opacity: 0.1,
                pointerEvents: "none",
                zIndex: 0,
              }}
            >
              <svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
                {/* Ground */}
                <rect
                  x="0"
                  y="128"
                  width="200"
                  height="12"
                  fill="#138808"
                  rx="3"
                />
                {/* Fort base wall */}
                <rect x="15" y="78" width="170" height="50" fill="#CC6633" />
                {/* Battlements */}
                {[0, 18, 36, 54, 72, 90, 108, 126, 144].map((x, i) => (
                  <rect
                    key={i}
                    x={15 + x}
                    y="68"
                    width="11"
                    height="13"
                    fill="#CC6633"
                    rx="1"
                  />
                ))}
                {/* Main gate arch */}
                <rect x="82" y="98" width="36" height="30" fill="#7A3A1A" />
                <path
                  d="M82,98 Q100,82 118,98"
                  fill="none"
                  stroke="#7A3A1A"
                  strokeWidth="2"
                />
                {/* Side towers */}
                <rect x="15" y="60" width="24" height="68" fill="#B85C2C" />
                <rect x="161" y="60" width="24" height="68" fill="#B85C2C" />
                {/* Flag pole */}
                <line
                  x1="100"
                  y1="28"
                  x2="100"
                  y2="68"
                  stroke="#DFC160"
                  strokeWidth="2.5"
                />
                {/* Tricolor flag */}
                <rect x="100" y="28" width="38" height="12" fill="#FF9933" />
                <rect x="100" y="40" width="38" height="12" fill="#FFFFFF" />
                <rect x="100" y="52" width="38" height="12" fill="#138808" />
                {/* Birds */}
                <path
                  d="M38,16 Q43,10 48,16 Q53,10 58,16"
                  fill="none"
                  stroke="#512561"
                  strokeWidth="1.8"
                  opacity="0.8"
                />
                <path
                  d="M145,8 Q150,3 155,8 Q160,3 165,8"
                  fill="none"
                  stroke="#512561"
                  strokeWidth="1.8"
                  opacity="0.8"
                />
                <path
                  d="M62,30 Q65,26 68,30 Q71,26 74,30"
                  fill="none"
                  stroke="#512561"
                  strokeWidth="1.2"
                  opacity="0.5"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return createPortal(popup, document.body);
}
