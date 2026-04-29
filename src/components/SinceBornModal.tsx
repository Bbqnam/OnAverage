import { ChevronDown, Sparkles, X } from "lucide-react";
import { useMemo, useState } from "react";
import { categories } from "../data/categories";
import { getCategoryStyle } from "../lib/categoryStyles";
import { formatLargeNumber } from "../lib/formatting";
import {
  getBornBeforeNarrative,
  getCumulativeValue,
  getTimelineLabel,
} from "../lib/timeline";
import { StatIcon } from "./StatIcon";
import type { Statistic } from "../types/statistic";

interface SinceBornModalProps {
  statistics: Statistic[];
  birthYear: number | null;
  onClose: () => void;
  onSaveBirthYear: (year: number) => void;
}

const categoryOrder = new Map(categories.map((category, index) => [category, index]));

const curatedHighlightGroups = [
  {
    label: "Life scale",
    ids: ["people-born", "people-died", "meals-eaten", "coffee-consumed"],
  },
  {
    label: "Planet & movement",
    ids: ["co2-emitted", "trees-cut-down", "flights-taking-off"],
  },
  {
    label: "Digital life",
    ids: ["internet-searches", "messages-sent", "ai-prompts-asked"],
  },
];

const curatedHighlightIds = curatedHighlightGroups.flatMap((group) => group.ids);

function getTimelineGroup(statistic: Statistic, selectedStartDate: Date, now: Date): number {
  const elapsed = getCumulativeValue(statistic, selectedStartDate, now);
  if (elapsed.isUnavailable) return 2;
  if (elapsed.wasClamped) return 1;
  return 0;
}

