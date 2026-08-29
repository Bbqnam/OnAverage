import { useEffect, useState } from "react";
import { Activity } from "lucide-react";
import { DataModeBadge } from "./DataModeBadge";
import { StatIcon } from "./StatIcon";
import { getCategoryStyle } from "../lib/categoryStyles";
import { getSinceOpenedHighlights, type SinceOpenedMode } from "../lib/discovery";
import { formatLargeNumber } from "../lib/formatting";
import { getCumulativeValue, getTimelineLabel } from "../lib/timeline";
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

function createMovementContext(total: number) {
  if (total >= 8_000_000_000) {
    return "More events than there are people on Earth.";
  }

  if (total >= 38_000_000) {
    return "Roughly a greater Tokyo metro area of events.";
  }

  if (total >= 8_500_000) {
    return "About a New York City of events.";
  }

  if (total >= 1_600_000) {
    return "About a Philadelphia of events.";
  }

  if (total >= 100_000) {
    return "Enough events to fill a large stadium.";
  }

  if (total >= 10_000) {
    return "A small town's worth of events.";
  }

  return "The counter starts small, then compounds quickly.";
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
  const selectedStartDate = new Date(openedAt);
  const currentDate = new Date(now);
  const highlights = getSinceOpenedHighlights(statistics, mode).filter(
    (statistic) =>
      !getCumulativeValue(statistic, selectedStartDate, currentDate).isUnavailable,
  );

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
      total + getCumulativeValue(statistic, selectedStartDate, currentDate).value,
    0,
  );

  if (highlights.length === 0) {
    return null;
  }

  const factStatistic = highlights[factIndex % highlights.length] ?? highlights[0];
  const interestingFact = createInterestingFact(factStatistic);
  const movementContext = createMovementContext(totalSinceOpened);
  return (
    <section className="rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-subtle sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Activity className="h-4 w-4" aria-hidden="true" />
          </div>

          <div>
            <h2 className="text-base font-semibold tracking-tight">Since you opened</h2>
            <p className="text-xs text-muted-foreground">
              A few moving snapshots from the world.
            </p>
          </div>
        </div>

        <div className="flex w-max rounded-lg border border-border bg-background p-0.5">
          {(["mixed", "live"] as SinceOpenedMode[]).map((option) => {
            const isSelected = option === mode;

            return (
              <button
                key={option}
                type="button"
                onClick={() => onModeChange(option)}
                className={`h-8 rounded-md px-2.5 text-xs font-medium transition ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
                aria-pressed={isSelected}
              >
                  {option === "mixed" ? "Mixed" : "Source-backed"}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex flex-col items-center justify-center rounded-xl border border-primary/20 bg-primary/5 px-4 py-5 text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Total movement
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            <strong className="text-xl font-semibold tracking-tight text-foreground">
              {formatLargeNumber(totalSinceOpened, totalSinceOpened >= 100_000)}
            </strong>{" "}
            modeled events since you opened
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {movementContext}
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground/70">
            {interestingFact}
          </p>
        </div>
      </div>

      <div className="mt-3 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
        {highlights.map((statistic) => {
          const cumulative = getCumulativeValue(statistic, selectedStartDate, currentDate);
          const timelineLabel = getTimelineLabel(statistic, selectedStartDate, currentDate);
          const categoryStyle = getCategoryStyle(statistic.category);

          return (
            <button
              key={statistic.id}
              type="button"
              onClick={() => onOpenStatistic(statistic)}
              className={`flex items-center gap-3 rounded-xl border border-border bg-background/70 px-3 py-2.5 text-left transition hover:-translate-y-0.5 ${categoryStyle.hover} ${categoryStyle.glow}`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${categoryStyle.iconBg} ${categoryStyle.text}`}
              >
                <StatIcon name={statistic.icon} className="h-3.5 w-3.5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  {formatLargeNumber(cumulative.value, cumulative.value >= 100_000)}
                </p>
                {timelineLabel && (
                  <p
                    className={`truncate text-[11px] ${categoryStyle.text} opacity-60`}
                    title={`This metric is only counted from when it realistically became available (${statistic.startYear})`}
                  >
                    {timelineLabel}
                  </p>
                )}
                <p className="truncate text-xs text-muted-foreground">
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
