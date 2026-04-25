import { ArrowUpRight } from "lucide-react";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { DataModeBadge } from "./DataModeBadge";
import { StatIcon } from "./StatIcon";
import { calculateSincePageLoad, getRateForScale } from "../lib/calculations";
import { getCategoryStyle } from "../lib/categoryStyles";
import { formatLargeNumber, formatRate } from "../lib/formatting";
import type { Statistic, TimeScale } from "../types/statistic";

interface FeaturedStatCardProps {
  statistic: Statistic;
  openedAt: number;
  now: number;
  timeScale: TimeScale;
  supportingStatistics?: Statistic[];
  onOpen: (statistic: Statistic) => void;
}

export function FeaturedStatCard({
  statistic,
  openedAt,
  now,
  timeScale,
  supportingStatistics = [],
  onOpen,
}: FeaturedStatCardProps) {
  const categoryStyle = getCategoryStyle(statistic.category);
  const sinceOpened = calculateSincePageLoad(statistic.yearlyEstimate, openedAt, now);
  const selectedRate = getRateForScale(statistic.yearlyEstimate, timeScale);

  return (
    <section className="relative overflow-hidden rounded-lg border border-border bg-card p-3 text-card-foreground shadow-subtle sm:p-4">
      <div className={`absolute inset-x-0 top-0 h-0.5 ${categoryStyle.line}`} />
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1.05fr)_minmax(220px,0.65fr)_minmax(360px,1fr)] xl:items-center">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${categoryStyle.iconBg} ${categoryStyle.text}`}
          >
            <StatIcon name={statistic.icon} className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground">Right now</p>
            <h2 className="mt-0.5 truncate text-xl font-semibold tracking-normal">
              {statistic.title}
            </h2>
            <p className="mt-1 truncate text-sm text-muted-foreground">
              {statistic.shortDescription}
            </p>
          </div>
        </div>

        <div className="min-w-0 xl:text-right">
          <p className="count-pop truncate text-3xl font-semibold tracking-normal text-foreground/80">
            {formatLargeNumber(sinceOpened, sinceOpened >= 100_000)}
          </p>
          <p className="mt-1 truncate text-sm text-muted-foreground">
            {formatRate(selectedRate, statistic.unit, timeScale)}
          </p>
          <div className="mt-2 flex flex-wrap gap-2 xl:justify-end">
            <ConfidenceBadge confidence={statistic.confidence} />
            <DataModeBadge dataMode={statistic.dataMode} />
          </div>
        </div>

        {supportingStatistics.length > 0 && (
          <div className="grid min-w-0 gap-2 sm:grid-cols-2">
            {supportingStatistics.map((supportingStatistic) => (
              <SupportingStatButton
                key={supportingStatistic.id}
                statistic={supportingStatistic}
                openedAt={openedAt}
                now={now}
                onOpen={onOpen}
              />
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => onOpen(statistic)}
        className="mt-3 inline-flex h-8 items-center gap-2 rounded-md border border-border bg-background px-3 text-xs font-medium text-foreground transition hover:bg-accent"
      >
        Open details
        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </section>
  );
}

interface SupportingStatButtonProps {
  statistic: Statistic;
  openedAt: number;
  now: number;
  onOpen: (statistic: Statistic) => void;
}

function SupportingStatButton({
  statistic,
  openedAt,
  now,
  onOpen,
}: SupportingStatButtonProps) {
  const categoryStyle = getCategoryStyle(statistic.category);
  const sinceOpened = calculateSincePageLoad(statistic.yearlyEstimate, openedAt, now);

  return (
    <button
      type="button"
      onClick={() => onOpen(statistic)}
      className={`flex min-w-0 items-center gap-2 rounded-md px-2 py-1.5 text-left transition hover:bg-accent ${categoryStyle.hover}`}
      aria-label={`Open ${statistic.title} details`}
    >
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${categoryStyle.iconBg} ${categoryStyle.text}`}
      >
        <StatIcon name={statistic.icon} className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-medium text-muted-foreground">
          {statistic.shortTitle}
        </p>
        <p className="truncate text-sm font-semibold tracking-normal">
          {formatLargeNumber(sinceOpened, sinceOpened >= 100_000)}
        </p>
      </div>
    </button>
  );
}
