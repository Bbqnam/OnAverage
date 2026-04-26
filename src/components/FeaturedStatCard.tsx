import { useEffect, useMemo, useState } from "react";
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
  rotationStatistics?: Statistic[];
  onOpen: (statistic: Statistic) => void;
}

const ROTATION_MS = 45_000;
const SUPPORTING_STAT_COUNT = 6;
const EMPTY_SUPPORTING_STATS: Statistic[] = [];
const HERO_EXCLUDED_IDS = new Set([
  "asteroids-passing-earth",
  "satellites-orbiting-earth",
]);

function uniqueStats(stats: Statistic[]) {
  return stats.filter(
    (stat, index, array) =>
      array.findIndex((other) => other.id === stat.id) === index,
  );
}

function getDisplayValue(statistic: Statistic, openedAt: number, now: number) {
  return calculateSincePageLoad(statistic.yearlyEstimate, openedAt, now);
}

function getRateText(statistic: Statistic, timeScale: TimeScale) {
  return formatRate(
    getRateForScale(statistic.yearlyEstimate, timeScale),
    statistic.unit,
    timeScale,
  );
}

function shuffleStats(stats: Statistic[]) {
  return [...stats].sort(() => Math.random() - 0.5);
}

function createDashboardStats(pool: Statistic[], fallback: Statistic, previousMainId?: string) {
  const usablePool = pool.length > 0 ? pool : [fallback];
  const mainPool =
    usablePool.length > 1
      ? usablePool.filter((statistic) => statistic.id !== previousMainId)
      : usablePool;
  const main = shuffleStats(mainPool)[0] ?? usablePool[0] ?? fallback;
  const supporting = shuffleStats(
    usablePool.filter((statistic) => statistic.id !== main.id),
  ).slice(0, SUPPORTING_STAT_COUNT);

  return { main, supporting };
}

export function FeaturedStatCard({
  statistic,
  openedAt,
  now,
  timeScale,
  supportingStatistics = EMPTY_SUPPORTING_STATS,
  rotationStatistics = [],
  onOpen,
}: FeaturedStatCardProps) {
  const randomPool = useMemo(() => {
    const basePool =
      rotationStatistics.length > 0
        ? rotationStatistics
        : [statistic, ...supportingStatistics];

    return uniqueStats(basePool).filter(
      (poolStatistic) => !HERO_EXCLUDED_IDS.has(poolStatistic.id),
    );
  }, [rotationStatistics, statistic, supportingStatistics]);

  const [dashboardStats, setDashboardStats] = useState(() =>
    createDashboardStats(randomPool, statistic),
  );

  useEffect(() => {
    setDashboardStats(createDashboardStats(randomPool, statistic));
  }, [randomPool, statistic]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setDashboardStats((currentDashboardStats) =>
        createDashboardStats(randomPool, statistic, currentDashboardStats.main.id),
      );
    }, ROTATION_MS);

    return () => window.clearInterval(intervalId);
  }, [randomPool, statistic]);

  const activeStatistic = dashboardStats.main;
  const categoryStyle = getCategoryStyle(activeStatistic.category);
  const displayValue = getDisplayValue(activeStatistic, openedAt, now);

  return (
    <section
      className={`relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-subtle ${categoryStyle.leftBorder}`}
    >
      <div className="grid gap-0 xl:grid-cols-[minmax(0,0.82fr)_minmax(420px,1.18fr)]">
        <button
          type="button"
          onClick={() => onOpen(activeStatistic)}
          className="flex min-w-0 items-center gap-3 px-4 py-4 text-left transition hover:bg-accent/30 sm:gap-4"
        >
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${categoryStyle.iconBg} ${categoryStyle.text}`}
          >
            <StatIcon name={activeStatistic.icon} className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <p
              className={`text-[10px] font-semibold uppercase tracking-widest ${categoryStyle.text}`}
            >
              Random live fact
            </p>
            <h2 className="truncate text-lg font-semibold leading-snug sm:text-xl">
              {activeStatistic.title}
            </h2>
            <p className="truncate text-xs text-muted-foreground sm:text-sm">
              {activeStatistic.shortDescription}
            </p>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-2xl font-semibold tabular-nums text-foreground/90 sm:text-3xl">
              {formatLargeNumber(displayValue, displayValue >= 100_000)}
            </p>
            <p className="text-xs text-muted-foreground sm:text-sm">
              {getRateText(activeStatistic, timeScale)}
            </p>
            <div className="mt-1 flex justify-end gap-1.5">
              <ConfidenceBadge confidence={activeStatistic.confidence} />
              <DataModeBadge dataMode={activeStatistic.dataMode} />
            </div>
          </div>
        </button>

        {dashboardStats.supporting.length > 0 && (
          <div className="grid min-w-0 grid-cols-2 gap-2 border-t border-border p-3 md:grid-cols-3 xl:border-l xl:border-t-0">
            {dashboardStats.supporting.map((supportingStatistic) => (
              <SupportingStatButton
                key={supportingStatistic.id}
                statistic={supportingStatistic}
                openedAt={openedAt}
                now={now}
                timeScale={timeScale}
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
  timeScale: TimeScale;
  onOpen: (statistic: Statistic) => void;
}

function SupportingStatButton({
  statistic,
  openedAt,
  now,
  timeScale,
  onOpen,
}: SupportingStatButtonProps) {
  const categoryStyle = getCategoryStyle(statistic.category);
  const displayValue = getDisplayValue(statistic, openedAt, now);

  return (
    <button
      type="button"
      onClick={() => onOpen(statistic)}
      className="flex min-w-0 items-center gap-2 rounded-md border border-border/70 bg-background/50 px-2.5 py-2 text-left transition hover:bg-accent"
      aria-label={`Open ${statistic.title} details`}
    >
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${categoryStyle.iconBg} ${categoryStyle.text}`}
      >
        <StatIcon name={statistic.icon} className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs text-muted-foreground">
          {statistic.shortTitle}
        </p>
        <p className="truncate text-base font-semibold tabular-nums text-foreground">
          {formatLargeNumber(displayValue, displayValue >= 100_000)}
        </p>
        <p className="truncate text-[11px] text-muted-foreground">
          {getRateText(statistic, timeScale)}
        </p>
      </div>
    </button>
  );
}
