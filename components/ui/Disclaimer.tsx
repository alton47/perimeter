export function Disclaimer() {
  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none hidden lg:block w-full max-w-xl px-6">
      <p
        className="text-center text-[9px] font-mono leading-relaxed"
        style={{ color: "rgba(255,255,255,0.22)" }}
      >
        PERIMETER visualizes publicly available geopolitical data for
        informational purposes only. Zone boundaries are approximate. This
        platform does not predict events or provide military intelligence. Data:
        US State Dept, UN OCHA · Last updated March 2025
      </p>
    </div>
  );
}
