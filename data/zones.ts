import type { Zone } from "@/types";

export const ZONES: Zone[] = [
  {
    id: "z01",
    name: "Gaza Strip",
    center: { lat: 31.35, lng: 34.31 },
    radius_km: 45,
    risk_level: "CRITICAL",
    description:
      "Active large-scale military operations. Civilian infrastructure severely damaged. International aid access restricted. All civilian travel prohibited.",
    source_links: [
      {
        label: "US State Dept — Gaza",
        url: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/israel-west-bank-and-gaza-travel-advisory.html",
      },
      {
        label: "UN OCHA Gaza",
        url: "https://www.unocha.org/publications/report/occupied-palestinian-territory/humanitarian-situation-update",
      },
    ],
    last_updated: "2025-03-01T00:00:00Z",
    country: "Palestinian Territories",
    region: "Levant",
    active: true,
  },
  {
    id: "z02",
    name: "Southern Lebanon",
    center: { lat: 33.2, lng: 35.55 },
    radius_km: 65,
    risk_level: "RED",
    description:
      "Ongoing cross-border military exchanges. Significant civilian displacement. US Embassy advises against all travel south of Litani River.",
    source_links: [
      {
        label: "US State Dept — Lebanon",
        url: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/lebanon-travel-advisory.html",
      },
    ],
    last_updated: "2025-03-01T00:00:00Z",
    country: "Lebanon",
    region: "Levant",
    active: true,
  },
  {
    id: "z03",
    name: "Northern Syria",
    center: { lat: 36.3, lng: 37.3 },
    radius_km: 140,
    risk_level: "CRITICAL",
    description:
      "Multiple armed factions control separate territories. Ongoing airstrikes. No consular access. Zero safe civilian passage.",
    source_links: [
      {
        label: "US State Dept — Syria",
        url: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/syria-travel-advisory.html",
      },
      { label: "UN Syria Crisis", url: "https://www.unocha.org/syria" },
    ],
    last_updated: "2025-03-01T00:00:00Z",
    country: "Syria",
    region: "Levant",
    active: true,
  },
  {
    id: "z04",
    name: "Eastern Syria",
    center: { lat: 35.1, lng: 40.1 },
    radius_km: 160,
    risk_level: "CRITICAL",
    description:
      "Residual ISIS insurgency. Active coalition counterterrorism operations. No civilian safety guarantees. Remote and inaccessible terrain.",
    source_links: [
      {
        label: "US State Dept — Syria",
        url: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/syria-travel-advisory.html",
      },
    ],
    last_updated: "2025-03-01T00:00:00Z",
    country: "Syria",
    region: "Levant",
    active: true,
  },
  {
    id: "z05",
    name: "Western Iraq (Anbar)",
    center: { lat: 33.4, lng: 42.5 },
    radius_km: 140,
    risk_level: "RED",
    description:
      "Intermittent insurgency incidents. Limited government control in remote areas. Tribal conflict ongoing. US Embassy advises do not travel.",
    source_links: [
      {
        label: "US State Dept — Iraq",
        url: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/iraq-travel-advisory.html",
      },
    ],
    last_updated: "2025-03-01T00:00:00Z",
    country: "Iraq",
    region: "Mesopotamia",
    active: true,
  },
  {
    id: "z06",
    name: "Yemen (North)",
    center: { lat: 15.4, lng: 44.2 },
    radius_km: 220,
    risk_level: "CRITICAL",
    description:
      "Active civil war. Coalition airstrikes and Houthi attacks ongoing. Humanitarian catastrophe. Embassy suspended. No safe travel possible.",
    source_links: [
      {
        label: "US State Dept — Yemen",
        url: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/yemen-travel-advisory.html",
      },
      { label: "UN Yemen", url: "https://www.unocha.org/yemen" },
    ],
    last_updated: "2025-03-01T00:00:00Z",
    country: "Yemen",
    region: "Arabian Peninsula",
    active: true,
  },
  {
    id: "z07",
    name: "Strait of Hormuz",
    center: { lat: 26.6, lng: 56.3 },
    radius_km: 90,
    risk_level: "YELLOW",
    description:
      "Strategic shipping chokepoint. Naval tensions between US, Iran and Gulf states. Vessel seizures reported.",
    source_links: [
      { label: "Reuters", url: "https://www.reuters.com/world/middle-east/" },
    ],
    last_updated: "2025-03-01T00:00:00Z",
    country: "International Waters",
    region: "Persian Gulf",
    active: true,
  },
  {
    id: "z08",
    name: "Iranian Border Region",
    center: { lat: 34.8, lng: 45.5 },
    radius_km: 110,
    risk_level: "YELLOW",
    description:
      "IRGC cross-border operations against Kurdish groups in Iraq. Intermittent missile and drone strikes. Avoid all border areas.",
    source_links: [
      {
        label: "US State Dept — Iran",
        url: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/iran-travel-advisory.html",
      },
    ],
    last_updated: "2025-03-01T00:00:00Z",
    country: "Iran / Iraq",
    region: "Kurdistan",
    active: true,
  },
  {
    id: "z09",
    name: "North Sinai",
    center: { lat: 30.9, lng: 33.8 },
    radius_km: 95,
    risk_level: "RED",
    description:
      "Egyptian military counterinsurgency operations ongoing. ISIS-affiliated activity. Egyptian government restricts all civilian access.",
    source_links: [
      {
        label: "US State Dept — Egypt",
        url: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/egypt-travel-advisory.html",
      },
    ],
    last_updated: "2025-03-01T00:00:00Z",
    country: "Egypt",
    region: "North Africa",
    active: true,
  },
  {
    id: "z10",
    name: "Kurdish-Turkish Border",
    center: { lat: 37.2, lng: 43.3 },
    radius_km: 85,
    risk_level: "YELLOW",
    description:
      "Turkish Armed Forces conducting operations against PKK. Cross-border drone and artillery strikes reported.",
    source_links: [
      { label: "Reuters", url: "https://www.reuters.com/world/middle-east/" },
    ],
    last_updated: "2025-03-01T00:00:00Z",
    country: "Turkey / Iraq / Syria",
    region: "Southeast Turkey",
    active: true,
  },
  {
    id: "z11",
    name: "Red Sea (Houthi Zone)",
    center: { lat: 15.0, lng: 42.5 },
    radius_km: 250,
    risk_level: "RED",
    description:
      "Houthi anti-ship missile and drone attacks on commercial vessels. US and allied navies conducting strikes. All commercial shipping severely disrupted.",
    source_links: [
      {
        label: "AP News — Red Sea",
        url: "https://apnews.com/hub/houthi-rebels",
      },
    ],
    last_updated: "2025-03-01T00:00:00Z",
    country: "International Waters",
    region: "Red Sea",
    active: true,
  },
  {
    id: "z12",
    name: "West Bank",
    center: { lat: 32.0, lng: 35.25 },
    radius_km: 60,
    risk_level: "RED",
    description:
      "Elevated military operations and settler violence. Multiple cities under periodic military lockdown. Reconsider all non-essential travel.",
    source_links: [
      {
        label: "US State Dept — West Bank",
        url: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/israel-west-bank-and-gaza-travel-advisory.html",
      },
    ],
    last_updated: "2025-03-01T00:00:00Z",
    country: "Palestinian Territories",
    region: "Levant",
    active: true,
  },
];

