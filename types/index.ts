export type RiskLevel = "low" | "medium" | "high";

export interface Zone {
  id: string;
  name: string;
  riskLevel: RiskLevel;
}

export interface Advisory {
  id: string;
  title: string;
}

export interface Embassy {
  countryCode: string;
  name: string;
}
