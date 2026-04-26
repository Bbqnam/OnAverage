export type Category =
  | "Life"
  | "Travel"
  | "Work"
  | "Technology"
  | "Money"
  | "Environment"
  | "Society"
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
  confidence: Confidence;
  dataMode: DataMode;
  sensitivity: Sensitivity;
  methodology: string;
  tags: string[];
  isFuzzyEstimate: boolean;
  sinceOpenedLabel: string;
  isStatic?: boolean;
  contextNote?: string;
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
