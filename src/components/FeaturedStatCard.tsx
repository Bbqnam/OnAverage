import { useEffect, useMemo, useState } from "react";
import { StatIcon } from "./StatIcon";
import { DataModeBadge } from "./DataModeBadge";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { getRateForScale } from "../lib/calculations";
import { getCategoryStyle } from "../lib/categoryStyles";
import { getDisplayedConfidence } from "../lib/confidence";
import { getCumulativeValue, getTimelineLabel } from "../lib/timeline";
import { cleanDisplayText, formatLargeNumber, formatRate } from "../lib/formatting";
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

function getTimelineDisplay(statistic: Statistic, openedAt: number, now: number) {
  const selectedStartDate = new Date(openedAt);
  const currentDate = new Date(now);

  return {
    cumulative: getCumulativeValue(statistic, selectedStartDate, currentDate),
    timelineLabel: getTimelineLabel(statistic, selectedStartDate, currentDate),
  };
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
      (poolStatistic) =>
        !HERO_EXCLUDED_IDS.has(poolStatistic.id) &&
        !getCumulativeValue(poolStatistic, new Date(openedAt)).isUnavailable,
    );
  }, [openedAt, rotationStatistics, statistic, supportingStatistics]);

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
  const { cumulative, timelineLabel } = getTimelineDisplay(activeStatistic, openedAt, now);
  const displayedConfidence = getDisplayedConfidence(activeStatistic);

  return (
    <section
      className={`relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-subtle ${categoryStyle.leftBorder}`}
    >
      <div className="grid gap-0 xl:grid-cols-[minmax(0,0.75fr)_minmax(380px,1.25fr)]">
        <button
          type="button"
          onClick={() => onOpen(activeStatistic)}
          className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-3 px-3 py-3 text-left transition hover:bg-accent/30 sm:grid-cols-[auto_minmax(0,1fr)_auto]"
        >
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${categoryStyle.iconBg} ${categoryStyle.text}`}
          >
            <StatIcon name={activeStatistic.icon} className="h-4 w-4" />
          </div>

          <div className="min-w-0 flex-1">
            <p
              className={`text-[10px] font-semibold uppercase tracking-widest ${categoryStyle.text}`}
            >
              Random average
            </p>
            <h2 className="truncate text-base font-semibold leading-snug sm:text-lg">
              {cleanDisplayText(activeStatistic.title)}
            </h2>
            <p className="truncate text-xs text-muted-foreground">
              {cleanDisplayText(activeStatistic.shortDescription)}
            </p>
          </div>

          <div className="col-span-2 min-w-0 text-left sm:col-span-1 sm:text-right">
            <p className="text-2xl font-semibold tabular-nums leading-none text-foreground/90">
              {cumulative.isUnavailable
                ? "Not available"
                : formatLargeNumber(cumulative.value, cumulative.value >= 100_000)}
            </p>
            {cumulative.isUnavailable ? (
              <p className="mt-0.5 text-xs text-muted-foreground">
                Not available before {activeStatistic.startYear}
              </p>
            ) : timelineLabel ? (
              <p
                className={`mt-0.5 text-[11px] ${categoryStyle.text} opacity-60`}
                title={`This metric is only counted from when it realistically became available (${activeStatistic.startYear})`}
              >
                {timelineLabel}
              </p>
            ) : null}
            <p className="mt-0.5 text-xs text-muted-foreground">
              {getRateText(activeStatistic, timeScale)}
            </p>
            <div className="mt-1 flex justify-start gap-1.5 sm:justify-end">
              <ConfidenceBadge
                confidence={displayedConfidence.confidence}
                title={displayedConfidence.tooltip}
              />
              <DataModeBadge dataMode={activeStatistic.dataMode} />
            </div>
          </div>
        </button>

        {dashboardStats.supporting.length > 0 && (
          <div className="grid min-w-0 grid-cols-2 gap-1.5 border-t border-border p-2.5 md:grid-cols-3 xl:border-l xl:border-t-0">
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
  const { cumulative, timelineLabel } = getTimelineDisplay(statistic, openedAt, now);

  return (
    <button
      type="button"
      onClick={() => onOpen(statistic)}
      className={`flex min-w-0 items-center gap-2 rounded-md border border-border/70 bg-background/50 px-2 py-1.5 text-left transition hover:bg-accent ${
        cumulative.isUnavailable ? "opacity-40 grayscale" : ""
      }`}
      aria-label={`Open ${statistic.title} details`}
    >
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${categoryStyle.iconBg} ${categoryStyle.text}`}
      >
        <StatIcon name={statistic.icon} className="h-3.5 w-3.5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs text-muted-foreground">
          {cleanDisplayText(statistic.shortTitle)}
        </p>
        <p className="truncate text-sm font-semibold tabular-nums text-foreground">
          {cumulative.isUnavailable
            ? "Not available"
            : formatLargeNumber(cumulative.value, cumulative.value >= 100_000)}
        </p>
        {cumulative.isUnavailable ? (
          <p className="truncate text-[11px] text-muted-foreground">
            Not available before {statistic.startYear}
          </p>
        ) : timelineLabel ? (
          <p
            className={`truncate text-[11px] ${categoryStyle.text} opacity-60`}
            title={`This metric is only counted from when it realistically became available (${statistic.startYear})`}
          >
            {timelineLabel}
          </p>
        ) : null}
        <p className="truncate text-[11px] text-muted-foreground">
          {getRateText(statistic, timeScale)}
        </p>
      </div>
    </button>
  );
}
