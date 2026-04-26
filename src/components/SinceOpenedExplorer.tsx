import { useEffect, useMemo, useState } from "react";
import { Activity, Sparkles } from "lucide-react";
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

const SECONDS_PER_YEAR = 31_556_952;
const FACT_ROTATION_MS = 35_000;

function getSingularUnit(unit: string) {
  return unit.endsWith("s") ? unit.slice(0, -1) : unit;
}

function createInterestingFact(statistic: Statistic) {
  const perSecond = statistic.yearlyEstimate / SECONDS_PER_YEAR;
  const secondsPerEvent = perSecond > 0 ? 1 / perSecond : 0;

  if (!Number.isFinite(secondsPerEvent) || secondsPerEvent <= 0) {
    return "The world keeps moving at an average pace";
  }

  if (secondsPerEvent < 1) {
    return `About ${formatLargeNumber(perSecond, perSecond >= 100_000)} ${
      statistic.unit
    } every second`;
  }

  return `About 1 ${getSingularUnit(statistic.unit)} every ${formatLargeNumber(
    secondsPerEvent,
  )} seconds`;
}

export function SinceOpenedExplorer({
  statistics,
  openedAt,
  now,
  mode,
  onModeChange,
  onOpenStatistic,
}: SinceOpenedExplorerProps) {
  const [factIndex, setFactIndex] = useState(0);
  const highlights = getSinceOpenedHighlights(statistics, mode);

  useEffect(() => {
    if (highlights.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setFactIndex((currentIndex) => (currentIndex + 1) % highlights.length);
    }, FACT_ROTATION_MS);

    return () => window.clearInterval(intervalId);
  }, [highlights.length]);

  useEffect(() => {
    setFactIndex(0);
  }, [mode]);

  const totalSinceOpened = highlights.reduce(
    (total, statistic) =>
      total + calculateSincePageLoad(statistic.yearlyEstimate, openedAt, now),
    0,
  );

  const factStatistic = highlights[factIndex % highlights.length] ?? highlights[0];

  const interestingFact = useMemo(
    () => createInterestingFact(factStatistic),
    [factStatistic],
  );

  if (highlights.length === 0) {
    return null;
  }

  const factCategoryStyle = getCategoryStyle(factStatistic.category);

  return (
    <section className="rounded-lg border border-border bg-card p-3 text-card-foreground shadow-subtle">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
            <Activity className="h-4 w-4" aria-hidden="true" />
          </div>

          <div>
            <h2 className="text-sm font-semibold">Since you opened</h2>
            <p className="text-xs text-muted-foreground">
              A few moving snapshots from the world.
            </p>
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

      <div className="mt-3 grid gap-2 md:grid-cols-1">
<div className="rounded-md border border-primary/20 bg-primary/5 px-3 py-3 flex flex-col items-center justify-center text-center">    <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
      Total movement
    </p>
    <p className="mt-1 text-sm text-muted-foreground">
      <strong className="text-lg text-foreground">
        {formatLargeNumber(totalSinceOpened, totalSinceOpened >= 100_000)}
      </strong>{" "}
      modeled events since you opened
    </p>
  </div>
</div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {highlights.map((statistic) => {
          const count = calculateSincePageLoad(
            statistic.yearlyEstimate,
            openedAt,
            now,
          );
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
