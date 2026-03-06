# PERIMETER — Geopolitical Risk Monitor

> A real-time 3D geopolitical risk visualization platform for travelers, journalists, and curious people. Check whether your location is near active conflict zones in the Middle East — directly in your browser. Zero backend. Zero database. Zero tracking.

![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?style=flat-square&logo=typescript)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![Three.js](https://img.shields.io/badge/Three.js-3D%20Globe-black?style=flat-square&logo=three.js)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## What It Does

Perimeter renders a fully interactive 3D globe with conflict zones, continent outlines, and animated risk indicators. When a user clicks **Check Location**, the browser Geolocation API determines their coordinates. A pure-client Haversine distance engine computes proximity to all active zones and returns a risk level, distance, recommendation, embassy contacts, and trusted first-party news links — **no server round-trip**.

If you're outside the Middle East entirely, Perimeter tells you plainly: **you're safe in [your continent] — focus on your day.** The globe pauses rotation and pins your location in blue so you can see exactly where you are on the 3D map.

**Data accuracy notice:** Zone boundaries are sourced from US State Department advisories, UN OCHA reports, and public conflict data. They represent approximate risk areas updated manually in March 2025. Always cross-reference with official advisories before travel decisions.

---

## Architecture

```
Pure frontend — no database, no backend, no auth, no API keys required
├── Risk engine:    lib/risk-engine.ts  — Haversine + bounding box + continent detection
├── Zone data:      data/zones.ts       — 12 zones, 10 advisories, embassy contacts (static TS)
├── 3D Globe:       Three.js via @react-three/fiber — lazy-loaded, SSR disabled
├── Globe features: Continent outlines, Middle East amber highlight, user location marker
│                   Zone rings/halos/pillars per risk level, arc lines, particle field
├── State:          Zustand — viewMode, selectedZone, riskResult, globePaused, modals, toast
└── Responsive:     Full desktop sidebars + mobile swipe bottom sheet
```

---

## Console Errors Fixed

| Error | Fix Applied |
|---|---|
| `apple-mobile-web-app-capable deprecated` | Removed next-pwa entirely; no manifest/PWA meta generated |
| `icon-192.png 404` | Removed manifest reference from layout.tsx metadata |
| Globe never stops rotating | `globePaused` state; `autoRotate={!globePaused}`; pauses on zone select AND location check |
| Dark globe invisible | `ambientLight intensity={1.1}`, bright emissive `#0a1e30`, directional lights at 1.2 intensity |
| Sidebar text too dark | All text colors raised to `rgba(255,255,255,0.55–0.85)` minimum |

---

## Tech Stack

| Layer         | Technology                    | Why                                            |
|---------------|-------------------------------|------------------------------------------------|
| Framework     | Next.js 14 (App Router)       | SSR for layout, client components for 3D/geo   |
| Language      | TypeScript (strict)           | Type safety across zone data, risk results     |
| 3D Rendering  | Three.js + @react-three/fiber | WebGL globe with React integration             |
| 3D Helpers    | @react-three/drei             | OrbitControls, Stars, Html overlays            |
| Styling       | Tailwind CSS v3               | Utility-first, responsive, no runtime overhead |
| State         | Zustand                       | Flat store, no reducers, zero boilerplate      |
| Fonts         | Space Mono + Syne             | Tactical mono + bold display — distinct pair   |

---

## Project Structure

```
perimeter/
├── app/
│   ├── layout.tsx                # Root — fonts, metadata, NO PWA meta (fixes console errors)
│   ├── page.tsx                  # Main — lazy globe + all panels + skeleton loader
│   └── globals.css               # Tailwind + keyframes: radar-spin, p-ring, fadeUp, shimmer
│
├── components/
│   ├── globe/GlobeScene.tsx      # 3D scene: brighter Earth, continent outlines, Middle East
│   │                             #   amber highlight, zone rings/halos/pillars, arc lines,
│   │                             #   user location marker with "YOU · Continent" label,
│   │                             #   particle field, GlobeSkeleton loader
│   ├── layout/
│   │   ├── Header.tsx            # Top nav: sidebar toggle, 2D/3D, share, check location
│   │   ├── Sidebar.tsx           # Left: zone list with high-contrast text, filters, advisories
│   │   └── BottomSheet.tsx       # Mobile swipe-up: zone detail + news tabs
│   ├── modals/
│   │   ├── LocationModal.tsx     # Risk result: radar loader, pulse ring, continent messaging
│   │   └── ShareModal.tsx        # Share: copy link, tweet, whatsapp
│   ├── panels/
│   │   └── RightPanel.tsx        # Desktop right: zone detail, embassy emergency line
│   └── ui/
│       ├── StatusBar.tsx         # Top bar: brand, UTC, offline, pause/resume globe button
│       ├── Disclaimer.tsx        # Data accuracy footer
│       └── Toast.tsx             # Toast notifications
│
├── data/zones.ts                 # 12 zones, 10 advisories, 9 embassies — all static TypeScript
├── hooks/
│   ├── useCheckLocation.ts       # Geolocation → risk engine → store → globe pause
│   └── useOfflineStatus.ts       # online/offline listeners
├── lib/
│   ├── constants.ts              # RISK_COLORS (bright), RISK_LABELS, RISK_RECOMMENDATIONS
│   ├── risk-engine.ts            # Haversine + bounding box + continent detection
│   └── utils.ts                  # cn(), formatDist(), fmtTime()
├── store/index.ts                # Zustand: all state incl. globePaused
├── types/index.ts                # Zone, RiskResult, Coordinates, RiskLevel
└── public/                       # No icons — no 404 errors
```

---

## Getting Started

### Prerequisites
- Node.js 18+ or 20+
- pnpm (recommended), npm, or yarn

### Install & Run

```bash
# 1. Install all dependencies (19 total)
pnpm add next react react-dom @react-three/fiber @react-three/drei three zustand clsx tailwind-merge
pnpm add -D @types/node @types/react @types/react-dom @types/three typescript tailwindcss postcss autoprefixer eslint eslint-config-next

# 2. Start dev server
pnpm dev
# → http://localhost:3000
```

No `.env` file. No API keys. No database. Just run.

### Production Build

```bash
pnpm build && pnpm start
```

### Deploy to Vercel

```bash
npx vercel --prod
```

Zero configuration. Vercel auto-detects Next.js.

---

## Dependencies

### Production (10)

| Package              | Purpose                                 |
|----------------------|-----------------------------------------|
| `next`               | React framework, App Router, SSR        |
| `react`              | UI library                              |
| `react-dom`          | DOM renderer                            |
| `@react-three/fiber` | React renderer for Three.js             |
| `@react-three/drei`  | OrbitControls, Stars, Html overlays     |
| `three`              | 3D WebGL engine                         |
| `zustand`            | Global state management                 |
| `clsx`               | Conditional class names                 |
| `tailwind-merge`     | Safe Tailwind class merging             |

### Dev (9)

| Package              | Purpose                                 |
|----------------------|-----------------------------------------|
| `@types/node`        | Node.js types                           |
| `@types/react`       | React types                             |
| `@types/react-dom`   | ReactDOM types                          |
| `@types/three`       | Three.js types                          |
| `typescript`         | Compiler                                |
| `tailwindcss`        | CSS framework                           |
| `postcss`            | CSS pipeline                            |
| `autoprefixer`       | Vendor prefixes                         |
| `eslint` + config    | Linting                                 |

**Total: 19 dependencies**

### One-liner install

```bash
pnpm add next react react-dom @react-three/fiber @react-three/drei three zustand clsx tailwind-merge && pnpm add -D @types/node @types/react @types/react-dom @types/three typescript tailwindcss postcss autoprefixer eslint eslint-config-next
```

---

## Risk Engine Logic

```
User clicks "Check Location"
  → navigator.geolocation.getCurrentPosition()
  → Globe rotation PAUSES, user pin appears in blue with "YOU · [Continent]" label
  → detectContinent(lat, lng) — bounding box regions
  → isMiddleEast(lat, lng)?
      NO  → SAFE — "You're safe in [Europe/Asia/North America/etc]"
            Show continent name, recommend staying informed, show news links
      YES → For each active zone, compute Haversine distance to zone center
          → Find nearest zone
          → Inside zone radius?      → zone.risk_level (CRITICAL/RED/YELLOW/GREEN)
          → Within 100km buffer?     → one level below zone.risk_level
          → Farther away?            → GREEN
  → Show LocationModal with pulsing ring, distance, recommendation, embassy, news links
```

---

## Globe Features

| Feature | Implementation |
|---|---|
| Bright visible ocean | `ambientLight intensity={1.1}` + `emissiveIntensity={0.6}` on Earth mesh |
| Continent outlines | Simplified lat/lng polylines for Arabia, Levant, Iraq/Iran, Turkey, Egypt, Horn |
| Middle East highlight | Amber dot grid over lat 13–40°N, lng 27–63°E at low opacity |
| Zone rings | `ringGeometry` + animated scale/opacity pulse per zone |
| Zone pillars | Cylinders rising from zone center, height scales with risk level |
| Arc lines | Animated `QuadraticBezierCurve3` between CRITICAL/RED zones with moving dot |
| User marker | Blue pulsing rings + core sphere + HTML label "YOU · [Continent]" |
| Globe pause | `autoRotate={!globePaused}` — pauses on zone select or location check |
| Pause/Resume button | StatusBar button — also resets on modal close |

---

## Responsive Design

| Breakpoint | Layout |
|---|---|
| Mobile `< 1024px` | Globe full-screen · swipe-up bottom sheet · no sidebars |
| Desktop `≥ 1024px` | Left sidebar (zones + advisories) · right panel (zone detail + embassy) |

---

## Data Sources

| Source | URL |
|---|---|
| US State Department | https://travel.state.gov/traveladvisories |
| United Nations OCHA | https://www.unocha.org |
| BBC Middle East | https://www.bbc.com/news/world/middle_east |
| Reuters Middle East | https://www.reuters.com/world/middle-east/ |
| Al Jazeera | https://www.aljazeera.com/where/middle-east/ |
| AP News | https://apnews.com/hub/middle-east |

All zone boundaries are **approximations** from public sources. Last updated March 2025.

---

## Adding a Zone

Edit `data/zones.ts` — no migrations, no API:

```typescript
{
  id: 'z-013',
  name: 'Your Zone Name',
  center: { lat: 33.5, lng: 36.0 },
  radius_km: 80,
  risk_level: 'RED',
  description: 'Situation description.',
  source_links: [{ label: 'Source', url: 'https://...' }],
  last_updated: '2025-03-01T00:00:00Z',
  country: 'Country',
  region: 'Region',
  active: true,
}
```

---

## Ethics & Privacy

- Uses **only publicly available** government and UN data
- Does **not** predict military events
- Does **not** collect, store, or transmit user location (all processing is client-side, in-browser)
- Does **not** have a backend, database, or analytics
- Zone data may be outdated — never use as the sole basis for safety decisions

---

## Commit History

```bash
git init && git add .

git commit -m "chore(init): scaffold Next.js 14 + TypeScript strict + Tailwind + Space Mono/Syne fonts — no PWA (eliminates apple-mobile-web-app-capable console warning)"

git commit -m "feat(types+constants): domain types Zone/RiskResult/RiskLevel, bright RISK_COLORS (#00e87a #f5a623 #ff4455 #ff0044), full RISK_RECOMMENDATIONS per level"

git commit -m "feat(engine): pure-client Haversine risk calculator — bounding box Middle East detection, 100km buffer zone downgrade, detectContinent() for 9 world regions, zero API calls"

git commit -m "data(zones): 12 conflict zones (Gaza/Lebanon/Syria x2/Iraq/Yemen/Hormuz/Iran/Sinai/Turkey/RedSea/WestBank) + 10 US State Dept advisories + 8 embassy emergency contacts — all static TypeScript"

git commit -m "feat(store): Zustand — globePaused state (autoRotate controlled), setSelectedZone pauses globe, location check pauses globe, pause/resume button in StatusBar"

git commit -m "feat(globe): Three.js scene — ambientLight 1.1 + directional 1.2 for visible bright ocean; GlobeGrid; ContinentLines (polylines for Arabia/Levant/Iraq-Iran/Turkey/Egypt/Horn); MiddleEastHighlight (amber dot grid); ZoneVisual (ring+halo+pillar+core dot, vivid colors); ZoneLabel (HTML overlay, clickable); RiskArc (animated bezier+dot between CRITICAL/RED zones); UserMarker (blue pulse rings + 'YOU · Continent' label); GlobeSkeleton (animated rings shimmer loader)"

git commit -m "feat(ui): StatusBar with pause/resume globe, offline indicator, UTC; Header high-contrast; Sidebar all text rgba(255,255,255,0.55-0.85) minimum; RightPanel skeleton + readable zone detail + embassy emergency line; LocationModal continent messaging ('You\'re safe in Europe') + radar loader + pulse ring; BottomSheet mobile swipe tabs; ShareModal copy/tweet/whatsapp; Toast; Disclaimer"

git commit -m "fix(console): remove next-pwa + manifest from layout.tsx — eliminates 404 icon-192.png error and apple-mobile-web-app-capable deprecation warning entirely"

git commit -m "docs(readme): architecture diagram, all console fixes documented, full dep table, globe features table, risk engine flowchart, zone update guide, one-liner install command"
```

---

*Built for travelers, journalists, and anyone who wants to understand the world's risk landscape through data — not headlines.*
