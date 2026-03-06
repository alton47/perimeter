"use client";
import { useStore } from "@/store";
import { RISK_COLORS, RISK_LABELS, TRUSTED_NEWS } from "@/lib/constants";
import { EMBASSIES } from "@/data/zones";

function SkeletonPanel() {
  return (
    <div className="pt-16 px-5 space-y-4 animate-pulse">
      <div className="space-y-2">
        <div className="h-2 bg-white/8 rounded w-20" />
        <div className="h-5 bg-white/12 rounded w-40" />
        <div className="h-5 bg-white/8 rounded-full w-24" />
      </div>
      <div className="space-y-1.5 mt-4">
        <div className="h-2 bg-white/7 rounded w-full" />
        <div className="h-2 bg-white/7 rounded w-5/6" />
        <div className="h-2 bg-white/5 rounded w-4/6" />
      </div>
      <div className="grid grid-cols-2 gap-2 mt-2">
        <div className="h-14 bg-white/6 rounded-lg" />
        <div className="h-14 bg-white/6 rounded-lg" />
      </div>
    </div>
  );
}

export function RightPanel() {
  const { selectedZone, setSelectedZone } = useStore();

  /* No zone selected → show trusted sources */
  if (!selectedZone) {
    return (
      <aside
        className="hidden lg:flex fixed right-0 top-9 bottom-0 z-20 w-75 flex-col border-l border-white/10"
        style={{ background: "#0d1520ee", backdropFilter: "blur(20px)" }}
      >
        <div className="pt-16 px-5 pb-4 border-b border-white/10">
          <p
            className="text-[9px] font-mono uppercase tracking-widest mb-2"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Zone Detail
          </p>
          <p
            className="text-[13px] font-bold"
            style={{
              fontFamily: "var(--font-display)",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            Select a zone
          </p>
          <p
            className="text-[11px] mt-1"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Click any zone on the globe or in the list to view details.
          </p>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <p
            className="text-[9px] font-mono uppercase tracking-widest mb-3"
            style={{ color: "rgba(255,255,255,0.38)" }}
          >
            Trusted Sources
          </p>
          <div className="space-y-2">
            {TRUSTED_NEWS.map((n, i) => (
              <a
                key={i}
                href={n.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 py-1.5 hover:text-blue-300 transition-colors group"
                style={{
                  color: "rgba(100,150,255,0.65)",
                  fontSize: 11,
                  fontFamily: "Space Mono, monospace",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400/40 shrink-0 group-hover:bg-blue-400" />
                {n.label} ↗
              </a>
            ))}
          </div>
        </div>
      </aside>
    );
  }

  const color = RISK_COLORS[selectedZone.risk_level];
  const embassy = EMBASSIES[selectedZone.country];

  return (
    <aside
      className="hidden lg:flex fixed right-0 top-9 bottom-0 z-20 w-75 flex-col border-l border-white/10 overflow-y-auto"
      style={{ background: "#0d1520ee", backdropFilter: "blur(20px)" }}
    >
      {/* Zone header */}
      <div
        className="pt-16 px-5 pb-4 border-b border-white/10"
        style={{
          borderLeftWidth: 3,
          borderLeftStyle: "solid",
          borderLeftColor: color,
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 pr-2">
            <p
              className="text-[9px] font-mono uppercase tracking-widest mb-1"
              style={{ color: "rgba(255,255,255,0.38)" }}
            >
              {selectedZone.region}
            </p>
            <h2
              className="text-[15px] font-bold leading-snug"
              style={{ fontFamily: "var(--font-display)", color: "#fff" }}
            >
              {selectedZone.name}
            </h2>
          </div>
          <button
            onClick={() => setSelectedZone(null)}
            className="shrink-0 text-lg leading-none transition-colors hover:text-white"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            ×
          </button>
        </div>

        {/* Risk badge */}
        <div
          className="mt-2.5 inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border"
          style={{ color, borderColor: `${color}45`, background: `${color}18` }}
        >
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: color }}
          />
          {RISK_LABELS[selectedZone.risk_level]}
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-4 space-y-5">
        {/* Situation */}
        <div>
          <p
            className="text-[9px] font-mono uppercase tracking-widest mb-2"
            style={{ color: "rgba(255,255,255,0.38)" }}
          >
            Situation
          </p>
          <p
            className="text-[12px] leading-relaxed"
            style={{ color: "rgba(255,255,255,0.72)" }}
          >
            {selectedZone.description}
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Country", value: selectedZone.country },
            { label: "Zone Radius", value: `${selectedZone.radius_km} km` },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-lg p-3"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <p
                className="text-[9px] font-mono uppercase mb-1"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                {s.label}
              </p>
              <p
                className="text-[12px] font-bold"
                style={{
                  color: "rgba(255,255,255,0.8)",
                  fontFamily: "var(--font-display)",
                }}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Embassy */}
        {embassy && (
          <div
            className="rounded-xl p-4"
            style={{
              background: "rgba(40,80,255,0.08)",
              border: "1px solid rgba(60,100,255,0.22)",
            }}
          >
            <p
              className="text-[9px] font-mono uppercase tracking-widest mb-2"
              style={{ color: "rgba(130,160,255,0.7)" }}
            >
              🏛 US Embassy · {embassy.city}
            </p>
            <p
              className="text-[11px] font-bold mb-1"
              style={{
                color: "rgba(255,255,255,0.75)",
                fontFamily: "var(--font-display)",
              }}
            >
              Emergency Line
            </p>
            <p
              className="text-[14px] font-bold mb-2"
              style={{ color: "#ff6677" }}
            >
              {embassy.emergency}
            </p>
            <a
              href={embassy.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-mono hover:text-blue-300 transition-colors"
              style={{ color: "rgba(100,150,255,0.6)" }}
            >
              Embassy Website ↗
            </a>
          </div>
        )}

        {/* Data note */}
        <div
          className="rounded-lg p-3"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <p
            className="text-[10px] font-mono leading-relaxed"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            ⚠ Zone boundaries are approximate, sourced from public conflict
            reports. Data last updated March 2025 and may not reflect real-time
            conditions.
          </p>
        </div>

        {/* Sources */}
        {selectedZone.source_links.length > 0 && (
          <div>
            <p
              className="text-[9px] font-mono uppercase tracking-widest mb-2"
              style={{ color: "rgba(255,255,255,0.38)" }}
            >
              Official Sources
            </p>
            {selectedZone.source_links.map((l, i) => (
              <a
                key={i}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-[11px] font-mono py-1 hover:text-blue-300 transition-colors"
                style={{ color: "rgba(100,150,255,0.6)" }}
              >
                {l.label} ↗
              </a>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
