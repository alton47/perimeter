"use client";
import { useRef } from "react";
import { useStore } from "@/store";
import { RISK_COLORS, RISK_LABELS, TRUSTED_NEWS } from "@/lib/constants";
import { formatDist, fmtTime } from "@/lib/utils";

function RadarAnim({ color }: { color: string }) {
  return (
    <svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      className="mx-auto mb-6"
    >
      {[44, 33, 22, 11].map((r, i) => (
        <circle
          key={i}
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={`${color}${i === 0 ? "18" : i === 1 ? "22" : i === 2 ? "30" : "40"}`}
          strokeWidth="0.8"
        />
      ))}
      <line
        x1="50"
        y1="6"
        x2="50"
        y2="94"
        stroke={`${color}18`}
        strokeWidth="0.6"
      />
      <line
        x1="6"
        y1="50"
        x2="94"
        y2="50"
        stroke={`${color}18`}
        strokeWidth="0.6"
      />
      <g
        style={{
          transformOrigin: "50px 50px",
          animation: "radar-spin 2s linear infinite",
        }}
      >
        <path d={`M50 50 L50 6 A44 44 0 0 1 90 28 Z`} fill={`${color}30`} />
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="6"
          stroke={color}
          strokeWidth="1.5"
          opacity="0.8"
        />
      </g>
      <circle cx="50" cy="50" r="3.5" fill={color} />
    </svg>
  );
}

function PulseRing({ color }: { color: string }) {
  return (
    <div className="relative flex items-center justify-center w-20 h-20 mx-auto mb-5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="absolute inset-0 rounded-full border-2 opacity-0"
          style={{
            borderColor: color,
            animation: `p-ring 2.4s ease-out ${i * 0.8}s infinite`,
          }}
        />
      ))}
      <span
        className="w-5 h-5 rounded-full"
        style={{ background: color, boxShadow: `0 0 20px ${color}` }}
      />
    </div>
  );
}

