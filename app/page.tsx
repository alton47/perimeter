"use client";
import dynamic from "next/dynamic";
import { StatusBar } from "@/components/ui/StatusBar";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { RightPanel } from "@/components/panels/RightPanel";
import { BottomSheet } from "@/components/layout/BottomSheet";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { LocationModal } from "@/components/modals/LocationModal";
import { ShareModal } from "@/components/modals/ShareModal";
import { Toast } from "@/components/ui/Toast";
import { useStore } from "@/store";
import { GlobeSkeleton } from "@/components/globe/GlobeScene";

const GlobeScene = dynamic(
  () => import("@/components/globe/GlobeScene").then((m) => m.GlobeScene),
  { ssr: false, loading: () => <GlobeSkeleton /> },
);

export default function HomePage() {
  const { viewMode } = useStore();

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      {/* Globe — full bleed background */}
      <div className="absolute inset-0">
        <GlobeScene />
      </div>

      {/* Chrome */}
      <StatusBar />
      <Header />
      <Sidebar />
      <RightPanel />
      <BottomSheet />
      <Disclaimer />

      {/* Modals */}
      <LocationModal />
      <ShareModal />

      {/* Toasts */}
      <Toast />
    </main>
  );
}
