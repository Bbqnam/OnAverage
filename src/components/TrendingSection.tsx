import { Flame } from "lucide-react";
import { DataModeBadge } from "./DataModeBadge";
import { StatIcon } from "./StatIcon";
import { yearlyToPerSecond } from "../lib/calculations";
import { getCategoryStyle } from "../lib/categoryStyles";
import { formatLargeNumber } from "../lib/formatting";
import { getBalancedGridClass } from "../lib/layout";
import type { Statistic } from "../types/statistic";

interface TrendingSectionProps {
  statistics: Statistic[];
  onOpenStatistic: (statistic: Statistic) => void;
}

export function TrendingSection({ statistics, onOpenStatistic }: TrendingSectionProps) {
  if (statistics.length === 0) {
    return null;
  }

  return (
    <section className="rounded-lg border border-border bg-card p-2.5 text-card-foreground shadow-subtle">
      <div className="mb-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-primary" aria-hidden="true" />
          <h2 className="text-sm font-semibold">Trending now</h2>
        </div>
        <span className="text-xs text-muted-foreground">refreshes quietly</span>
      </div>
      <div className={getBalancedGridClass(statistics.length, "gap-2")}>
        {statistics.map((statistic) => {
          const perSecond = yearlyToPerSecond(statistic.yearlyEstimate);
          const categoryStyle = getCategoryStyle(statistic.category);

          return (
            <button
              key={statistic.id}
              type="button"
              onClick={() => onOpenStatistic(statistic)}
              className={`flex min-w-0 items-center gap-2 rounded-md border border-border bg-background px-2 py-1.5 text-left transition hover:-translate-y-0.5 ${categoryStyle.hover} ${categoryStyle.glow}`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${categoryStyle.iconBg} ${categoryStyle.text}`}
              >
                <StatIcon name={statistic.icon} className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{statistic.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {formatLargeNumber(perSecond, perSecond >= 10_000)} / sec
                </p>
              </div>
              <DataModeBadge dataMode={statistic.dataMode} />
            </button>
          );
        })}
      </div>
    </section>
  );
}
