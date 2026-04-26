import type { Statistic } from "../types/statistic";
import { getHistoricalChange } from "./historical";

export type SinceOpenedMode = "mixed" | "live";

const sinceOpenedMixedIds = [
  "people-born",
  "flights-taking-off",
  "internet-searches",
  "ai-prompts-asked",
  "card-payments-made",
  "coffee-consumed",
];

const trendingIds = [
  "internet-searches",
  "messages-sent",
  "ai-prompts-asked",
  "crypto-trades",
  "earthquakes-detected",
  "news-articles-published",
  "people-scrolling-phones",
  "videos-watched",
  "card-payments-made",
  "storms-active",
  "pizzas-eaten",
  "co2-emitted",
];

export const mainFeaturedStatisticId = "asteroids-passing-earth";

export const supportingFeaturedStatisticIds = [
  "lightning-strikes",
  "satellites-orbiting-earth",
  "houses-built",
  "cars-passing-inspection",
];

export const featuredStatisticIds = [
  mainFeaturedStatisticId,
  ...supportingFeaturedStatisticIds,
];

function byId(statistics: Statistic[], ids: string[]): Statistic[] {
  return ids
    .map((id) => statistics.find((statistic) => statistic.id === id))
    .filter((statistic): statistic is Statistic => Boolean(statistic));
}

function uniqueStats(stats: Statistic[]): Statistic[] {
  return stats.filter(
    (statistic, index, array) =>
      array.findIndex((item) => item.id === statistic.id) === index,
  );
}

function rotate<T>(items: T[], seed: number): T[] {
  if (items.length === 0) {
    return [];
  }

  const start = seed % items.length;

  return [...items.slice(start), ...items.slice(0, start)];
}

export function getSinceOpenedHighlights(
  statistics: Statistic[],
  mode: SinceOpenedMode,
  limit = 6,
): Statistic[] {
  if (mode === "live") {
    return statistics
      .filter((statistic) => statistic.dataMode === "live")
      .sort((a, b) => b.yearlyEstimate - a.yearlyEstimate)
      .slice(0, limit);
  }

  const curated = byId(statistics, sinceOpenedMixedIds);

  if (curated.length >= limit) {
    return curated.slice(0, limit);
  }

  const fallback = statistics
    .filter((statistic) => !curated.some((item) => item.id === statistic.id))
    .sort((a, b) => b.yearlyEstimate - a.yearlyEstimate);

  return [...curated, ...fallback].slice(0, limit);
}

export function getTrendingStats(
  statistics: Statistic[],
  seed: number,
  limit = 5,
): Statistic[] {
  const shifted = statistics
    .filter((statistic) => getHistoricalChange(statistic))
    .sort(
      (a, b) =>
        Math.abs(getHistoricalChange(b)?.percentChange ?? 0) -
        Math.abs(getHistoricalChange(a)?.percentChange ?? 0),
    );
  const curated = byId(statistics, trendingIds);
  const pool =
    shifted.length > 0
      ? shifted.slice(0, Math.max(limit * 2, limit))
      : curated.length > 0
        ? curated
        : statistics;

  return rotate(pool, seed).slice(0, limit);
}

export function getFeaturedMainStatistic(statistics: Statistic[]): Statistic | null {
  return (
    statistics.find((statistic) => statistic.id === mainFeaturedStatisticId) ??
    null
  );
}

export function getFeaturedCompanionStats(statistics: Statistic[]): Statistic[] {
  return uniqueStats(byId(statistics, supportingFeaturedStatisticIds)).filter(
    (statistic) => statistic.id !== mainFeaturedStatisticId,
  );
}

export function pickRandomStatistic(statistics: Statistic[]): Statistic | null {
  if (statistics.length === 0) {
    return null;
  }

  return statistics[Math.floor(Math.random() * statistics.length)];
}
