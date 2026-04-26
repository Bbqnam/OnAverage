import { Star, TrendingDown, TrendingUp } from "lucide-react";
import { calculateSincePageLoad, getRateForScale, getRateRangeForScale } from "../lib/calculations";
import { getCategoryStyle } from "../lib/categoryStyles";
import { StatIcon } from "./StatIcon";
import { formatLargeNumber } from "../lib/formatting";
import type { Statistic, TimeScale } from "../types/statistic";

interface StatCardProps {
  statistic: Statistic;
  openedAt: number;
  now: number;
  timeScale: TimeScale;
  isHighlighted?: boolean;
  showCategory?: boolean;
  isFavorite?: boolean;
  onOpen: (statistic: Statistic) => void;
  onToggleFavorite?: (id: string) => void;
}

export function StatCard({
  statistic,
  openedAt,
  now,
  timeScale,
  isHighlighted = false,
  showCategory = true,
  isFavorite = false,
  onOpen,
  onToggleFavorite,
}: StatCardProps) {
  const sinceOpened = calculateSincePageLoad(statistic.yearlyEstimate, openedAt, now);
  const selectedRate = getRateForScale(statistic.yearlyEstimate, timeScale);
  const categoryStyle = getCategoryStyle(statistic.category);
  const ci = statistic.confidenceInterval;
  const hist = statistic.historicalChange;

  const rateRange = ci
    ? getRateRangeForScale(statistic.yearlyEstimate, ci, timeScale)
    : null;

  const scaleLabel =
    timeScale === "year" ? "yr"
    : timeScale === "minute" ? "min"
    : timeScale === "hour" ? "hr"
    : timeScale;

  const rateStr = rateRange
    ? `${formatLargeNumber(rateRange.low, rateRange.low >= 10_000)}–${formatLargeNumber(rateRange.high, rateRange.high >= 10_000)} / ${scaleLabel}`
    : `${formatLargeNumber(selectedRate, selectedRate >= 10_000)} / ${scaleLabel}`;

  return (
    <article
      onClick={() => onOpen(statistic)}
      className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-lg border-y border-r bg-card text-card-foreground transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${categoryStyle.leftBorder} ${
        isHighlighted ? "ring-2 ring-primary/30" : ""
      }`}
    >
      {/* Favorite star — only button on the card */}
      {onToggleFavorite && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(statistic.id); }}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          className={`absolute right-2 top-2 z-10 rounded-full p-0.5 transition-opacity ${
            isFavorite
              ? "text-amber-400 opacity-100"
              : "text-muted-foreground opacity-0 group-hover:opacity-60 hover:!opacity-100"
          }`}
        >
          <Star className="h-3.5 w-3.5" fill={isFavorite ? "currentColor" : "none"} />
        </button>
      )}

      {/* Header */}
      <div className="flex items-start gap-3 px-3 pt-3">
        <div className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${categoryStyle.iconBg} ${categoryStyle.text}`}>
          {(statistic.category === "Life" || statistic.category === "Events" || statistic.category === "Environment") && (
            <span className={`absolute h-9 w-9 rounded-full ${categoryStyle.dot} opacity-20 ${categoryStyle.pulse}`} />
          )}
          <StatIcon name={statistic.icon} className="relative z-10 h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1 pr-5">
          {showCategory && (
            <p className={`text-[10px] font-semibold uppercase tracking-widest ${categoryStyle.text}`}>
              {statistic.category}
            </p>
          )}
          <h2 className="mt-0.5 text-sm font-semibold leading-snug text-foreground">
            {statistic.title}
          </h2>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {statistic.shortDescription}
          </p>
        </div>
      </div>

      {/* Counter */}
      <div className="px-3 pt-3">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Since you opened
        </p>
        <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
          {formatLargeNumber(sinceOpened, sinceOpened >= 100_000)}
        </p>
      </div>

      {/* Single subtle footer line: rate + optional historical % */}
      <div className="flex items-center justify-between gap-2 px-3 pb-3 pt-1.5">
        <p className={`text-[11px] ${categoryStyle.rateText} opacity-75`}>
          ≈ {rateStr}
        </p>
        {hist && (
          <span className={`inline-flex shrink-0 items-center gap-0.5 text-[10px] font-medium ${
            hist.percentChange >= 0
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-rose-500 dark:text-rose-400"
          }`}>
            {hist.percentChange >= 0
              ? <TrendingUp className="h-2.5 w-2.5" />
              : <TrendingDown className="h-2.5 w-2.5" />}
            {hist.percentChange >= 0 ? "+" : ""}{hist.percentChange}%
          </span>
        )}
      </div>
    </article>
  );
}
