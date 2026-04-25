import { ArrowUpRight } from "lucide-react";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { DataModeBadge } from "./DataModeBadge";
import { StatIcon } from "./StatIcon";
import { calculateSincePageLoad, getRateForScale } from "../lib/calculations";
import { getCategoryStyle } from "../lib/categoryStyles";
import { formatLargeNumber, formatRate } from "../lib/formatting";
import type { Statistic, TimeScale } from "../types/statistic";

interface StatCardProps {
  statistic: Statistic;
  openedAt: number;
  now: number;
  timeScale: TimeScale;
  isHighlighted?: boolean;
  onOpen: (statistic: Statistic) => void;
}

export function StatCard({
  statistic,
  openedAt,
  now,
  timeScale,
  isHighlighted = false,
  onOpen,
}: StatCardProps) {
  const sinceOpened = calculateSincePageLoad(statistic.yearlyEstimate, openedAt, now);
  const selectedRate = getRateForScale(statistic.yearlyEstimate, timeScale);
  const categoryStyle = getCategoryStyle(statistic.category);

  return (
    <article
      className={`group relative overflow-hidden rounded-lg border bg-card p-3 text-card-foreground shadow-subtle transition duration-200 hover:-translate-y-0.5 ${categoryStyle.hover} ${categoryStyle.glow} ${
        isHighlighted ? `${categoryStyle.border} ring-2 ring-primary/30` : "border-border"
      }`}
    >
      <div className={`absolute inset-x-0 top-0 z-10 h-0.5 ${categoryStyle.line}`} />
      <CategoryMotionCue category={statistic.category} toneClass={categoryStyle.text} />
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${categoryStyle.iconBg} ${categoryStyle.text}`}
          >
            {statistic.category === "Life" && (
              <span className="stat-life-pulse absolute inset-1 rounded-full bg-current" />
            )}
            <StatIcon name={statistic.icon} className="relative z-10 h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold tracking-normal">{statistic.title}</h2>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {statistic.shortDescription}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onOpen(statistic)}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
          aria-label={`Open ${statistic.title} details`}
          title={`Open ${statistic.title} details`}
        >
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>

      <div className="relative z-10 mt-4">
        <p className="text-[11px] font-medium uppercase text-muted-foreground">
          Since you opened
        </p>
        <p className="count-pop mt-1 truncate text-2xl font-semibold tracking-normal text-foreground/78">
          {formatLargeNumber(sinceOpened, sinceOpened >= 100_000)}
        </p>
      </div>

      <div className="relative z-10 mt-3 rounded-md border border-border bg-background/70 px-2.5 py-1.5">
        <p className="truncate text-xs font-medium text-muted-foreground">
          {formatRate(selectedRate, statistic.unit, timeScale)}
        </p>
      </div>

      <div className="relative z-10 mt-2.5 flex flex-wrap gap-1.5">
        <ConfidenceBadge confidence={statistic.confidence} />
        <DataModeBadge dataMode={statistic.dataMode} />
      </div>
    </article>
  );
}

interface CategoryMotionCueProps {
  category: Statistic["category"];
  toneClass: string;
}

function CategoryMotionCue({ category, toneClass }: CategoryMotionCueProps) {
  if (category === "Travel") {
    return (
      <div className={`stat-cue stat-cue-travel ${toneClass}`} aria-hidden="true">
        <span />
      </div>
    );
  }

  if (category === "Technology") {
    return <div className={`stat-cue stat-cue-technology ${toneClass}`} aria-hidden="true" />;
  }

  if (category === "Money") {
    return (
      <div className={`stat-cue stat-cue-money ${toneClass}`} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
    );
  }

  if (category === "Environment") {
    return (
      <div className={`stat-cue stat-cue-environment ${toneClass}`} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    );
  }

  return null;
}
