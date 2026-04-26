import { Star, TrendingDown, TrendingUp } from "lucide-react";
import { calculateSincePageLoad, getRateForScale, getRateRangeForScale } from "../lib/calculations";
import { getCategoryStyle } from "../lib/categoryStyles";
import { StatIcon } from "./StatIcon";
import { formatLargeNumber, formatRate } from "../lib/formatting";
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

  return (
    <article
      onClick={() => onOpen(statistic)}
      className={`group relative cursor-pointer overflow-hidden rounded-lg border-y border-r bg-card text-card-foreground transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${categoryStyle.leftBorder} ${
        isHighlighted ? "ring-2 ring-primary/30" : ""
      }`}
    >
      {/* Favorite button */}
      {onToggleFavorite && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(statistic.id);
          }}
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

      {/* Header: icon + title side by side */}
      <div className="flex items-start gap-3 px-3 pt-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${categoryStyle.iconBg} ${categoryStyle.text}`}
        >
          {(statistic.category === "Life" ||
            statistic.category === "Events" ||
            statistic.category === "Environment") && (
            <span
              className={`absolute h-9 w-9 rounded-full ${categoryStyle.dot} opacity-20 ${categoryStyle.pulse}`}
            />
          )}
          <StatIcon name={statistic.icon} className="relative z-10 h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1">
          {showCategory && (
            <p
              className={`text-[10px] font-semibold uppercase tracking-widest ${categoryStyle.text}`}
            >
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

      {/* Live counter */}
      <div className="px-3 pt-3">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Since you opened
        </p>
        <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
          {formatLargeNumber(sinceOpened, sinceOpened >= 100_000)}
        </p>
      </div>

      {/* Rate row — with optional confidence interval range */}
      <div className={`mx-3 mb-3 mt-3 rounded-md px-2.5 py-1.5 ${categoryStyle.rateBg}`}>
        {rateRange ? (
          <p className={`text-xs font-medium ${categoryStyle.rateText}`}>
            {formatLargeNumber(rateRange.low, rateRange.low >= 10_000)}–
            {formatLargeNumber(rateRange.high, rateRange.high >= 10_000)}{" "}
            {statistic.unit} / {timeScale === "year" ? "year" : timeScale}
          </p>
        ) : (
          <p className={`text-xs font-medium ${categoryStyle.rateText}`}>
            {formatRate(selectedRate, statistic.unit, timeScale)}
          </p>
        )}
      </div>

      {/* Historical change pill */}
      {hist && (
        <div className="px-3 pb-2.5">
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${
              hist.percentChange >= 0
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                : "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300"
            }`}
            title={`Compared to ${hist.label}`}
          >
            {hist.percentChange >= 0 ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {hist.percentChange >= 0 ? "+" : ""}
            {hist.percentChange}% vs {hist.label}
          </span>
        </div>
      )}

      {/* Source year note */}
      {statistic.sourceYear && (
        <p className="px-3 pb-2 text-[10px] text-muted-foreground/70">
          Based on {statistic.sourceYear} data
        </p>
      )}
    </article>
  );
}
