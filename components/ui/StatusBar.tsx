"use client";
import { useEffect, useState } from "react";
import { useStore } from "@/store";
import { useOfflineStatus } from "@/hooks/useOfflineStatus";
import { APP_NAME } from "@/lib/constants";

export function StatusBar() {
  const { selectedZone, isOffline, globePaused, setGlobePaused } = useStore();
  const [utc, setUtc] = useState("");
  useOfflineStatus();

  useEffect(() => {
    const tick = () => setUtc(new Date().toUTCString().slice(5, 25) + " UTC");
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-3 sm:px-5 py-2
      bg-[#0a0f1a]/95 backdrop-blur-md border-b border-white/10
      text-[10px] font-mono"
    >
      {/* Left */}
      <div className="flex items-center gap-3 overflow-hidden">
        <span className="text-[#00e87a] font-bold tracking-[0.3em] shrink-0 text-[11px]">
          {APP_NAME}
        </span>
        <span className="hidden sm:block w-px h-3.5 bg-white/15" />
        <span className="hidden sm:block text-white/50 shrink-0">
          GEOPOLITICAL RISK MONITOR
        </span>
        {selectedZone && (
          <>
            <span className="w-px h-3.5 bg-white/15 shrink-0" />
            <span className="text-white/70 truncate">{selectedZone.name}</span>
          </>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Globe pause toggle */}
        <button
          onClick={() => setGlobePaused(!globePaused)}
          className={`hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded border text-[9px] uppercase tracking-wider transition-all ${
            globePaused
              ? "border-[#f5a623]/40 text-[#f5a623] bg-[#f5a623]/10"
              : "border-white/12 text-white/35 hover:text-white/60"
          }`}
        >
          {globePaused ? "▶ Resume" : "⏸ Pause"}
        </button>

        {isOffline && (
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="hidden sm:inline">OFFLINE</span>
          </span>
        )}
        <span className="text-white/40 hidden md:block">{utc}</span>
        <span className="text-white/40 md:hidden">
          {new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}
