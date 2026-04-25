import type { TimeScale } from "../types/statistic";

const compactNumberFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const wholeNumberFormatter = new Intl.NumberFormat("en", {
  maximumFractionDigits: 0,
});

const preciseNumberFormatter = new Intl.NumberFormat("en", {
  maximumFractionDigits: 2,
});

export function formatLargeNumber(value: number, compact = false): string {
  if (!Number.isFinite(value)) {
    return "0";
  }

  const absoluteValue = Math.abs(value);

  if (compact && absoluteValue >= 10_000) {
    return compactNumberFormatter.format(value);
  }

  if (absoluteValue >= 100) {
    return wholeNumberFormatter.format(value);
  }

  if (absoluteValue >= 10) {
    return preciseNumberFormatter.format(value);
  }

  if (absoluteValue >= 1) {
    return preciseNumberFormatter.format(value);
  }

  return value.toFixed(3);
}

export function formatRate(value: number, unit: string, scale: TimeScale): string {
  const label = scale === "year" ? "year" : scale;

  return `${formatLargeNumber(value, value >= 10_000)} ${unit} / ${label}`;
}

export function formatElapsedTime(openedAt: number, now = Date.now()): string {
  const elapsedSeconds = Math.max(0, Math.floor((now - openedAt) / 1000));
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;

  if (minutes === 0) {
    return `${seconds}s`;
  }

  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
}

export function sentenceCaseTimeScale(scale: TimeScale): string {
  return `Per ${scale}`;
}

export function formatLabel(value: string): string {
  return value
    .split("-")
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}
