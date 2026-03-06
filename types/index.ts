export type RiskLevel = "SAFE" | "GREEN" | "YELLOW" | "RED" | "CRITICAL";

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Zone {
  id: string;
  name: string;
  center: Coordinates;
  radius_km: number;
  risk_level: RiskLevel;
  description: string;
  source_links: { label: string; url: string }[];
  last_updated: string;
  country: string;
  region: string;
  active: boolean;
}

export interface RiskResult {
  risk_level: RiskLevel;
  is_outside_region: boolean;
  continent: string;
  nearest_zone: Zone | null;
  distance_km: number;
  inside_zone: boolean;
  headline: string;
  recommendation: string;
  user_coordinates: Coordinates;
  news_links: { label: string; url: string }[];
  timestamp: string;
}
