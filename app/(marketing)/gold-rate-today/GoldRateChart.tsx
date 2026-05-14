'use client';

import { useState } from 'react';

/* ─── Data ──────────────────────────────────────────────────────── */

const ALL_DATA: { year: number; rate: number }[] = [
  { year: 2014, rate: 26500 },
  { year: 2015, rate: 24800 },
  { year: 2016, rate: 28200 },
  { year: 2017, rate: 29100 },
  { year: 2018, rate: 30400 },
  { year: 2019, rate: 35800 },
  { year: 2020, rate: 48500 },
  { year: 2021, rate: 44200 },
  { year: 2022, rate: 52100 },
  { year: 2023, rate: 58400 },
  { year: 2024, rate: 71200 },
  { year: 2025, rate: 88600 },
];

type Filter = '5yr' | '10yr' | 'all';

function getFilteredData(f: Filter): { year: number; rate: number }[] {
  if (f === '5yr')  return ALL_DATA.slice(-6);   // 2020–2025
  if (f === '10yr') return ALL_DATA.slice(-11);  // 2015–2025
  return ALL_DATA;                                // 2014–2025
}

function fmtINR(n: number): string {
  return new Intl.NumberFormat('en-IN').format(n);
}

/* ─── SVG layout constants ──────────────────────────────────────── */

const VB_W = 880;
const VB_H = 300;
const PAD  = { top: 24, right: 24, bottom: 52, left: 72 };
const CW   = VB_W - PAD.left - PAD.right; // 784
const CH   = VB_H - PAD.top  - PAD.bottom; // 224

/* ─── Component ─────────────────────────────────────────────────── */

