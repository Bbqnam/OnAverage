import { Star, TrendingDown, TrendingUp } from "lucide-react";
import { getRateForScale, getRateRangeForScale } from "../lib/calculations";
import { getCategoryStyle } from "../lib/categoryStyles";
import { getHistoricalChange } from "../lib/historical";
import { getCumulativeValue, getTimelineLabel } from "../lib/timeline";
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
  const selectedStartDate = new Date(openedAt);
  const currentDate = new Date(now);
  const cumulative = getCumulativeValue(statistic, selectedStartDate, currentDate);
  const timelineLabel = getTimelineLabel(statistic, selectedStartDate, currentDate);
  const selectedRate = getRateForScale(statistic.yearlyEstimate, timeScale);
  const categoryStyle = getCategoryStyle(statistic.category);
  const ci = statistic.confidenceInterval;
  const hist = getHistoricalChange(statistic);

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
  const historicalLabel = hist
    ? `${hist.percentChange >= 0 ? "+" : ""}${hist.percentChange}% vs ${hist.label}`
    : null;

  return (
    <article
      onClick={() => onOpen(statistic)}
      className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-lg border-y border-r bg-card text-card-foreground transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${categoryStyle.leftBorder} ${
        isHighlighted ? "ring-2 ring-primary/30" : ""
      } ${cumulative.isUnavailable ? "opacity-40 grayscale" : ""}`}
    >
      {onToggleFavorite && (
        <div className="absolute right-1.5 top-1.5 z-10 flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(statistic.id);
            }}
            aria-label={isFavorite ? "Remove from My World" : "Save to My World"}
            title={isFavorite ? "Remove from My World" : "Save to My World"}
            className={`rounded-full border p-0.5 transition ${
              isFavorite
                ? "border-amber-400/30 bg-amber-400/10 text-amber-500 opacity-100"
                : "border-transparent bg-background/80 text-muted-foreground opacity-0 shadow-sm hover:text-foreground group-hover:opacity-100"
            }`}
          >
            <Star className="h-3.5 w-3.5" fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>
      )}

      <div className="flex min-w-0 gap-2.5 p-2.5">
        <div className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${categoryStyle.iconBg} ${categoryStyle.text}`}>
          {(statistic.category === "Life" || statistic.category === "Events" || statistic.category === "Environment") && (
            <span className={`absolute h-8 w-8 rounded-full ${categoryStyle.dot} opacity-20 ${categoryStyle.pulse}`} />
          )}
          <StatIcon name={statistic.icon} className="relative z-10 h-3.5 w-3.5" />
        </div>
        <div className="min-w-0 flex-1 pr-8">
          <div className="flex min-w-0 items-start justify-between gap-2">
            <div className="min-w-0">
              {showCategory && (
                <p className={`text-[10px] font-semibold uppercase tracking-widest ${categoryStyle.text}`}>
                  {statistic.category}
                </p>
              )}
              <h2 className="mt-0.5 truncate text-sm font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
                {statistic.title}
              </h2>
              <p className="truncate text-[11px] text-muted-foreground">
                {statistic.shortDescription}
              </p>
            </div>
          </div>

          <div className="mt-1.5 flex items-end justify-between gap-2">
            <div className="min-w-0">
              <p className="text-2xl font-bold leading-none tracking-tight text-foreground">
                {cumulative.isUnavailable
                  ? "—"
                  : formatLargeNumber(cumulative.value, cumulative.value >= 100_000)}
              </p>
              {cumulative.isUnavailable ? (
                <p className="mt-1 truncate text-[11px] leading-tight text-muted-foreground">
                  Not available before {statistic.startYear}
                </p>
              ) : timelineLabel ? (
                <p
                  className={`mt-1 truncate text-[11px] leading-tight ${categoryStyle.text} opacity-60`}
                  title={`This metric is only counted from when it realistically became available (${statistic.startYear})`}
                >
                  {timelineLabel}
                </p>
              ) : null}
              <p className={`mt-1 truncate text-[11px] leading-tight ${categoryStyle.rateText} opacity-85`}>
                ≈ {rateStr}
              </p>
            </div>
            <div className="min-w-0 shrink-0 text-right">
              {hist && historicalLabel && (
                <span
                  title={`Compared with ${hist.label}`}
                  className={`mt-1 inline-flex max-w-full items-center gap-0.5 rounded-full bg-background/70 px-1.5 py-0.5 text-[10px] font-medium leading-none ${
                    hist.percentChange >= 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-500 dark:text-rose-400"
                  }`}
                >
                  {hist.percentChange >= 0
                    ? <TrendingUp className="h-2.5 w-2.5 shrink-0" />
                    : <TrendingDown className="h-2.5 w-2.5 shrink-0" />}
                  <span className="truncate">{historicalLabel}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
