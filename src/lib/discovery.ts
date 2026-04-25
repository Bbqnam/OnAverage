import type { Statistic } from "../types/statistic";

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

const featuredCompanionIds = [
  "people-scrolling-phones",
  "videos-watched",
  "card-payments-made",
  "storms-active",
  "internet-searches",
  "messages-sent",
  "ai-prompts-asked",
  "crypto-trades",
];

function byId(statistics: Statistic[], ids: string[]): Statistic[] {
  return ids
    .map((id) => statistics.find((statistic) => statistic.id === id))
    .filter((statistic): statistic is Statistic => Boolean(statistic));
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
  const curated = byId(statistics, trendingIds);
  const pool = curated.length > 0 ? curated : statistics;

  return rotate(pool, seed).slice(0, limit);
}

export function getFeaturedCompanionStats(
  statistics: Statistic[],
  featuredStatistic: Statistic,
  limit = 4,
): Statistic[] {
  const curated = byId(statistics, featuredCompanionIds).filter(
    (statistic) => statistic.id !== featuredStatistic.id,
  );

  if (curated.length >= limit) {
    return curated.slice(0, limit);
  }

  const curatedIds = new Set(curated.map((statistic) => statistic.id));
  const fallback = statistics.filter(
    (statistic) =>
      statistic.id !== featuredStatistic.id && !curatedIds.has(statistic.id),
  );

  return [...curated, ...fallback].slice(0, limit);
}

export function pickRandomStatistic(statistics: Statistic[]): Statistic | null {
  if (statistics.length === 0) {
    return null;
  }

  return statistics[Math.floor(Math.random() * statistics.length)];
}
