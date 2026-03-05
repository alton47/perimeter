export type ViewMode = "map" | "globe";

export interface PerimeterState {
  viewMode: ViewMode;
}

export const perimeterStore: PerimeterState = {
  viewMode: "map",
};
