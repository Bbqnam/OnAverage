import { Activity } from "lucide-react";
import { DataModeBadge } from "./DataModeBadge";
import { StatIcon } from "./StatIcon";
import { calculateSincePageLoad } from "../lib/calculations";
import { getCategoryStyle } from "../lib/categoryStyles";
import { getSinceOpenedHighlights, type SinceOpenedMode } from "../lib/discovery";
import { formatLargeNumber } from "../lib/formatting";
import type { Statistic } from "../types/statistic";

interface SinceOpenedExplorerProps {
  statistics: Statistic[];
  openedAt: number;
  now: number;
  mode: SinceOpenedMode;
  onModeChange: (mode: SinceOpenedMode) => void;
  onOpenStatistic: (statistic: Statistic) => void;
}

export function SinceOpenedExplorer({
  statistics,
  openedAt,
  now,
  mode,
  onModeChange,
  onOpenStatistic,
}: SinceOpenedExplorerProps) {
  const highlights = getSinceOpenedHighlights(statistics, mode);

  if (highlights.length === 0) {
    return null;
  }

  return (
    <section className="rounded-lg border border-border bg-card p-3 text-card-foreground shadow-subtle">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
            <Activity className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">Since you opened</h2>
            <p className="text-xs text-muted-foreground">A few moving snapshots from the world.</p>
          </div>
        </div>
        <div className="flex rounded-lg border border-border bg-background p-1">
          {(["mixed", "live"] as SinceOpenedMode[]).map((option) => {
            const isSelected = option === mode;

            return (
              <button
                key={option}
                type="button"
                onClick={() => onModeChange(option)}
                className={`h-8 rounded-md px-3 text-xs font-medium transition ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
                aria-pressed={isSelected}
              >
                {option === "mixed" ? "Mixed" : "Live only"}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {highlights.map((statistic) => {
          const count = calculateSincePageLoad(statistic.yearlyEstimate, openedAt, now);
          const categoryStyle = getCategoryStyle(statistic.category);

          return (
            <button
              key={statistic.id}
              type="button"
              onClick={() => onOpenStatistic(statistic)}
              className={`flex items-center gap-2 rounded-md border border-border bg-background px-2.5 py-2 text-left transition hover:-translate-y-0.5 ${categoryStyle.hover} ${categoryStyle.glow}`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${categoryStyle.iconBg} ${categoryStyle.text}`}
              >
                <StatIcon name={statistic.icon} className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-semibold">
                  {formatLargeNumber(count, count >= 100_000)}
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  {statistic.sinceOpenedLabel}
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
