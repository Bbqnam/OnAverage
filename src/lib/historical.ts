import type { HistoricalChange, HistoricalDataPoint, Statistic } from "../types/statistic";
import { getFilteredHistoricalData } from "./timeline";

export function getHistoricalSeries(statistic: Statistic): HistoricalDataPoint[] {
  const currentYear = new Date().getFullYear();
  const series = getFilteredHistoricalData(statistic, currentYear - 9);

  if (series.length < 2) {
    return [];
  }

  const sorted = [...series]
    .filter((point) => Number.isFinite(point.year) && Number.isFinite(point.value))
    .sort((a, b) => a.year - b.year);

  if (sorted.length < 2) {
    return [];
  }

  const last = sorted[sorted.length - 1];

  if (last.year >= currentYear) {
    return sorted;
  }

  return [
    ...sorted,
    ...Array.from({ length: currentYear - last.year }, (_, index) => ({
      year: last.year + index + 1,
      value: last.value,
    })),
  ];
}

export function getHistoricalChange(statistic: Statistic): HistoricalChange | null {
  const series = getHistoricalSeries(statistic);

  if (series.length >= 2) {
    const first = series[0];
    const last = series[series.length - 1];

    if (first.value > 0 && Number.isFinite(first.value) && Number.isFinite(last.value)) {
      const yearsAgo = series.length >= 10 ? 10 : last.year - first.year;
      const percentChange = Math.round(((last.value - first.value) / first.value) * 100);

      return {
        yearsAgo,
        percentChange,
        label: `${yearsAgo} years ago`,
      };
    }
  }

  return statistic.historicalChange ?? null;
}
