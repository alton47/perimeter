"use client";
import { useStore } from "@/store";
import { useCheckLocation } from "@/hooks/useCheckLocation";

export function Header() {
  const {
    viewMode,
    setViewMode,
    sidebarOpen,
    setSidebarOpen,
    setShareModalOpen,
  } = useStore();
  const { check } = useCheckLocation();

  return (
    <header className="fixed top-9 left-0 right-0 z-30 flex items-center justify-between px-3 sm:px-4 py-2 pointer-events-none">
      {/* Left controls */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          title="Toggle sidebar"
          className="p-2 rounded-lg border border-white/15 bg-[#0d1520]/90 backdrop-blur-xl
            text-white/60 hover:text-white hover:border-white/30
            transition-all shadow-lg shadow-black/40"
        >
          <svg width="15" height="12" viewBox="0 0 15 12" fill="none">
            <rect width="15" height="2" rx="1" fill="currentColor" />
            <rect y="5" width="15" height="2" rx="1" fill="currentColor" />
            <rect y="10" width="15" height="2" rx="1" fill="currentColor" />
          </svg>
        </button>

        <div className="flex rounded-lg border border-white/15 overflow-hidden bg-[#0d1520]/90 backdrop-blur-xl shadow-lg shadow-black/40">
          {(["3d", "2d"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setViewMode(m)}
              className={`px-3.5 py-2 text-[10px] font-mono uppercase tracking-widest transition-colors ${
                viewMode === m
                  ? "bg-white/15 text-white font-bold"
                  : "text-white/45 hover:text-white/75"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <button
          onClick={() => setShareModalOpen(true)}
          className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border border-white/15
            bg-[#0d1520]/90 backdrop-blur-xl text-white/55 text-[10px] font-mono uppercase tracking-wider
            hover:text-white hover:border-white/30 transition-all shadow-lg shadow-black/40"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle
              cx="10"
              cy="2"
              r="1.5"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <circle
              cx="10"
              cy="10"
              r="1.5"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <circle
              cx="2"
              cy="6"
              r="1.5"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <line
              x1="3.3"
              y1="5.2"
              x2="8.7"
              y2="2.8"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <line
              x1="3.3"
              y1="6.8"
              x2="8.7"
              y2="9.2"
              stroke="currentColor"
              strokeWidth="1.2"
            />
          </svg>
          Share
        </button>

        <button
          onClick={check}
          className="flex items-center gap-2 px-4 py-2 rounded-lg
            border border-[#00e87a]/50 bg-[#00e87a]/15 backdrop-blur-xl
            text-[#00e87a] text-[10px] font-mono font-bold uppercase tracking-wider
            hover:bg-[#00e87a]/25 hover:border-[#00e87a]/70
            transition-all shadow-lg shadow-black/40 shadow-[#00e87a]/5"
        >
          <span className="w-2 h-2 rounded-full bg-[#00e87a] animate-pulse" />
          <span className="hidden xs:inline">Check Location</span>
          <span className="xs:hidden">My Risk</span>
        </button>
      </div>
    </header>
  );
}
