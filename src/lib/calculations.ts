import type { Statistic, TimeScale } from "../types/statistic";

export const DAYS_PER_YEAR = 365.2425;
export const HOURS_PER_DAY = 24;
export const MINUTES_PER_HOUR = 60;
export const SECONDS_PER_MINUTE = 60;
export const SECONDS_PER_HOUR = SECONDS_PER_MINUTE * MINUTES_PER_HOUR;
export const SECONDS_PER_DAY = SECONDS_PER_HOUR * HOURS_PER_DAY;
export const SECONDS_PER_YEAR = SECONDS_PER_DAY * DAYS_PER_YEAR;

export function yearlyToPerSecond(yearlyEstimate: number): number {
  return yearlyEstimate / SECONDS_PER_YEAR;
}

export function yearlyToPerMinute(yearlyEstimate: number): number {
  return yearlyToPerSecond(yearlyEstimate) * SECONDS_PER_MINUTE;
}

export function yearlyToPerHour(yearlyEstimate: number): number {
  return yearlyToPerSecond(yearlyEstimate) * SECONDS_PER_HOUR;
}

export function yearlyToPerDay(yearlyEstimate: number): number {
  return yearlyToPerSecond(yearlyEstimate) * SECONDS_PER_DAY;
}

export function getRateForScale(yearlyEstimate: number, scale: TimeScale): number {
  switch (scale) {
    case "second":
      return yearlyToPerSecond(yearlyEstimate);
    case "minute":
      return yearlyToPerMinute(yearlyEstimate);
    case "hour":
      return yearlyToPerHour(yearlyEstimate);
    case "day":
      return yearlyToPerDay(yearlyEstimate);
    case "year":
      return yearlyEstimate;
    default:
      return yearlyEstimate;
  }
}

export function calculateSincePageLoad(
  yearlyEstimate: number,
  openedAt: number,
  now = Date.now(),
): number {
  const elapsedSeconds = Math.max(0, (now - openedAt) / 1000);

  return yearlyToPerSecond(yearlyEstimate) * elapsedSeconds;
}

export function getStatisticDisplayValue(
  statistic: Statistic,
  openedAt: number,
  now = Date.now(),
): number {
  if (statistic.isStatic) {
    return statistic.yearlyEstimate;
  }

  return calculateSincePageLoad(statistic.yearlyEstimate, openedAt, now);
}

export function getStatisticRateForScale(
  statistic: Statistic,
  scale: TimeScale,
): number {
  if (statistic.isStatic) {
    return statistic.yearlyEstimate;
  }

  return getRateForScale(statistic.yearlyEstimate, scale);
}
