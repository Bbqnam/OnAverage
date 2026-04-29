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

export type SourceTier = "official" | "industry" | "estimated";

export type EstimateType = "natural" | "modern" | "digital" | "tracked";

export type GrowthCurve = "linear" | "exponential" | "disrupted" | "flat";

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
  label: string; // e.g. "2017" or "10 years ago"
}

export interface HistoricalDataPoint {
  year: number;
  value: number; // yearly total in the statistic's base unit
  isEstimated?: boolean;
}

export interface StatisticSource {
  name: string;
  url: string;
}

export interface Statistic {
  id: string;
  label: string;
  title: string;
  shortTitle: string;
  description: string;
  shortDescription: string;
  emoji: string;
  category: Category;
  icon: string;
  ratePerSecond: number;
  yearlyEstimate: number;
  unit: string;
  sourceName: string;
  sourceUrl?: string;
  sourceYear?: number; // e.g. 2023 — shown as "Based on 2023 data"
  source: StatisticSource;
  sourceTier: SourceTier;
  dataLastUpdated: number;
  confidence: Confidence;
  confidenceLevel: Confidence;
  dataMode: DataMode;
  sensitivity: Sensitivity;
  methodology: string;
  tags: string[];
  isFuzzyEstimate: boolean;
  sinceOpenedLabel: string;
  isStatic?: boolean;
  contextNote?: string;
  confidenceInterval?: ConfidenceInterval;
  confidenceRange?: { min: number; max: number };
  historicalChange?: HistoricalChange;
  historicalData?: HistoricalDataPoint[];
  startYear: number;
  estimateType: EstimateType;
  growthCurve: GrowthCurve;
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
