"use client";

import Image from "next/image";
import { useState } from "react";
import { useGoldRate } from "@/hooks/useGoldRate";

function fmt(v: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(v);
}

export function GoldCalculatorUnlocked() {
  const [weight, setWeight] = useState("");
  const [purity, setPurity] = useState<22 | 24>(22);
  const { baseRate22K, baseRate24K, isLoading } = useGoldRate();

  const activeRate = purity === 22 ? baseRate22K : baseRate24K;
  const weightNum = parseFloat(weight) || 0;
  const estimate =
    weightNum > 0 && activeRate > 0
      ? Math.round(activeRate * weightNum * 0.975)
      : null;

  return (
    <div className="gc-layout">
      {/* ── Left column ─────────────────────────────────── */}
      <div className="gc-left">
        <h2 className="gc-heading">Calculate Your Gold Value</h2>
        <p className="gc-subtitle">Get an estimated value for your gold</p>

        <div className="gc-card">
          {/* Input panel */}
          <div className="gc-card__inputs">
            <div className="gc-fields-row">
              <div className="gc-field">
                <label className="gc-label" htmlFor="gc-weight">
                  Enter Weight
                </label>
                <div className="gc-weight-wrap">
                  <input
                    id="gc-weight"
                    type="number"
                    min="0.1"
                    step="0.1"
                    placeholder="10"
                    inputMode="decimal"
                    className="gc-weight-input"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                  <span className="gc-weight-unit">Grams</span>
                </div>
              </div>

              <div className="gc-field">
                <label className="gc-label" htmlFor="gc-purity">
                  Select Purity
                </label>
                <div className="gc-select-wrap">
                  <select
                    id="gc-purity"
                    className="gc-select"
                    value={purity}
                    onChange={(e) =>
                      setPurity(Number(e.target.value) as 22 | 24)
                    }
                  >
                    <option value={22}>22k (91.6%)</option>
                    <option value={24}>24k (99.9%)</option>
                  </select>
                </div>
              </div>
            </div>

            <p className="gc-rate-line">
              Today&apos;s rate ({purity}k):{" "}
              <strong>
                {isLoading || activeRate === 0
                  ? "—"
                  : `${fmt(activeRate)}/gram`}
              </strong>
            </p>
            <p className="gc-disclaimer">
              *Rate set by MK Gold. Final value confirmed at branch after XRF
              purity test.
            </p>
          </div>

          {/* Result panel */}
          <div className="gc-card__result">
            <p className="gc-result-label">Estimated Value</p>
            <p className="gc-result-value" aria-live="polite">
              {estimate !== null ? fmt(estimate) : "—"}
            </p>
            <p className="gc-result-note">*Approximate Value</p>
            <button
              className="gc-reset-btn"
              onClick={() => setWeight("")}
              type="button"
            >
              Check another
              <br />
              value
            </button>
          </div>
        </div>
      </div>

      {/* ── Right column: Gold.png ───────────────────────── */}
      <div className="gc-right">
        <Image
          src="/Gold.png"
          alt="Gold jewellery being weighed at MK Gold"
          fill
          className="gc-image"
          sizes="(max-width: 960px) 100vw, 40vw"
          priority={false}
        />
      </div>
    </div>
  );
}
