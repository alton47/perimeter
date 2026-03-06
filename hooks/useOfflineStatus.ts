"use client";
import { useEffect } from "react";
import { useStore } from "@/store";

export function useOfflineStatus() {
  const { setIsOffline } = useStore();
  useEffect(() => {
    const on = () => setIsOffline(false);
    const off = () => setIsOffline(true);
    setIsOffline(!navigator.onLine);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, [setIsOffline]);
}
