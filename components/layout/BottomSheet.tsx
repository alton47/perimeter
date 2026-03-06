"use client";
import { useState, useRef } from "react";
import { useStore } from "@/store";
import { useCheckLocation } from "@/hooks/useCheckLocation";
import { RISK_COLORS, RISK_LABELS, TRUSTED_NEWS } from "@/lib/constants";
import { EMBASSIES, ADVISORIES } from "@/data/zones";

export function BottomSheet() {
  const [expanded, setExpanded] = useState(false);
  const [tab, setTab] = useState<"zone" | "news">("zone");
  const startY = useRef(0);
  const { selectedZone, setSelectedZone } = useStore();
  const { check } = useCheckLocation();

  const onTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dy = e.changedTouches[0].clientY - startY.current;
    if (dy < -40) setExpanded(true);
    if (dy > 40) setExpanded(false);
  };

  const color = selectedZone ? RISK_COLORS[selectedZone.risk_level] : "#00e87a";
  const embassy = selectedZone ? EMBASSIES[selectedZone.country] : undefined;

  return (
    <div
      className="lg:hidden fixed bottom-0 left-0 right-0 z-25 flex flex-col rounded-t-2xl border-t border-white/12"
      style={{
        background: "rgba(13,21,32,0.97)",
        backdropFilter: "blur(24px)",
        maxHeight: "75vh",
        transform: expanded ? "translateY(0)" : "translateY(calc(100% - 60px))",
        transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Drag handle */}
      <div
        className="flex justify-center pt-3 pb-1 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div
          className="w-9 h-1 rounded-full"
          style={{ background: "rgba(255,255,255,0.2)" }}
        />
      </div>

      {/* Peek row */}
      <div className="flex items-center justify-between px-4 pb-3">
        <div className="flex-1 min-w-0">
          {selectedZone ? (
            <>
              <p
                className="text-[14px] font-bold text-white truncate"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {selectedZone.name}
              </p>
              <span
                className="inline-flex items-center gap-1.5 mt-0.5 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase border"
                style={{
                  color,
                  borderColor: `${color}40`,
                  background: `${color}15`,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: color }}
                />
                {RISK_LABELS[selectedZone.risk_level]}
              </span>
            </>
          ) : (
            <>
              <p
                className="text-[14px] font-bold text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                PERIMETER
              </p>
              <p
                className="text-[10px] font-mono"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                Tap globe to select a zone ↑
              </p>
            </>
          )}
        </div>
        <button
          onClick={check}
          className="ml-3 flex items-center gap-2 px-3 py-2 rounded-lg border font-mono font-bold text-[10px] uppercase tracking-wider shrink-0"
          style={{
            borderColor: "#00e87a50",
            background: "rgba(0,232,122,0.12)",
            color: "#00e87a",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#00e87a] animate-pulse" />
          My Risk
        </button>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Tabs */}
          {selectedZone && (
            <div className="flex border-b border-white/10 px-4 shrink-0">
              {(["zone", "news"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className="py-2.5 px-3 text-[10px] font-mono uppercase tracking-wider border-b-2 transition-colors mr-1"
                  style={{
                    borderColor:
                      tab === t ? "rgba(255,255,255,0.55)" : "transparent",
                    color: tab === t ? "#fff" : "rgba(255,255,255,0.38)",
                  }}
                >
                  {t === "zone" ? "Zone Detail" : "Sources"}
                </button>
              ))}
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {selectedZone && tab === "zone" ? (
              <>
                <p
                  className="text-[12px] leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.65)" }}
                >
                  {selectedZone.description}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ["Country", selectedZone.country],
                    ["Radius", `${selectedZone.radius_km} km`],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="rounded-lg p-2.5"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <p
                        className="text-[9px] font-mono uppercase"
                        style={{ color: "rgba(255,255,255,0.32)" }}
                      >
                        {k}
                      </p>
                      <p
                        className="text-[12px] font-bold mt-0.5"
                        style={{
                          color: "rgba(255,255,255,0.78)",
                          fontFamily: "var(--font-display)",
                        }}
                      >
                        {v}
                      </p>
                    </div>
                  ))}
                </div>
                {embassy && (
                  <div
                    className="rounded-xl p-3"
                    style={{
                      background: "rgba(40,80,255,0.08)",
                      border: "1px solid rgba(60,100,255,0.2)",
                    }}
                  >
                    <p
                      className="text-[9px] font-mono uppercase tracking-widest mb-1"
                      style={{ color: "rgba(130,160,255,0.7)" }}
                    >
                      🏛 US Embassy · {embassy.city}
                    </p>
                    <p
                      className="text-[13px] font-bold"
                      style={{ color: "#ff6677" }}
                    >
                      {embassy.emergency}
                    </p>
                  </div>
                )}
                <div
                  className="rounded-lg p-3"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <p
                    className="text-[9px] font-mono leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                  >
                    ⚠ Data last updated March 2025 and may not reflect real-time
                    conditions.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedZone(null);
                    setExpanded(false);
                  }}
                  className="w-full py-2 text-[10px] font-mono uppercase tracking-wider rounded-lg border transition-colors"
                  style={{
                    color: "rgba(255,255,255,0.35)",
                    borderColor: "rgba(255,255,255,0.1)",
                    background: "transparent",
                  }}
                >
                  Clear Selection
                </button>
              </>
            ) : (
              <>
                <p
                  className="text-[9px] font-mono uppercase tracking-widest"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  Trusted Sources
                </p>
                {TRUSTED_NEWS.map((n, i) => (
                  <a
                    key={i}
                    href={n.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 py-2 border-b text-[11px] font-mono"
                    style={{
                      borderColor: "rgba(255,255,255,0.07)",
                      color: "rgba(100,160,255,0.7)",
                    }}
                  >
                    <span className="w-1 h-1 rounded-full bg-blue-400/40 shrink-0" />
                    {n.label} ↗
                  </a>
                ))}
                <p
                  className="text-[9px] font-mono uppercase tracking-widest mt-2"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  Advisories
                </p>
                {ADVISORIES.slice(0, 5).map((a) => (
                  <a
                    key={a.id}
                    href={a.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block py-2.5 border-b"
                    style={{ borderColor: "rgba(255,255,255,0.07)" }}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span
                        className="text-[9px] font-mono font-bold uppercase"
                        style={{ color: RISK_COLORS[a.risk_level] }}
                      >
                        {a.risk_level}
                      </span>
                      <span
                        className="text-[9px] font-mono"
                        style={{ color: "rgba(255,255,255,0.3)" }}
                      >
                        {a.date}
                      </span>
                    </div>
                    <p
                      className="text-[12px] font-bold"
                      style={{
                        color: "rgba(255,255,255,0.75)",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      {a.country}
                    </p>
                    <p
                      className="text-[10px] line-clamp-1"
                      style={{ color: "rgba(255,255,255,0.42)" }}
                    >
                      {a.summary}
                    </p>
                  </a>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
