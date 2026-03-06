import type { RiskLevel } from "@/types";

export const APP_NAME = "PERIMETER";

export const RISK_COLORS: Record<RiskLevel, string> = {
  SAFE: "#4d9fff",
  GREEN: "#00e87a",
  YELLOW: "#f5a623",
  RED: "#ff4455",
  CRITICAL: "#ff0044",
};

export const RISK_LABELS: Record<RiskLevel, string> = {
  SAFE: "Outside Region — Safe",
  GREEN: "Low Risk",
  YELLOW: "Elevated Caution",
  RED: "High Advisory",
  CRITICAL: "Do Not Travel",
};

export const RISK_HEADLINES: Record<RiskLevel, string> = {
  SAFE: "You're outside any active conflict zones.",
  GREEN: "You are near a monitored zone. Stay aware.",
  YELLOW: "Elevated military activity in your vicinity.",
  RED: "High advisory area. Exercise extreme caution.",
  CRITICAL: "Active conflict zone. Seek immediate safety.",
};

export const RISK_RECOMMENDATIONS: Record<RiskLevel, string> = {
  SAFE: "Your location is outside the Middle East conflict region. You are not near any monitored risk zone. Focus on your daily activities and stay informed through the trusted sources below.",
  GREEN:
    "You are within monitoring range of an active zone. Exercise normal precautions, monitor local news, and note the location of your nearest embassy.",
  YELLOW:
    "You are close to an elevated risk area. Avoid non-essential travel toward conflict zones. Keep emergency contacts ready and monitor official advisories closely.",
  RED: "You are in or near a high advisory zone. Reconsider your presence here. Contact your embassy, follow all official guidance, and prepare an evacuation plan immediately.",
  CRITICAL:
    "You are inside or adjacent to an active conflict zone. Do not travel further. Shelter in place and contact your embassy or consulate immediately.",
};

export const TRUSTED_NEWS = [
  {
    label: "BBC Middle East",
    url: "https://www.bbc.com/news/world/middle_east",
  },
  {
    label: "Reuters Middle East",
    url: "https://www.reuters.com/world/middle-east/",
  },
  { label: "Al Jazeera", url: "https://www.aljazeera.com/where/middle-east/" },
  { label: "AP News — Middle East", url: "https://apnews.com/hub/middle-east" },
  {
    label: "US State Dept Advisories",
    url: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories.html/",
  },
  {
    label: "UN OCHA Situation Reports",
    url: "https://www.unocha.org/middle-east-and-north-africa",
  },
];

export const BUFFER_KM = 100;
