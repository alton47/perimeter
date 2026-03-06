"use client";
import { useCallback } from "react";
import { useStore } from "@/store";
import { calculateRisk } from "@/lib/risk-engine";
import { ZONES } from "@/data/zones";

export function useCheckLocation() {
  const {
    setRiskResult,
    setIsCheckingRisk,
    setLocationError,
    setLocationModalOpen,
    showToast,
    setGlobePaused,
  } = useStore();

  const check = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      setLocationModalOpen(true);
      return;
    }
    setIsCheckingRisk(true);
    setLocationModalOpen(true);
    setLocationError(null);
    setRiskResult(null);
    setGlobePaused(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        const result = calculateRisk(coords, ZONES);
        setRiskResult(result);
        setIsCheckingRisk(false);
        try {
          localStorage.setItem("perimeter:last_risk", JSON.stringify(result));
        } catch {}
        showToast(
          `Risk level: ${result.risk_level}`,
          result.risk_level === "SAFE" || result.risk_level === "GREEN"
            ? "success"
            : "warning",
        );
      },
      (err) => {
        setIsCheckingRisk(false);
        setGlobePaused(false);
        const msgs: Record<number, string> = {
          1: "Location permission denied. Please allow access in browser settings.",
          2: "Location unavailable. Please try again.",
          3: "Location request timed out. Please try again.",
        };
        setLocationError(
          msgs[err.code] ?? "Could not determine your location.",
        );
        showToast("Location access failed", "warning");
      },
      { timeout: 12000, maximumAge: 60000, enableHighAccuracy: true },
    );
  }, [
    setRiskResult,
    setIsCheckingRisk,
    setLocationError,
    setLocationModalOpen,
    showToast,
    setGlobePaused,
  ]);

  return { check };
}
