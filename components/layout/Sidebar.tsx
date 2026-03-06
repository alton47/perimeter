"use client";
import { useStore } from "@/store";
import { ZONES, ADVISORIES } from "@/data/zones";
import { RISK_COLORS, RISK_LABELS } from "@/lib/constants";
import type { RiskLevel } from "@/types";

const FILTERS: Array<RiskLevel | "ALL"> = [
  "ALL",
  "CRITICAL",
  "RED",
  "YELLOW",
  "GREEN",
];

function ZoneSkeleton() {
  return (
    <div className="px-4 py-3 border-b border-white/8 space-y-2 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="h-3 bg-white/10 rounded w-32" />
        <div className="h-4 bg-white/8 rounded-full w-16" />
      </div>
      <div className="h-2 bg-white/7 rounded w-full" />
      <div className="h-2 bg-white/5 rounded w-2/3" />
    </div>
  );
}

function ZoneItem({ zone }: { zone: (typeof ZONES)[0] }) {
  const { selectedZone, setSelectedZone } = useStore();
  const active = selectedZone?.id === zone.id;
  const color = RISK_COLORS[zone.risk_level];

  return (
    <button
      onClick={() => setSelectedZone(active ? null : zone)}
      className="w-full text-left px-4 py-3 border-b border-white/8 transition-all"
      style={{
        borderLeftWidth: 2,
        borderLeftStyle: "solid",
        borderLeftColor: active ? color : "transparent",
        background: active ? `${color}12` : "transparent",
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        {/* Zone name - VISIBLE */}
        <span
          className="text-[12px] font-bold leading-snug"
          style={{
            fontFamily: "var(--font-display)",
            color: active ? "#fff" : "rgba(255,255,255,0.85)",
          }}
        >
          {zone.name}
        </span>
        {/* Risk badge */}
        <span
          className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wide border"
          style={{ color, borderColor: `${color}45`, background: `${color}15` }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: color }}
          />
          {zone.risk_level}
        </span>
      </div>
      {/* Description - readable */}
      <p
        className="text-[10px] leading-relaxed line-clamp-2"
        style={{ color: "rgba(255,255,255,0.55)" }}
      >
        {zone.description}
      </p>
      {/* Meta */}
      <p
        className="text-[9px] mt-1.5"
        style={{ color: "rgba(255,255,255,0.32)" }}
      >
        {zone.country} · {zone.radius_km} km radius
      </p>
    </button>
  );
}

function AdvisoryItem({ adv }: { adv: (typeof ADVISORIES)[0] }) {
  const color = RISK_COLORS[adv.risk_level];
  return (
    <a
      href={adv.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block px-4 py-3 border-b border-white/8 hover:bg-white/4 transition-colors group"
    >
      <div className="flex items-center justify-between mb-1">
        <span
          className="text-[9px] font-mono font-bold uppercase tracking-wider"
          style={{ color }}
        >
          {adv.risk_level}
        </span>
        <span
          className="text-[9px]"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          {adv.date}
        </span>
      </div>
      {/* Country - readable */}
      <p
        className="text-[11px] font-bold mb-0.5"
        style={{
          fontFamily: "var(--font-display)",
          color: "rgba(255,255,255,0.82)",
        }}
      >
        {adv.country}
      </p>
      <p
        className="text-[9px] leading-relaxed line-clamp-2"
        style={{ color: "rgba(255,255,255,0.5)" }}
      >
        {adv.summary}
      </p>
      <p
        className="text-[9px] mt-1 group-hover:text-blue-400 transition-colors"
        style={{ color: "rgba(100,140,255,0.55)" }}
      >
        {adv.source} ↗
      </p>
    </a>
  );
}

export function Sidebar() {
  const { sidebarOpen, riskFilter, setRiskFilter } = useStore();
  const filtered =
    riskFilter === "ALL"
      ? ZONES
      : ZONES.filter((z) => z.risk_level === riskFilter);

  return (
    <aside
      className={`fixed left-0 top-9 bottom-0 z-20 w-70 flex flex-col
        border-r border-white/10
        transition-transform duration-300 ease-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      style={{ background: "#0d1520ee", backdropFilter: "blur(20px)" }}
    >
      {/* Section label */}
      <div className="pt-14 px-4 pb-3 border-b border-white/10">
        {/* Filters */}
        <p
          className="text-[9px] font-mono uppercase tracking-widest mb-2"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          Filter by risk level
        </p>
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => {
            const c = f === "ALL" ? "#fff" : RISK_COLORS[f];
            const active = riskFilter === f;
            return (
              <button
                key={f}
                onClick={() => setRiskFilter(f)}
                className="px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-wide border transition-all"
                style={{
                  color: active ? c : `${c}60`,
                  borderColor: active ? `${c}55` : `${c}22`,
                  background: active ? `${c}18` : "transparent",
                }}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Zone list header */}
        <div className="px-4 pt-3 pb-1 flex items-center justify-between sticky top-0 bg-[#0d1520] border-b border-white/8 z-10">
          <p
            className="text-[9px] font-mono uppercase tracking-widest"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Active Zones
          </p>
          <span
            className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/8"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            {filtered.length}
          </span>
        </div>
        {filtered.map((z) => (
          <ZoneItem key={z.id} zone={z} />
        ))}

        {/* Advisories */}
        <div className="px-4 pt-4 pb-1 sticky top-0 bg-[#0d1520] border-b border-white/8 z-10 mt-2">
          <p
            className="text-[9px] font-mono uppercase tracking-widest"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Official Advisories
          </p>
        </div>
        {ADVISORIES.map((a) => (
          <AdvisoryItem key={a.id} adv={a} />
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/10">
        <p
          className="text-[9px] font-mono leading-relaxed"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          {ZONES.length} zones · US State Dept · UN OCHA · Public data
        </p>
      </div>
    </aside>
  );
}
