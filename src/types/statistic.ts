export type Category =
  | "Life"
  | "Travel"
  | "Work"
  | "Technology"
  | "Money"
  | "Environment"
  | "Society"
  | "Health"
  | "Education"
  | "Internet"
  | "Food"
  | "Fun"
  | "Events";

export type Confidence = "high" | "medium" | "low";

export type DataMode = "live" | "semi-live" | "estimated";

export type Sensitivity = "Normal" | "Sensitive";

export type TimeScale = "second" | "minute" | "hour" | "day" | "year";

export type CountryCode = "global" | "sweden" | "vietnam" | "united-states" | "japan";

export type DashboardTab = "All" | Category;

export type ConfidenceFilter = "all" | Confidence;

export type DataModeFilter = "all" | DataMode;

export interface ConfidenceInterval {
  low: number;   // yearly low estimate
  high: number;  // yearly high estimate
}

export interface HistoricalChange {
  yearsAgo: number;
  percentChange: number; // positive = grew, negative = shrank
  label: string; // e.g. "10 years ago"
}

export interface Statistic {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  shortDescription: string;
  category: Category;
  icon: string;
  yearlyEstimate: number;
  unit: string;
  sourceName: string;
  sourceUrl?: string;
  sourceYear?: number; // e.g. 2023 — shown as "Based on 2023 data"
  confidence: Confidence;
  dataMode: DataMode;
  sensitivity: Sensitivity;
  methodology: string;
  tags: string[];
  isFuzzyEstimate: boolean;
  sinceOpenedLabel: string;
  isStatic?: boolean;
  contextNote?: string;
  confidenceInterval?: ConfidenceInterval;
  historicalChange?: HistoricalChange;
  comparisonIds?: string[]; // IDs of stats to compare against
  surpriseFact?: string;    // "Most people guess X but it's actually Y"
}

export interface CountryOption {
  code: CountryCode;
  name: string;
}

export interface CountryDataset {
  code: CountryCode;
  name: string;
  status: "available" | "coming-soon";
  statistics: Statistic[];
}

// Favorites / My World
export interface UserPreferences {
  favorites: string[];      // stat IDs
  myWorldIds: string[];     // up to 10 stat IDs for "My World" mode
  birthYear: number | null; // for "Since I was born" mode
}
