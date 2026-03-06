"use client";
import { useStore } from "@/store";

export function Toast() {
  const { toast } = useStore();
  if (!toast) return null;
  const styles = {
    info: {
      bg: "rgba(13,21,32,0.96)",
      border: "rgba(255,255,255,0.15)",
      color: "rgba(255,255,255,0.8)",
    },
    success: {
      bg: "rgba(0,20,10,0.96)",
      border: "rgba(0,232,122,0.4)",
      color: "#00e87a",
    },
    warning: {
      bg: "rgba(20,12,0,0.96)",
      border: "rgba(245,166,35,0.4)",
      color: "#f5a623",
    },
  };
  const s = styles[toast.type];
  return (
    <div
      className="fixed bottom-20 lg:bottom-8 left-1/2 -translate-x-1/2 z-60 px-6 py-2.5 rounded-full
        text-[11px] font-mono tracking-widest whitespace-nowrap pointer-events-none
        animate-[fadeUp_0.35s_ease-out_both]"
      style={{
        background: s.bg,
        border: `1px solid ${s.border}`,
        color: s.color,
        boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
      }}
    >
      {toast.message}
    </div>
  );
}
