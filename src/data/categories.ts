import type {
  Category,
  ConfidenceFilter,
  DashboardTab,
  DataModeFilter,
} from "../types/statistic";

export const categories: Category[] = [
  "Life",
  "Travel",
  "Work",
  "Technology",
  "Money",
  "Environment",
  "Society",
  "Fun",
  "Events",
];

export const dashboardTabs: DashboardTab[] = ["All", ...categories];

export const confidenceFilters: ConfidenceFilter[] = ["all", "high", "medium", "low"];

export const dataModeFilters: DataModeFilter[] = [
  "all",
  "live",
  "semi-live",
  "estimated",
];
