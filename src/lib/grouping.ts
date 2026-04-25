import { categories } from "../data/categories";
import type { Category, Statistic } from "../types/statistic";

const highlightIds = [
  "people-born",
  "internet-searches",
  "flights-taking-off",
  "co2-emitted",
];

export function getFeaturedStatistic(statistics: Statistic[]): Statistic | null {
  return (
    statistics.find((statistic) => statistic.id === "people-born") ??
    statistics.find((statistic) => statistic.dataMode === "live") ??
    statistics[0] ??
    null
  );
}

export function getHighlightStatistics(statistics: Statistic[], limit = 4): Statistic[] {
  const curated = highlightIds
    .map((id) => statistics.find((statistic) => statistic.id === id))
    .filter((statistic): statistic is Statistic => Boolean(statistic));

  if (curated.length >= limit) {
    return curated.slice(0, limit);
  }

  const fallback = statistics
    .filter((statistic) => !curated.some((item) => item.id === statistic.id))
    .sort((a, b) => b.yearlyEstimate - a.yearlyEstimate);

  return [...curated, ...fallback].slice(0, limit);
}

export function groupStatisticsByCategory(
  statistics: Statistic[],
  limitPerCategory = 6,
): Array<{ category: Category; statistics: Statistic[]; total: number }> {
  return categories
    .map((category) => {
      const categoryStats = statistics.filter((statistic) => statistic.category === category);

      return {
        category,
        statistics: categoryStats.slice(0, limitPerCategory),
        total: categoryStats.length,
      };
    })
    .filter((group) => group.statistics.length > 0);
}