export const ADVISORIES = [
  {
    id: "a01",
    country: "Gaza / Israel",
    risk_level: "CRITICAL" as const,
    summary:
      "Do not travel to Gaza. Reconsider travel to Israel and West Bank due to terrorism and armed conflict.",
    source: "US State Dept",
    link: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/israel-west-bank-and-gaza-travel-advisory.html",
    date: "Jan 15 2025",
  },
  {
    id: "a02",
    country: "Lebanon",
    risk_level: "CRITICAL" as const,
    summary:
      "Do not travel. Crime, terrorism, armed conflict, civil unrest, risk of kidnapping.",
    source: "US State Dept",
    link: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/lebanon-travel-advisory.html",
    date: "Jan 10 2025",
  },
  {
    id: "a03",
    country: "Syria",
    risk_level: "CRITICAL" as const,
    summary:
      "Do not travel. Terrorism, civil unrest, kidnapping, armed conflict, arbitrary detention.",
    source: "US State Dept",
    link: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/syria-travel-advisory.html",
    date: "Jan 8 2025",
  },
  {
    id: "a04",
    country: "Yemen",
    risk_level: "CRITICAL" as const,
    summary:
      "Do not travel. Terrorism, civil unrest, health risks, armed conflict, kidnapping.",
    source: "US State Dept",
    link: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/yemen-travel-advisory.html",
    date: "Jan 5 2025",
  },
  {
    id: "a05",
    country: "Iraq",
    risk_level: "CRITICAL" as const,
    summary:
      "Do not travel. Terrorism, kidnapping, and armed conflict throughout the country.",
    source: "US State Dept",
    link: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/iraq-travel-advisory.html",
    date: "Jan 3 2025",
  },
  {
    id: "a06",
    country: "Iran",
    risk_level: "CRITICAL" as const,
    summary:
      "Do not travel. Risk of arbitrary arrest and detention of foreign nationals.",
    source: "US State Dept",
    link: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/iran-travel-advisory.html",
    date: "Jan 2 2025",
  },
  {
    id: "a07",
    country: "Egypt",
    risk_level: "YELLOW" as const,
    summary:
      "Exercise increased caution. Terrorism. North Sinai province: Do Not Travel.",
    source: "US State Dept",
    link: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/egypt-travel-advisory.html",
    date: "Dec 20 2024",
  },
  {
    id: "a08",
    country: "Jordan",
    risk_level: "YELLOW" as const,
    summary:
      "Exercise increased caution. Terrorism. Some border areas have increased risk.",
    source: "US State Dept",
    link: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/jordan-travel-advisory.html",
    date: "Dec 18 2024",
  },
  {
    id: "a09",
    country: "Saudi Arabia",
    risk_level: "YELLOW" as const,
    summary:
      "Exercise increased caution. Terrorism and missile/drone attacks from Yemen.",
    source: "US State Dept",
    link: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/saudi-arabia-travel-advisory.html",
    date: "Dec 15 2024",
  },
  {
    id: "a10",
    country: "Turkey",
    risk_level: "YELLOW" as const,
    summary:
      "Exercise increased caution. Terrorism. Southeast Turkey near Syrian border: Reconsider Travel.",
    source: "US State Dept",
    link: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/turkey-travel-advisory.html",
    date: "Dec 10 2024",
  },
];
