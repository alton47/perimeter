import type { Coordinates, Zone, RiskLevel, RiskResult } from "@/types";
import {
  BUFFER_KM,
  RISK_HEADLINES,
  RISK_RECOMMENDATIONS,
  TRUSTED_NEWS,
} from "./constants";

export function haversineKm(a: Coordinates, b: Coordinates): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

export function detectContinent(c: Coordinates): string {
  const { lat, lng } = c;
  if (lat >= 12 && lat <= 42 && lng >= 25 && lng <= 65) return "Middle East";
  if (lat >= 34 && lat <= 72 && lng >= -25 && lng <= 45) return "Europe";
  if (lat >= 15 && lat <= 37 && lng >= -18 && lng <= 52) return "North Africa";
  if (lat >= -35 && lat <= 15 && lng >= -18 && lng <= 52)
    return "Sub-Saharan Africa";
  if (lat >= 5 && lat <= 55 && lng >= 60 && lng <= 150) return "Asia";
  if (lat >= -10 && lat <= 5 && lng >= 95 && lng <= 142)
    return "Southeast Asia";
  if (lat >= 15 && lat <= 72 && lng >= -170 && lng <= -50)
    return "North America";
  if (lat >= -55 && lat <= 15 && lng >= -82 && lng <= -34)
    return "South America";
  if (lat <= -10 && lng >= 110 && lng <= 180) return "Oceania";
  return "your region";
}

function isMiddleEast(c: Coordinates): boolean {
  return c.lat >= 12 && c.lat <= 42 && c.lng >= 25 && c.lng <= 65;
}

const ORDER: RiskLevel[] = ["SAFE", "GREEN", "YELLOW", "RED", "CRITICAL"];
function downgrade(l: RiskLevel): RiskLevel {
  return ORDER[Math.max(1, ORDER.indexOf(l) - 1)];
}

export function calculateRisk(
  userCoords: Coordinates,
  zones: Zone[],
): RiskResult {
  const timestamp = new Date().toISOString();
  const continent = detectContinent(userCoords);
  const active = zones.filter((z) => z.active);

  if (!isMiddleEast(userCoords)) {
    return {
      risk_level: "SAFE",
      is_outside_region: true,
      continent,
      nearest_zone: null,
      distance_km: Infinity,
      inside_zone: false,
      headline: RISK_HEADLINES.SAFE,
      recommendation: RISK_RECOMMENDATIONS.SAFE,
      user_coordinates: userCoords,
      news_links: TRUSTED_NEWS.slice(0, 4),
      timestamp,
    };
  }

  let nearest = active[0],
    minDist = Infinity;
  for (const z of active) {
    const d = haversineKm(userCoords, z.center);
    if (d < minDist) {
      minDist = d;
      nearest = z;
    }
  }

  const insideZone = minDist <= nearest.radius_km;
  const inBuffer = !insideZone && minDist <= nearest.radius_km + BUFFER_KM;
  const risk: RiskLevel = insideZone
    ? nearest.risk_level
    : inBuffer
      ? downgrade(nearest.risk_level)
      : "GREEN";

  return {
    risk_level: risk,
    is_outside_region: false,
    continent,
    nearest_zone: nearest,
    distance_km: Math.round(minDist),
    inside_zone: insideZone,
    headline: RISK_HEADLINES[risk],
    recommendation: RISK_RECOMMENDATIONS[risk],
    user_coordinates: userCoords,
    news_links: [...nearest.source_links, ...TRUSTED_NEWS.slice(0, 3)],
    timestamp,
  };
}
