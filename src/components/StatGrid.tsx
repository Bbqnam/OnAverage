import { Hourglass } from "lucide-react";
import { StatCard } from "./StatCard";
import { getCategoryStyle } from "../lib/categoryStyles";
import { groupStatisticsByCategory } from "../lib/grouping";
import { getBalancedGridClass } from "../lib/layout";
import type { CountryDataset, Statistic, TimeScale } from "../types/statistic";

interface StatGridProps {
  dataset: CountryDataset;
  statistics: Statistic[];
  openedAt: number;
  now: number;
  timeScale: TimeScale;
  highlightedStatisticId?: string | null;
  favorites?: string[];
  onOpenStatistic: (statistic: Statistic) => void;
  onToggleFavorite?: (id: string) => void;
}

export function StatGrid({
  dataset,
  statistics,
  openedAt,
  now,
  timeScale,
  highlightedStatisticId,
  favorites = [],
  onOpenStatistic,
  onToggleFavorite,
}: StatGridProps) {
  if (dataset.status === "coming-soon") {
    return (
      <section className="rounded-lg border border-dashed border-border bg-card p-6 text-center shadow-subtle">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
          <Hourglass className="h-5 w-5" aria-hidden="true" />
        </div>
        <h2 className="mt-3 text-lg font-semibold">{dataset.name} is coming soon</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          The country data structure is ready, but Phase 1 only ships realistic global placeholder
          estimates. This keeps the MVP honest while leaving a clean path for regional datasets.
        </p>
      </section>
    );
  }

  if (statistics.length === 0) {
    return (
      <section className="rounded-lg border border-border bg-card p-6 text-center text-sm text-muted-foreground shadow-subtle">
        No statistics match those filters.
      </section>
    );
  }

  const groupedStatistics = groupStatisticsByCategory(statistics);

  function renderCard(statistic: Statistic, showCat: boolean) {
    return (
      <StatCard
        key={statistic.id}
        statistic={statistic}
        openedAt={openedAt}
        now={now}
        timeScale={timeScale}
        isHighlighted={highlightedStatisticId === statistic.id}
        showCategory={showCat}
        isFavorite={favorites.includes(statistic.id)}
        onOpen={onOpenStatistic}
        onToggleFavorite={onToggleFavorite}
      />
    );
  }

  return (
    <div className="space-y-9">
      {groupedStatistics.map((group) => {
        const categoryStyle = getCategoryStyle(group.category);

        return (
          <section key={group.category}>
            <div className="mb-3 flex items-end justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className={`h-9 w-1 rounded-full ${categoryStyle.line}`} />
                <div>
                  <h2 className="text-xl font-semibold tracking-[-0.025em]">{group.category}</h2>
                  <p className="text-xs text-muted-foreground">
                    {group.total > group.statistics.length
                      ? `${group.statistics.length} of ${group.total} shown`
                      : `${group.total} signals`}
                  </p>
                </div>
              </div>
            </div>
            <div className={getBalancedGridClass(group.statistics.length)}>
              {group.statistics.map((statistic) => renderCard(statistic, false))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
