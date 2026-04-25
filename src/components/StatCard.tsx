import { calculateSincePageLoad, getRateForScale } from "../lib/calculations";
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
  showCategory?: boolean; // ← ADDED THIS LINE
  onOpen: (statistic: Statistic) => void;
}

export function StatCard({
  statistic,
  openedAt,
  now,
  timeScale,
  isHighlighted = false,
  showCategory = true, // ← ADDED THIS LINE
  onOpen,
}: StatCardProps) {
  const sinceOpened = calculateSincePageLoad(statistic.yearlyEstimate, openedAt, now);
  const selectedRate = getRateForScale(statistic.yearlyEstimate, timeScale);
  const categoryStyle = getCategoryStyle(statistic.category);

  return (
    <article
      onClick={() => onOpen(statistic)}
      className={`group relative cursor-pointer overflow-hidden rounded-lg border-y border-r bg-card text-card-foreground transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${categoryStyle.leftBorder} ${
        isHighlighted ? "ring-2 ring-primary/30" : ""
      }`}
    >
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
          {/* ↓ THIS WHOLE BLOCK IS NEW — only shows category label when showCategory is true */}
          {showCategory && (
            <p
              className={`text-[10px] font-semibold uppercase tracking-widest ${categoryStyle.text}`}
            >
              {statistic.category}
            </p>
          )}
          {/* ↑ END OF NEW BLOCK */}

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

      {/* Rate row */}
      <div className={`mx-3 mb-3 mt-3 rounded-md px-2.5 py-1.5 ${categoryStyle.rateBg}`}>
        <p className={`text-xs font-medium ${categoryStyle.rateText}`}>
          {formatRate(selectedRate, statistic.unit, timeScale)}
        </p>
      </div>
    </article>
  );
}