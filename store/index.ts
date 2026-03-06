import { create } from "zustand";
import type { Zone, RiskResult, RiskLevel } from "@/types";

interface State {
  // Globe
  globePaused: boolean;
  setGlobePaused: (v: boolean) => void;

  // View mode
  viewMode: "3d" | "2d";
  setViewMode: (m: "3d" | "2d") => void;

  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;

  // Selected zone
  selectedZone: Zone | null;
  setSelectedZone: (z: Zone | null) => void;

  // Risk result
  riskResult: RiskResult | null;
  setRiskResult: (r: RiskResult | null) => void;
  isCheckingRisk: boolean;
  setIsCheckingRisk: (v: boolean) => void;
  locationError: string | null;
  setLocationError: (e: string | null) => void;

  // Modals
  locationModalOpen: boolean;
  setLocationModalOpen: (v: boolean) => void;
  shareModalOpen: boolean;
  setShareModalOpen: (v: boolean) => void;

  // Filter
  riskFilter: RiskLevel | "ALL";
  setRiskFilter: (f: RiskLevel | "ALL") => void;

  // Offline
  isOffline: boolean;
  setIsOffline: (v: boolean) => void;

  // Toast
  toast: { message: string; type: "info" | "success" | "warning" } | null;
  showToast: (message: string, type?: "info" | "success" | "warning") => void;
}

export const useStore = create<State>((set) => ({
  globePaused: false,
  setGlobePaused: (v) => set({ globePaused: v }),

  viewMode: "3d",
  setViewMode: (m) => set({ viewMode: m }),

  sidebarOpen: true,
  setSidebarOpen: (v) => set({ sidebarOpen: v }),

  selectedZone: null,
  setSelectedZone: (z) => set({ selectedZone: z, globePaused: z !== null }),

  riskResult: null,
  setRiskResult: (r) => set({ riskResult: r }),
  isCheckingRisk: false,
  setIsCheckingRisk: (v) => set({ isCheckingRisk: v }),
  locationError: null,
  setLocationError: (e) => set({ locationError: e }),

  locationModalOpen: false,
  setLocationModalOpen: (v) => set({ locationModalOpen: v }),
  shareModalOpen: false,
  setShareModalOpen: (v) => set({ shareModalOpen: v }),

  riskFilter: "ALL",
  setRiskFilter: (f) => set({ riskFilter: f }),

  isOffline: false,
  setIsOffline: (v) => set({ isOffline: v }),

  toast: null,
  showToast: (message, type = "info") => {
    set({ toast: { message, type } });
    setTimeout(() => set({ toast: null }), 3200);
  },
}));
