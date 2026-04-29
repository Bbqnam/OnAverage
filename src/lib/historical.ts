import type { HistoricalChange, HistoricalDataPoint, Statistic } from "../types/statistic";

const HISTORICAL_WINDOW_YEARS = 10;

export function getHistoricalSeries(statistic: Statistic): HistoricalDataPoint[] {
  const historicalData = normalizeHistoricalData(statistic);

  if (historicalData.length === 0) {
    return [];
  }

  const latestYear = historicalData[historicalData.length - 1].year;
  const startYear = latestYear - HISTORICAL_WINDOW_YEARS + 1;

  return historicalData.filter((point) => point.year >= startYear && point.year <= latestYear);
}

function normalizeHistoricalData(statistic: Statistic): HistoricalDataPoint[] {
  const byYear = new Map<number, HistoricalDataPoint>();

  for (const point of statistic.historicalData ?? []) {
    if (!Number.isFinite(point.year) || !Number.isFinite(point.value)) continue;

    byYear.set(point.year, {
      ...point,
      value: Math.max(0, point.value),
      isEstimated: point.isEstimated ?? statistic.sourceTier === "estimated",
    });
  }

  return [...byYear.values()].sort((a, b) => a.year - b.year);
}

export function getHistoricalChange(statistic: Statistic): HistoricalChange | null {
  const series = getHistoricalSeries(statistic).filter((point) => !point.isEstimated);

  if (series.length >= 2) {
    const first = series[0];
    const last = series[series.length - 1];
    const yearsAgo = last.year - first.year;

    if (
      yearsAgo > 0 &&
      first.value > 0 &&
      Number.isFinite(first.value) &&
      Number.isFinite(last.value)
    ) {
      const percentChange = Math.round(((last.value - first.value) / first.value) * 100);

      return {
        yearsAgo,
        percentChange,
        label: `${first.year}`,
      };
    }
  }

  return null;
}