export function SinceBornModal({
  statistics,
  birthYear,
  onClose,
  onSaveBirthYear,
}: SinceBornModalProps) {
  const [inputYear, setInputYear] = useState(birthYear ? String(birthYear) : "");
  const [showAll, setShowAll] = useState(false);
  const now = new Date();
  const currentYear = now.getFullYear();
  const year = Number(inputYear);
  const isValidYear = year >= 1800 && year <= currentYear;
  const yearsElapsed = isValidYear ? currentYear - year : 0;
  const selectedStartDate = isValidYear ? new Date(year, 0, 1) : null;
  const sortedStatistics = useMemo(() => {
    if (!selectedStartDate) return [];

    return statistics
      .map((statistic, index) => ({ statistic, index }))
      .sort((a, b) => {
        const groupDiff =
          getTimelineGroup(a.statistic, selectedStartDate, now) -
          getTimelineGroup(b.statistic, selectedStartDate, now);
        if (groupDiff !== 0) return groupDiff;

        const categoryDiff =
          (categoryOrder.get(a.statistic.category) ?? 0) -
          (categoryOrder.get(b.statistic.category) ?? 0);
        if (categoryDiff !== 0) return categoryDiff;

        return a.index - b.index;
      })
      .map(({ statistic }) => statistic);
  }, [isValidYear, selectedStartDate, now, statistics]);

  const curatedGroups = useMemo(() => {
    if (!selectedStartDate) return [];

    return curatedHighlightGroups
      .map((group) => ({
        ...group,
        statistics: group.ids
          .flatMap((id) => {
            const statistic = statistics.find((item) => item.id === id);

            if (!statistic) return [];

            return getCumulativeValue(statistic, selectedStartDate, now).isUnavailable
              ? []
              : [statistic];
          }),
      }))
      .filter((group) => group.statistics.length > 0);
  }, [now, selectedStartDate, statistics]);

  const hiddenSignalCount = Math.max(0, sortedStatistics.length - curatedHighlightIds.length);

  const hasClampedSignals =
    selectedStartDate !== null &&
    sortedStatistics.some(
      (statistic) =>
        getCumulativeValue(statistic, selectedStartDate, now).wasClamped,
    );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-xl">
              🌍
            </div>
            <div>
              <h2 className="text-base font-semibold">Since I was born</h2>
              <p className="text-xs text-muted-foreground">Cumulative totals since you arrived on Earth</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Year input */}
        <div className="border-b border-border px-5 py-4">
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={inputYear}
              onChange={(e) => setInputYear(e.target.value)}
              placeholder="Your birth year, e.g. 1995"
              min={1900}
              max={currentYear}
              className="w-52 rounded-lg border border-border bg-background px-3 py-2 text-sm tabular-nums shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            {isValidYear && (
              <button
                type="button"
                onClick={() => onSaveBirthYear(year)}
                className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
              >
                Save year
              </button>
            )}
            {isValidYear && (
              <div className="min-w-0 text-sm text-muted-foreground">
                <p>
                  That's <span className="font-semibold text-foreground">{yearsElapsed} years</span> of Earth
                </p>
                {hasClampedSignals && (
                  <p className="mt-0.5 text-xs text-muted-foreground/80">
                    Some metrics counted from their start date, not your birth year.
                  </p>
                )}
              </div>
            )}
          </div>
          {!isValidYear && inputYear.length >= 4 && (
            <p className="mt-2 text-xs text-rose-500">Please enter a year between 1800 and {currentYear}.</p>
          )}
        </div>

        {/* Card grid, scrollable */}
        <div className="overflow-y-auto p-4">
          {isValidYear && selectedStartDate ? (
            <div className="space-y-4">
              <div className="flex flex-col gap-2 rounded-lg border border-border bg-secondary/30 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">
                      {showAll ? "All signals" : "Curated highlights"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {showAll
                        ? "Full catalog, sorted by availability and category."
                        : "10 hand picked counters with the most human scale."}
                    </p>
                  </div>
                </div>
                {hiddenSignalCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowAll((current) => !current)}
                    className="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-xs font-medium text-foreground transition hover:bg-accent"
                  >
                    {showAll ? "Show highlights" : `Show all ${sortedStatistics.length}`}
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition ${showAll ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />
                  </button>
                )}
              </div>

              {!showAll ? (
                curatedGroups.map((group) => (
                  <section key={group.label} className="space-y-2">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      {group.label}
                    </h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {group.statistics.map((stat) => (
                        <SinceBornCard
                          key={stat.id}
                          statistic={stat}
                          selectedStartDate={selectedStartDate}
                          now={now}
                          birthYear={year}
                        />
                      ))}
                    </div>
                  </section>
                ))
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {sortedStatistics.map((stat) => (
                    <SinceBornCard
                      key={stat.id}
                      statistic={stat}
                      selectedStartDate={selectedStartDate}
                      now={now}
                      birthYear={year}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="text-5xl">🌍</span>
              <p className="mt-4 text-sm font-medium text-foreground">Enter your birth year above</p>
              <p className="mt-1 text-xs text-muted-foreground">
                See how much has happened on Earth since you got here.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-5 py-2.5">
          <p className="text-[11px] text-muted-foreground/60">
            Cumulative estimates are clamped to each signal's realistic start date.
          </p>
        </div>
      </div>
    </div>
  );
}

interface SinceBornCardProps {
  statistic: Statistic;
  selectedStartDate: Date;
  now: Date;
  birthYear: number;
}

function SinceBornCard({
  statistic,
  selectedStartDate,
  now,
  birthYear,
}: SinceBornCardProps) {
  const timeline = getCumulativeValue(statistic, selectedStartDate, now);
  const timelineLabel = getTimelineLabel(statistic, selectedStartDate, now);
  const narrative = getBornBeforeNarrative(statistic, birthYear);
  const categoryStyle = getCategoryStyle(statistic.category);
  const formatted = formatLargeNumber(timeline.value, timeline.value >= 10_000);

  return (
    <div
      className={`flex min-w-0 flex-col gap-2 rounded-lg border border-y border-r bg-card p-3 ${categoryStyle.leftBorder} ${
        timeline.isUnavailable ? "opacity-40 grayscale" : ""
      }`}
    >
      <div className="flex items-center gap-2">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${categoryStyle.iconBg} ${categoryStyle.text}`}
        >
          <StatIcon name={statistic.icon} className="h-3.5 w-3.5" />
        </div>
        <p className="truncate text-xs font-medium text-muted-foreground">
          {statistic.shortTitle}
        </p>
      </div>
      <div className="min-w-0">
        <p className={`truncate text-2xl font-bold tabular-nums leading-tight ${categoryStyle.text}`}>
          {timeline.isUnavailable ? "Not available" : formatted}
        </p>
        {timeline.isUnavailable ? (
          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
            Not available before {statistic.startYear}
          </p>
        ) : timelineLabel ? (
          <p
            className={`mt-0.5 truncate text-[11px] ${categoryStyle.text} opacity-60`}
            title={`This metric is only counted from when it realistically became available (${statistic.startYear})`}
          >
            {timelineLabel}
          </p>
        ) : null}
        {narrative && (
          <p
            className="mt-0.5 truncate text-[11px] italic text-muted-foreground"
            title={narrative}
          >
            {narrative}
          </p>
        )}
        <p className="mt-0.5 truncate text-xs font-medium text-foreground">
          {statistic.sinceOpenedLabel}
        </p>
      </div>
    </div>
  );
}
