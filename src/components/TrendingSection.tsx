import { Flame } from "lucide-react";
import { DataModeBadge } from "./DataModeBadge";
import { StatIcon } from "./StatIcon";
import { yearlyToPerSecond } from "../lib/calculations";
import { getCategoryStyle } from "../lib/categoryStyles";
import { formatLargeNumber } from "../lib/formatting";
import { getHistoricalChange } from "../lib/historical";
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
    <section className="rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-subtle sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Flame className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-semibold tracking-tight">Notable shifts</h2>
            <p className="text-xs text-muted-foreground">Largest historical movements</p>
          </div>
        </div>
        <span className="hidden text-xs text-muted-foreground sm:inline">Compared with past estimates</span>
      </div>
      <div className={getBalancedGridClass(statistics.length, "gap-2")}>
        {statistics.map((statistic) => {
          const perSecond = yearlyToPerSecond(statistic.yearlyEstimate);
          const categoryStyle = getCategoryStyle(statistic.category);
          const change = getHistoricalChange(statistic);

          return (
            <button
              key={statistic.id}
              type="button"
              onClick={() => onOpenStatistic(statistic)}
              className={`flex min-w-0 items-center gap-3 rounded-xl border border-border bg-background/70 px-3 py-2.5 text-left transition hover:-translate-y-0.5 ${categoryStyle.hover} ${categoryStyle.glow}`}
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
              {change ? (
                <span
                  title={`Compared with ${change.label}`}
                  className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                    change.percentChange >= 0
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-rose-500/10 text-rose-500 dark:text-rose-400"
                  }`}
                >
                  {change.percentChange >= 0 ? "+" : ""}{change.percentChange}%
                </span>
              ) : (
                <DataModeBadge dataMode={statistic.dataMode} />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
