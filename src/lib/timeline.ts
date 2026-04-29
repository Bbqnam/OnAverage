import type { Statistic } from "../types/statistic";

export interface EffectiveElapsed {
  elapsedSeconds: number;
  effectiveStartYear: number;
  wasClamped: boolean;
  isUnavailable: boolean;
  clampedYears: number;
}

export interface CumulativeValue extends EffectiveElapsed {
  value: number;
}

const MS_PER_DAY = 86_400_000;

export function getEffectiveElapsed(
  stat: Statistic,
  selectedStartDate: Date,
  now: Date = new Date(),
): EffectiveElapsed {
  const statStart = new Date(stat.startYear, 0, 1);
  const effectiveStart = selectedStartDate < statStart
    ? statStart
    : selectedStartDate;

  if (now < statStart) {
    return {
      elapsedSeconds: 0,
      effectiveStartYear: stat.startYear,
      wasClamped: false,
      isUnavailable: true,
      clampedYears: 0,
    };
  }

  const clampedYears = selectedStartDate < statStart
    ? statStart.getFullYear() - selectedStartDate.getFullYear()
    : 0;

  return {
    elapsedSeconds: Math.max(0, (now.getTime() - effectiveStart.getTime()) / 1000),
    effectiveStartYear: effectiveStart.getFullYear(),
    wasClamped: selectedStartDate < statStart,
    isUnavailable: false,
    clampedYears,
  };
}

export function getCumulativeValue(
  stat: Statistic,
  selectedStartDate: Date,
  now: Date = new Date(),
): CumulativeValue {
  const elapsed = getEffectiveElapsed(stat, selectedStartDate, now);

  if (elapsed.isUnavailable) {
    return { value: 0, ...elapsed };
  }

  if (stat.isStatic) {
    return { value: stat.yearlyEstimate, ...elapsed };
  }

  if (
    stat.growthCurve === "exponential" &&
    stat.historicalData &&
    stat.historicalData.length >= 3
  ) {
    const statStart = new Date(stat.startYear, 0, 1);
    const effectiveStart = selectedStartDate < statStart ? statStart : selectedStartDate;
    const value = calculateWeightedCumulative(
      stat.historicalData,
      effectiveStart,
      now,
    );

    return { value, ...elapsed };
  }

  if (stat.growthCurve === "exponential") {
    return {
      value: calculateExponentialFallback(stat, elapsed, now),
      ...elapsed,
    };
  }

  return {
    value: stat.ratePerSecond * elapsed.elapsedSeconds,
    ...elapsed,
  };
}

function calculateWeightedCumulative(
  historicalData: { year: number; value: number }[],
  effectiveStart: Date,
  now: Date,
): number {
  const sorted = [...historicalData]
    .filter((point) => Number.isFinite(point.year) && Number.isFinite(point.value))
    .sort((a, b) => a.year - b.year);

  if (sorted.length === 0) {
    return 0;
  }

  const startYear = effectiveStart.getFullYear();
  const currentYear = now.getFullYear();
  let total = 0;

  for (let year = startYear; year <= currentYear; year += 1) {
    const yearValue = getHistoricalYearValue(sorted, year);

    if (year === startYear && year === currentYear) {
      const startFraction = getYearProgress(effectiveStart);
      const endFraction = getYearProgress(now);
      total += yearValue * Math.max(0, endFraction - startFraction);
    } else if (year === startYear) {
      const startFraction = getYearProgress(effectiveStart);
      total += yearValue * Math.max(0, 1 - startFraction);
    } else if (year === currentYear) {
      const endFraction = getYearProgress(now);
      total += yearValue * Math.max(0, endFraction);
    } else {
      total += yearValue;
    }
  }

  return Math.max(0, total);
}

