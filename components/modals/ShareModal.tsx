"use client";
import { useState } from "react";
import { useStore } from "@/store";
import { RISK_COLORS, RISK_LABELS, APP_NAME } from "@/lib/constants";
import { formatDist } from "@/lib/utils";

export function ShareModal() {
  const { shareModalOpen, setShareModalOpen, selectedZone, riskResult } =
    useStore();
  const [copied, setCopied] = useState(false);
  if (!shareModalOpen) return null;

  const level = riskResult?.risk_level ?? selectedZone?.risk_level ?? "GREEN";
  const color = RISK_COLORS[level];
  const label = RISK_LABELS[level];
  const target = selectedZone?.name ?? "Middle East Region";
  const date = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }
  function tweet() {
    const t = encodeURIComponent(
      `⚠️ ${label.toUpperCase()} — ${target}\n\nGeopolitical risk check via Perimeter:\n${window.location.href}`,
    );
    window.open(`https://twitter.com/intent/tweet?text=${t}`, "_blank");
  }
  function whatsapp() {
    const m = encodeURIComponent(
      `*PERIMETER RISK MONITOR*\n\n📍 *${target}*\n⚠️ Status: *${label}*\n\n${window.location.href}`,
    );
    window.open(`https://wa.me/?text=${m}`, "_blank");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={() => setShareModalOpen(false)}
    >
      <div className="absolute inset-0 bg-black/78 backdrop-blur-md" />
      <div
        className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: "#0d1520", border: `1px solid ${color}30` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg,transparent,${color}70,transparent)`,
          }}
        />

        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <p
            className="text-[14px] font-bold text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Share Risk Snapshot
          </p>
          <button
            onClick={() => setShareModalOpen(false)}
            className="text-xl leading-none transition-colors hover:text-white"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            ×
          </button>
        </div>

        <div className="p-5">
          {/* Card preview */}
          <div
            className="rounded-xl p-5 text-center mb-5"
            style={{ background: `${color}0a`, border: `1px solid ${color}30` }}
          >
            <p
              className="text-[9px] font-mono uppercase tracking-[0.3em] mb-3"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              {APP_NAME} · RISK MONITOR
            </p>
            <div className="flex justify-center mb-3">
              <span
                className="w-3 h-3 rounded-full"
                style={{ background: color, boxShadow: `0 0 14px ${color}` }}
              />
            </div>
            <p
              className="text-[22px] font-bold mb-1"
              style={{ color, fontFamily: "var(--font-display)" }}
            >
              {label.toUpperCase()}
            </p>
            <p
              className="text-[13px] font-semibold mb-1"
              style={{
                fontFamily: "var(--font-display)",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              {target}
            </p>
            {riskResult && !riskResult.is_outside_region && (
              <p
                className="text-[10px] font-mono"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                {formatDist(riskResult.distance_km)} from nearest zone
              </p>
            )}
            <p
              className="text-[9px] font-mono mt-3"
              style={{ color: "rgba(255,255,255,0.2)" }}
            >
              perimeter.app · {date}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-2">
            <button
              onClick={copyLink}
              className="py-2.5 rounded-lg border text-[10px] font-mono uppercase tracking-wider transition-all"
              style={{
                borderColor: copied
                  ? "rgba(0,232,122,0.45)"
                  : "rgba(255,255,255,0.12)",
                color: copied ? "#00e87a" : "rgba(255,255,255,0.6)",
                background: copied
                  ? "rgba(0,232,122,0.1)"
                  : "rgba(255,255,255,0.04)",
              }}
            >
              {copied ? "✓ Copied" : "🔗 Copy Link"}
            </button>
            <button
              onClick={tweet}
              className="py-2.5 rounded-lg border text-[10px] font-mono uppercase tracking-wider transition-all"
              style={{
                borderColor: "rgba(29,161,242,0.3)",
                color: "rgba(29,161,242,0.8)",
                background: "rgba(29,161,242,0.07)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "rgba(29,161,242,1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(29,161,242,0.8)")
              }
            >
              𝕏 Tweet
            </button>
          </div>
          <button
            onClick={whatsapp}
            className="w-full py-2.5 rounded-lg border text-[10px] font-mono uppercase tracking-wider transition-all"
            style={{
              borderColor: "rgba(37,211,102,0.25)",
              color: "rgba(37,211,102,0.75)",
              background: "rgba(37,211,102,0.07)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "rgba(37,211,102,1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(37,211,102,0.75)")
            }
          >
            WhatsApp
          </button>
          <p
            className="text-[9px] font-mono text-center mt-4"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            Public data only. Not a prediction service.
          </p>
        </div>
      </div>
    </div>
  );
}
