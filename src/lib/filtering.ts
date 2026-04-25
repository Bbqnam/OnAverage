import type {
  ConfidenceFilter,
  DataModeFilter,
  DashboardTab,
  Statistic,
} from "../types/statistic";

export interface StatisticFilters {
  searchTerm: string;
  selectedTab: DashboardTab;
  confidence: ConfidenceFilter;
  dataMode: DataModeFilter;
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

export function filterStatistics(
  statistics: Statistic[],
  filters: StatisticFilters,
): Statistic[] {
  const query = normalize(filters.searchTerm);

  return statistics.filter((statistic) => {
    const matchesTab =
      filters.selectedTab === "All" || statistic.category === filters.selectedTab;

    const matchesConfidence =
      filters.confidence === "all" || statistic.confidence === filters.confidence;

    const matchesDataMode =
      filters.dataMode === "all" || statistic.dataMode === filters.dataMode;

    const searchableText = normalize(
      [
        statistic.title,
        statistic.shortTitle,
        statistic.shortDescription,
        statistic.description,
        statistic.category,
        statistic.sourceName,
        ...statistic.tags,
      ].join(" "),
    );

    const matchesSearch = query.length === 0 || searchableText.includes(query);

    return matchesTab && matchesConfidence && matchesDataMode && matchesSearch;
  });
}

export function countFuzzyEstimates(statistics: Statistic[]): number {
  return statistics.filter((statistic) => statistic.isFuzzyEstimate).length;
}
