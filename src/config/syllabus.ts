export type ConceptCategory = "Fact" | "Dimension" | string;

export interface Concept {
  id: string;
  name: string;
  category: ConceptCategory;
}

export interface LevelConfig {
  id: string;
  title: string;
  description: string;
  uiType: "drag_and_drop" | string;
  concepts: Concept[];
  passingThreshold: number; // e.g. 1.0 for 100%
  categories: ConceptCategory[];
}

export const LEVEL_1_CONFIG: LevelConfig = {
  id: "level_1_core",
  title: "Level 1: The Atomic Core",
  description: "Drag the concepts into the correct category: Fact or Dimension.",
  uiType: "drag_and_drop",
  passingThreshold: 1.0,
  categories: ["Fact", "Dimension"],
  concepts: [
    { id: "c1", name: "Sales Amount", category: "Fact" },
    { id: "c2", name: "Customer Name", category: "Dimension" },
    { id: "c3", name: "Transaction Date", category: "Dimension" },
    { id: "c4", name: "Discount Applied", category: "Fact" },
    { id: "c5", name: "Store Location", category: "Dimension" }
  ]
};
