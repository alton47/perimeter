import type { Metadata, Viewport } from "next";
import { Space_Mono, Syne } from "next/font/google";
import "./globals.css";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Perimeter — Geopolitical Risk Monitor",
  description:
    "Real-time 3D geopolitical risk visualization. Check if your location is near active conflict zones in the Middle East.",
  keywords: [
    "geopolitical",
    "risk",
    "middle east",
    "travel safety",
    "conflict zones",
  ],
  authors: [{ name: "Perimeter" }],
  // No manifest / no apple-mobile-web-app-capable — fixes console warnings

  openGraph: {
    title: "Perimeter — Geopolitical Risk Monitor",
    description:
      "Check if your location is safe. Real-time Middle East conflict zone awareness.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#080c14",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceMono.variable} ${syne.variable}`}>
      <body className="bg-[#080c14] text-white overflow-hidden antialiased">
        {children}
      </body>
    </html>
  );
}