export function GoldRateChart() {
  const [filter,  setFilter]  = useState<Filter>('all');
  const [hovered, setHovered] = useState<number | null>(null);

  const data = getFilteredData(filter);
  const n    = data.length;

  const minR = Math.min(...data.map(d => d.rate));
  const maxR = Math.max(...data.map(d => d.rate));
  const span = maxR - minR;
  const yMin = minR - span * 0.08;
  const yMax = maxR + span * 0.08;

  const xS = (i: number) => PAD.left + (i / (n - 1)) * CW;
  const yS = (r: number) => PAD.top  + CH - ((r - yMin) / (yMax - yMin)) * CH;

  // SVG paths
  const pts      = data.map((d, i) => `${xS(i).toFixed(1)},${yS(d.rate).toFixed(1)}`);
  const linePath = `M ${pts.join(' L ')}`;
  const baseline = (PAD.top + CH).toFixed(1);
  const areaPath =
    `${linePath} L ${xS(n - 1).toFixed(1)},${baseline} L ${xS(0).toFixed(1)},${baseline} Z`;

  // Y-axis ticks (5 evenly spaced levels)
  const yTicks = Array.from({ length: 5 }, (_, i) =>
    yMin + ((yMax - yMin) * i) / 4
  );

  // Tooltip geometry
  const tip     = hovered !== null ? data[hovered] : null;
  const tipX    = hovered !== null ? xS(hovered)   : 0;
  const tipY    = tip ? yS(tip.rate) : 0;
  const flipTip = hovered !== null && hovered > n * 0.6;
  const tipTX   = flipTip ? tipX - 112 : tipX + 12;
  const tipTY   = Math.max(PAD.top, Math.min(tipY - 36, PAD.top + CH - 48));

  return (
    <section className="mk-bg-light section" id="gold-rate-history">
      <div className="mk-container">

        <div className="reveal">
          <p className="mk-section-overline">Historical Trend</p>
          <h2
            style={{
              fontFamily: 'Tanker, serif',
              fontSize: 'var(--t-h2)',
              color: 'var(--ink)',
              margin: '0.5rem 0 0.375rem',
              lineHeight: 1.15,
            }}
          >
            Gold Rate Since 2014
          </h2>
          <p
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: 'var(--t-sm)',
              color: 'var(--mist)',
              margin: '0 0 1.75rem',
            }}
          >
            Per 10 grams · INR · Source: MCX India · Illustrative historical trend
          </p>

          {/* Filter pills */}
          <div className="mk-chart-filters">
            {(['5yr', '10yr', 'all'] as Filter[]).map(f => (
              <button
                key={f}
                className={`mk-chart-pill${filter === f ? ' mk-chart-pill--active' : ''}`}
                onClick={() => { setFilter(f); setHovered(null); }}
              >
                {f === 'all' ? 'All' : f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* SVG area chart */}
        <div className="mk-chart-wrap reveal delay-1">
          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            className="mk-chart-svg"
            role="img"
            aria-label="Historical gold rate chart — 2014 to 2025, per 10 grams in INR"
          >
            <defs>
              <linearGradient id="mkGoldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#DFC160" stopOpacity="0.30" />
                <stop offset="100%" stopColor="#DFC160" stopOpacity="0.02" />
              </linearGradient>
              <clipPath id="mkChartClip">
                <rect x={PAD.left} y={PAD.top} width={CW} height={CH} />
              </clipPath>
            </defs>

            {/* Y-axis grid lines + labels */}
            {yTicks.map((v, i) => {
              const y     = yS(v);
              const label = v >= 100000
                ? `₹${(v / 100000).toFixed(1)}L`
                : `₹${Math.round(v / 1000)}K`;
              return (
                <g key={i}>
                  <line
                    x1={PAD.left} y1={y}
                    x2={PAD.left + CW} y2={y}
                    stroke="rgba(81,37,97,0.07)"
                    strokeWidth={0.75}
                    strokeDasharray="4,4"
                  />
                  <text
                    x={PAD.left - 8} y={y + 4}
                    textAnchor="end"
                    fill="rgba(138,120,152,0.75)"
                    fontSize={9.5}
                    fontFamily="Poppins, sans-serif"
                  >
                    {label}
                  </text>
                </g>
              );
            })}

            {/* Area fill */}
            <path d={areaPath} fill="url(#mkGoldGrad)" clipPath="url(#mkChartClip)" />

            {/* Line */}
            <path
              d={linePath}
              fill="none"
              stroke="#DFC160"
              strokeWidth={2.5}
              strokeLinejoin="round"
              strokeLinecap="round"
              clipPath="url(#mkChartClip)"
            />

            {/* X-axis labels */}
            {data.map((d, i) => {
              const show = n <= 7 || i % 2 === 0 || i === n - 1;
              if (!show) return null;
              return (
                <text
                  key={d.year}
                  x={xS(i)}
                  y={PAD.top + CH + 20}
                  textAnchor="middle"
                  fill={hovered === i ? '#DFC160' : 'rgba(138,120,152,0.75)'}
                  fontSize={9.5}
                  fontFamily="Poppins, sans-serif"
                  fontWeight={hovered === i ? '600' : '400'}
                >
                  {d.year}
                </text>
              );
            })}

            {/* Data point dots */}
            {data.map((d, i) => (
              <circle
                key={d.year}
                cx={xS(i)}
                cy={yS(d.rate)}
                r={hovered === i ? 5 : 3}
                fill={hovered === i ? '#DFC160' : '#C9A940'}
                stroke={hovered === i ? '#fff' : 'none'}
                strokeWidth={1.5}
              />
            ))}

            {/* Invisible hit columns — one per data point */}
            {data.map((_, i) => {
              const x0 = i === 0
                ? PAD.left
                : (xS(i - 1) + xS(i)) / 2;
              const x1 = i === n - 1
                ? PAD.left + CW
                : (xS(i) + xS(i + 1)) / 2;
              return (
                <rect
                  key={i}
                  x={x0} y={PAD.top}
                  width={x1 - x0} height={CH}
                  fill="transparent"
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  onTouchStart={e => { e.preventDefault(); setHovered(i); }}
                  onTouchEnd={() => setHovered(null)}
                  style={{ cursor: 'crosshair' }}
                />
              );
            })}

            {/* Tooltip — renders inside SVG to avoid coordinate conversion */}
            {tip && (
              <g
                transform={`translate(${tipTX.toFixed(1)},${tipTY.toFixed(1)})`}
                style={{ pointerEvents: 'none' }}
              >
                <rect
                  width={100} height={44} rx={6}
                  fill="#3B1848"
                  stroke="rgba(223,193,96,0.40)"
                  strokeWidth={1}
                />
                <text
                  x={50} y={16}
                  textAnchor="middle"
                  fill="#DFC160"
                  fontSize={11}
                  fontFamily="Poppins, sans-serif"
                  fontWeight="700"
                >
                  {tip.year}
                </text>
                <text
                  x={50} y={32}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.85)"
                  fontSize={10}
                  fontFamily="Poppins, sans-serif"
                >
                  ₹{fmtINR(tip.rate)}/10g
                </text>
              </g>
            )}
          </svg>
        </div>

        <p
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: 'var(--t-2xs)',
            color: 'var(--mist)',
            marginTop: 'var(--s-3)',
            textAlign: 'right',
          }}
        >
          Approximate historical values for illustrative purposes. Past rates do not guarantee future prices.
        </p>

      </div>
    </section>
  );
}
