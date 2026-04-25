import { StatIcon } from "./StatIcon";
import { DataModeBadge } from "./DataModeBadge";
import { ConfidenceBadge } from "./ConfidenceBadge";
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
    <section
      className={`relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-subtle ${categoryStyle.leftBorder}`}
    >
      <div className="grid gap-0 sm:grid-cols-[1fr_auto]">

        {/* Left: identity + number */}
        <button
          type="button"
          onClick={() => onOpen(statistic)}
          className="flex min-w-0 items-center gap-3 px-3 py-2.5 text-left transition hover:bg-accent/30"
        >
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${categoryStyle.iconBg} ${categoryStyle.text}`}
          >
            <StatIcon name={statistic.icon} className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className={`text-[10px] font-semibold uppercase tracking-widest ${categoryStyle.text}`}>
              Right now
            </p>
            <h2 className="truncate text-base font-semibold leading-snug">
              {statistic.title}
            </h2>
            <p className="truncate text-xs text-muted-foreground">
              {statistic.shortDescription}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-2xl font-semibold tabular-nums text-foreground/90">
              {formatLargeNumber(sinceOpened, sinceOpened >= 100_000)}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatRate(selectedRate, statistic.unit, timeScale)}
            </p>
            <div className="mt-1 flex justify-end gap-1.5">
              <ConfidenceBadge confidence={statistic.confidence} />
              <DataModeBadge dataMode={statistic.dataMode} />
            </div>
          </div>
        </button>

        {/* Right: supporting stats */}
        {supportingStatistics.length > 0 && (
          <div className="flex min-w-0 flex-col justify-center gap-1 border-l border-border px-3 py-2.5 sm:min-w-[220px]">
            {supportingStatistics.map((s) => (
              <SupportingStatButton
                key={s.id}
                statistic={s}
                openedAt={openedAt}
                now={now}
                onOpen={onOpen}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

interface SupportingStatButtonProps {
  statistic: Statistic;
  openedAt: number;
  now: number;
  onOpen: (statistic: Statistic) => void;
}

function SupportingStatButton({ statistic, openedAt, now, onOpen }: SupportingStatButtonProps) {
  const categoryStyle = getCategoryStyle(statistic.category);
  const sinceOpened = calculateSincePageLoad(statistic.yearlyEstimate, openedAt, now);

  return (
    <button
      type="button"
      onClick={() => onOpen(statistic)}
      className={`flex min-w-0 items-center gap-2 rounded-md px-2 py-1 text-left transition hover:bg-accent`}
      aria-label={`Open ${statistic.title} details`}
    >
      <div
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${categoryStyle.iconBg} ${categoryStyle.text}`}
      >
        <StatIcon name={statistic.icon} className="h-3 w-3" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[10px] text-muted-foreground">{statistic.shortTitle}</p>
        <p className="truncate text-sm font-semibold tabular-nums">
          {formatLargeNumber(sinceOpened, sinceOpened >= 100_000)}
        </p>
      </div>
    </button>
  );
}