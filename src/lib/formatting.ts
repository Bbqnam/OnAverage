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

export function sentenceCaseTimeScale(scale: TimeScale): string {
  return `Per ${scale}`;
}

export function formatLabel(value: string): string {
  return value
    .split("-")
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

export function cleanDisplayText(value: string): string {
  return value
    .replace(/(\d)\s*[–—-]\s*(\d)/g, "$1 to $2")
    .replace(/\s+[–—]\s+/g, ", ")
    .replace(/([A-Za-z])-(?=[A-Za-z])/g, "$1 ")
    .replace(/\s{2,}/g, " ")
    .trim();
}
