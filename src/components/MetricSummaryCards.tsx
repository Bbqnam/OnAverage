import { Activity, BadgeCheck, Database, Globe2, Layers3, Radio } from "lucide-react";
import { categories } from "../data/categories";
import { calculateSincePageLoad } from "../lib/calculations";
import { countFuzzyEstimates } from "../lib/filtering";
import { formatLargeNumber } from "../lib/formatting";
import type { CountryDataset } from "../types/statistic";

interface MetricSummaryCardsProps {
  dataset: CountryDataset;
  filteredCount: number;
  openedAt: number;
  now: number;
}

export function MetricSummaryCards({
  dataset,
  filteredCount,
  openedAt,
  now,
}: MetricSummaryCardsProps) {
  const sinceOpened = dataset.statistics.reduce(
    (total, statistic) => total + calculateSincePageLoad(statistic.yearlyEstimate, openedAt, now),
    0,
  );
  const fuzzyCount = countFuzzyEstimates(dataset.statistics);
  const liveCount = dataset.statistics.filter((s) => s.dataMode !== "estimated").length;
  const highConfidenceCount = dataset.statistics.filter((s) => s.confidence === "high").length;

  const cards = [
    {
      label: "Questions",
      value: dataset.statistics.length.toString(),
      detail: `${filteredCount} showing`,
      icon: Database,
    },
    {
      label: "Categories",
      value: categories.length.toString(),
      detail: `${fuzzyCount} directional`,
      icon: Layers3,
    },
    {
      label: "Live-ish",
      value: liveCount.toString(),
      detail: "live / semi-live",
      icon: Radio,
    },
    {
      label: "High confidence",
      value: highConfidenceCount.toString(),
      detail: "stronger sources",
      icon: BadgeCheck,
    },
    {
      label: "Mode",
      value: dataset.name,
      detail: dataset.status === "available" ? "Live-feeling averages" : "Coming soon",
      icon: Globe2,
    },
    {
      label: "Since opened",
      value: formatLargeNumber(sinceOpened, true),
      detail: "modeled events",
      icon: Activity,
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <article
            key={card.label}
            className="flex min-w-0 items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-2 text-card-foreground shadow-subtle"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[10px] font-medium text-muted-foreground">{card.label}</p>
              <p className="truncate text-base font-semibold leading-tight tracking-normal">
                {card.value}
              </p>
              <p className="truncate text-[10px] text-muted-foreground">{card.detail}</p>
            </div>
          </article>
        );
      })}
    </section>
  );
}