export function LocationModal() {
  const {
    locationModalOpen,
    setLocationModalOpen,
    riskResult,
    isCheckingRisk,
    locationError,
  } = useStore();
  const ref = useRef<HTMLDivElement>(null);

  if (!locationModalOpen) return null;

  const level = riskResult?.risk_level ?? "SAFE";
  const color = RISK_COLORS[level];

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === ref.current && !isCheckingRisk)
          setLocationModalOpen(false);
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      {/* Card */}
      <div
        className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: "#0d1520",
          border: `1px solid ${riskResult ? color + "35" : "rgba(255,255,255,0.12)"}`,
          boxShadow: riskResult
            ? `0 40px 80px rgba(0,0,0,0.7), 0 0 60px ${color}12`
            : "0 40px 80px rgba(0,0,0,0.7)",
        }}
      >
        {/* Glow line */}
        {riskResult && (
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${color}80, transparent)`,
            }}
          />
        )}

        <div className="p-8">
          {/* ── Loading ─────────────────── */}
          {isCheckingRisk && (
            <div className="text-center">
              <RadarAnim color="#00e87a" />
              <p
                className="text-[11px] font-mono uppercase tracking-[0.25em]"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                Scanning your location...
              </p>
              <p
                className="text-[10px] font-mono mt-2"
                style={{ color: "rgba(255,255,255,0.28)" }}
              >
                Please allow location access if prompted
              </p>
            </div>
          )}

          {/* ── Error ───────────────────── */}
          {!isCheckingRisk && locationError && (
            <div className="text-center">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{
                  background: "rgba(255,68,85,0.12)",
                  border: "1px solid rgba(255,68,85,0.35)",
                }}
              >
                <span style={{ color: "#ff4455", fontSize: 22 }}>!</span>
              </div>
              <p
                className="text-[14px] font-bold mb-2"
                style={{ color: "#fff", fontFamily: "var(--font-display)" }}
              >
                Location Unavailable
              </p>
              <p
                className="text-[12px] leading-relaxed"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                {locationError}
              </p>
            </div>
          )}

          {/* ── Result ──────────────────── */}
          {!isCheckingRisk && !locationError && riskResult && (
            <div className="text-center">
              <PulseRing color={color} />

              {/* Risk badge */}
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-widest mb-4 border"
                style={{
                  color,
                  borderColor: `${color}45`,
                  background: `${color}15`,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: color }}
                />
                {RISK_LABELS[level]}
              </div>

              {/* Outside region */}
              {riskResult.is_outside_region ? (
                <>
                  <p
                    className="text-[18px] font-bold text-white mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    You&apos;re safe in {riskResult.continent}
                  </p>
                  <p
                    className="text-[12px] leading-relaxed mb-5"
                    style={{ color: "rgba(255,255,255,0.6)" }}
                  >
                    Your location in{" "}
                    <strong style={{ color: "#fff" }}>
                      {riskResult.continent}
                    </strong>{" "}
                    is far outside any monitored Middle East conflict zones.
                    Focus on your daily activities.
                  </p>
                </>
              ) : (
                <>
                  <p
                    className="text-[34px] font-bold mb-0.5"
                    style={{
                      color,
                      fontFamily: "var(--font-display)",
                      lineHeight: 1,
                    }}
                  >
                    {formatDist(riskResult.distance_km)}
                  </p>
                  <p
                    className="text-[11px] font-mono mb-1"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    {riskResult.inside_zone
                      ? "inside zone:"
                      : "from nearest zone:"}
                  </p>
                  <p
                    className="text-[14px] font-bold mb-4"
                    style={{
                      color: "rgba(255,255,255,0.8)",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {riskResult.nearest_zone?.name}
                  </p>
                </>
              )}

              {/* Recommendation */}
              <div
                className="text-[11px] font-mono leading-relaxed text-left rounded-xl p-4 mb-5 border"
                style={{
                  color: "rgba(255,255,255,0.7)",
                  background: `${color}0e`,
                  borderColor: `${color}28`,
                }}
              >
                {riskResult.recommendation}
              </div>

              {/* News links */}
              <div className="text-left mb-5">
                <p
                  className="text-[9px] font-mono uppercase tracking-widest mb-2"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  Trusted Sources
                </p>
                <div className="space-y-1.5">
                  {riskResult.news_links.slice(0, 4).map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[11px] font-mono hover:text-blue-300 transition-colors"
                      style={{ color: "rgba(100,160,255,0.7)" }}
                    >
                      <span className="w-1 h-1 rounded-full bg-blue-400/50" />
                      {link.label} ↗
                    </a>
                  ))}
                </div>
              </div>

              {/* Data note */}
              <div className="rounded-lg p-3 border-t border-white/8 text-left">
                <p
                  className="text-[9px] font-mono leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  ⚠ Zone data sourced from public reports and may not reflect
                  real-time conditions. Last updated March 2025. Always verify
                  with official government advisories.
                </p>
              </div>

              {/* Coords */}
              <p
                className="text-[9px] font-mono mt-3"
                style={{ color: "rgba(255,255,255,0.22)" }}
              >
                {riskResult.user_coordinates.lat.toFixed(4)}°N{" "}
                {riskResult.user_coordinates.lng.toFixed(4)}°E &nbsp;·&nbsp;
                {fmtTime(riskResult.timestamp)}
              </p>
            </div>
          )}
        </div>

        <button
          disabled={isCheckingRisk}
          onClick={() => setLocationModalOpen(false)}
          className="w-full py-3.5 text-[10px] font-mono uppercase tracking-[0.2em] border-t transition-colors disabled:opacity-30"
          style={{
            color: "rgba(255,255,255,0.45)",
            borderColor: "rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.03)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "rgba(255,255,255,0.75)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "rgba(255,255,255,0.45)")
          }
        >
          {isCheckingRisk ? "Scanning…" : "Close"}
        </button>
      </div>
    </div>
  );
}
