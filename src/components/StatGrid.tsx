import { Hourglass } from "lucide-react";
import { StatCard } from "./StatCard";
import { getCategoryStyle } from "../lib/categoryStyles";
import { getHighlightStatistics, groupStatisticsByCategory } from "../lib/grouping";
import { getBalancedGridClass } from "../lib/layout";
import type { CountryDataset, Statistic, TimeScale } from "../types/statistic";

interface StatGridProps {
  dataset: CountryDataset;
  statistics: Statistic[];
  openedAt: number;
  now: number;
  timeScale: TimeScale;
  highlightedStatisticId?: string | null;
  onOpenStatistic: (statistic: Statistic) => void;
}

export function StatGrid({
  dataset,
  statistics,
  openedAt,
  now,
  timeScale,
  highlightedStatisticId,
  onOpenStatistic,
}: StatGridProps) {
  if (dataset.status === "coming-soon") {
    return (
      <section className="rounded-xl border border-dashed border-border bg-card p-8 text-center shadow-subtle">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
          <Hourglass className="h-5 w-5" aria-hidden="true" />
        </div>
        <h2 className="mt-4 text-xl font-semibold">{dataset.name} is coming soon</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          The country data structure is ready, but Phase 1 only ships realistic global placeholder
          estimates. This keeps the MVP honest while leaving a clean path for regional datasets.
        </p>
      </section>
    );
  }

  if (statistics.length === 0) {
    return (
      <section className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground shadow-subtle">
        No statistics match those filters.
      </section>
    );
  }

  const highlights = getHighlightStatistics(statistics);
  const highlightIds = new Set(highlights.map((statistic) => statistic.id));
  const groupedStatistics = groupStatisticsByCategory(
    statistics.filter((statistic) => !highlightIds.has(statistic.id)),
  );

  return (
    <div className="space-y-6">
      {highlights.length > 0 && (
        <section>
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Start here</p>
              <h2 className="text-xl font-semibold tracking-normal">Highlights</h2>
            </div>
            <span className="text-sm text-muted-foreground">{highlights.length} signals</span>
          </div>
          <div className={getBalancedGridClass(highlights.length)}>
            {highlights.map((statistic) => (
              <StatCard
                key={statistic.id}
                statistic={statistic}
                openedAt={openedAt}
                now={now}
                timeScale={timeScale}
                isHighlighted={highlightedStatisticId === statistic.id}
                showCategory={true} // ← SHOW category here since cards are mixed
                onOpen={onOpenStatistic}
              />
            ))}
          </div>
        </section>
      )}

      {groupedStatistics.map((group) => {
        const categoryStyle = getCategoryStyle(group.category);

        return (
          <section key={group.category}>
            <div className="mb-3 flex items-end justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className={`h-8 w-1 rounded-full ${categoryStyle.line}`} />
                <div>
                  <h2 className="text-xl font-semibold tracking-normal">{group.category}</h2>
                  <p className="text-sm text-muted-foreground">
                    {group.total > group.statistics.length
                      ? `${group.statistics.length} of ${group.total} shown`
                      : `${group.total} questions`}
                  </p>
                </div>
              </div>
            </div>
            <div className={getBalancedGridClass(group.statistics.length)}>
              {group.statistics.map((statistic) => (
                <StatCard
                  key={statistic.id}
                  statistic={statistic}
                  openedAt={openedAt}
                  now={now}
                  timeScale={timeScale}
                  isHighlighted={highlightedStatisticId === statistic.id}
                  showCategory={false} // ← HIDE category here, section header already says it
                  onOpen={onOpenStatistic}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}