function getHistoricalYearValue(
  historicalData: { year: number; value: number }[],
  year: number,
): number {
  const exact = historicalData.find((point) => point.year === year);
  if (exact) return exact.value;

  const first = historicalData[0];
  const last = historicalData[historicalData.length - 1];

  if (year < first.year) return 0;
  if (year > last.year) return last.value;

  const previous = [...historicalData].reverse().find((point) => point.year < year);
  const next = historicalData.find((point) => point.year > year);

  if (!previous || !next) return previous?.value ?? next?.value ?? 0;

  const fraction = (year - previous.year) / (next.year - previous.year);
  return previous.value + (next.value - previous.value) * fraction;
}

function calculateExponentialFallback(
  stat: Statistic,
  elapsed: EffectiveElapsed,
  now: Date,
): number {
  const secondsPerYear = 365.2425 * 24 * 60 * 60;
  const statStart = new Date(stat.startYear, 0, 1);
  const signalAgeYears = Math.max(0, elapsed.elapsedSeconds / secondsPerYear);

  if (elapsed.elapsedSeconds < secondsPerYear / 12) {
    return stat.ratePerSecond * elapsed.elapsedSeconds;
  }

  const fullAgeYears = Math.max(1, (now.getTime() - statStart.getTime()) / 1000 / secondsPerYear);
  const rampShare = Math.min(1, signalAgeYears / fullAgeYears);
  const averageAnnualValue = stat.yearlyEstimate * Math.pow(rampShare, 1.8) * 0.45;

  return Math.max(0, averageAnnualValue * signalAgeYears);
}

function getYearProgress(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - start.getTime();
  return diff / MS_PER_DAY / daysInYear(date.getFullYear());
}

function daysInYear(year: number): number {
  return new Date(year, 1, 29).getMonth() === 1 ? 366 : 365;
}

export function getFilteredHistoricalData(
  stat: Statistic,
  fromYear: number,
): { year: number; value: number }[] {
  if (!stat.historicalData) return [];

  const startYear = Math.max(stat.startYear, fromYear);

  return stat.historicalData
    .filter((point) => point.year >= startYear)
    .sort((a, b) => a.year - b.year);
}

export function getTimelineLabel(
  stat: Statistic,
  selectedStartDate: Date,
  now: Date = new Date(),
): string | null {
  const elapsed = getEffectiveElapsed(stat, selectedStartDate, now);

  if (elapsed.isUnavailable) return null;
  if (!elapsed.wasClamped) return null;

  const labels: Record<Statistic["estimateType"], string | null> = {
    natural: null,
    modern: `since ${stat.startYear}`,
    digital: `since ${stat.startYear}`,
    tracked: `tracked since ${stat.startYear}`,
  };

  return labels[stat.estimateType];
}

export function getBornBeforeNarrative(
  stat: Statistic,
  birthYear: number,
): string | null {
  if (birthYear >= stat.startYear) return null;

  const yearsBefore = stat.startYear - birthYear;

  const narratives: Record<string, string> = {
    "ai-prompts-asked": `AI prompts didn't exist for your first ${yearsBefore} years of life.`,
    "internet-searches": `The internet wasn't searchable for your first ${yearsBefore} years.`,
    "messages-sent": `Digital messaging didn't exist for your first ${yearsBefore} years.`,
    "social-posts-created": `Social media didn't exist for your first ${yearsBefore} years.`,
    "videos-watched": `Online video didn't exist for your first ${yearsBefore} years.`,
    "apps-downloaded": `App stores didn't exist for your first ${yearsBefore} years.`,
    "crypto-trades": `Cryptocurrency didn't exist for your first ${yearsBefore} years.`,
    "websites-created": `The World Wide Web didn't exist for your first ${yearsBefore} years.`,
    "people-scrolling-phones": `Smartphones didn't exist for your first ${yearsBefore} years.`,
    "selfies-taken": `The selfie camera didn't exist for your first ${yearsBefore} years.`,
  };

  return narratives[stat.id] ??
    `This signal only began in ${stat.startYear}, ${yearsBefore} years after you were born.`;
}
