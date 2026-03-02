export type ViewMode = "map" | "globe";

export interface SentinelState {
  viewMode: ViewMode;
}

export const sentinelStore: SentinelState = {
  viewMode: "map",
};
