import { useMemo } from "react";
import { formatLargeNumber } from "../lib/formatting";
import { getCumulativeValue } from "../lib/timeline";
import type { Statistic } from "../types/statistic";

interface LastHourNarrativeProps {
  statistics: Statistic[];
}

interface NarrativeCard {
  id: string;
  emoji: string;
  label: string;
  sublabel: string;
  iconBg: string;
  numberColor: string;
  value: number;
}

const cardDefs: Array<{
  id: string;
  emoji: string;
  label: string;
  sublabel: string;
  iconBg: string;
  numberColor: string;
}> = [
  {
    id: "people-born",
    emoji: "👶",
    label: "babies born",
    sublabel: "new humans arrived",
    iconBg: "bg-emerald-500/10",
    numberColor: "text-emerald-700 dark:text-emerald-300",
  },
  {
    id: "flights-taking-off",
    emoji: "✈️",
    label: "flights took off",
    sublabel: "somewhere on Earth",
    iconBg: "bg-blue-500/10",
    numberColor: "text-blue-700 dark:text-blue-300",
  },
  {
    id: "internet-searches",
    emoji: "🔍",
    label: "internet searches",
    sublabel: "questions asked online",
    iconBg: "bg-violet-500/10",
    numberColor: "text-violet-700 dark:text-violet-300",
  },
  {
    id: "messages-sent",
    emoji: "💬",
    label: "messages sent",
    sublabel: "texts, chats & DMs",
    iconBg: "bg-sky-500/10",
    numberColor: "text-sky-700 dark:text-sky-300",
  },
  {
    id: "ai-prompts-asked",
    emoji: "🤖",
    label: "AI prompts",
    sublabel: "asked to machines",
    iconBg: "bg-purple-500/10",
    numberColor: "text-purple-700 dark:text-purple-300",
  },
  {
    id: "co2-emitted",
    emoji: "🌫️",
    label: "tonnes of CO₂",
    sublabel: "emitted into atmosphere",
    iconBg: "bg-slate-500/10",
    numberColor: "text-slate-600 dark:text-slate-300",
  },
  {
    id: "coffee-consumed",
    emoji: "☕",
    label: "cups of coffee",
    sublabel: "consumed worldwide",
    iconBg: "bg-amber-500/10",
    numberColor: "text-amber-700 dark:text-amber-300",
  },
  {
    id: "trees-cut-down",
    emoji: "🌲",
    label: "trees cut down",
    sublabel: "lost from forests",
    iconBg: "bg-teal-500/10",
    numberColor: "text-teal-700 dark:text-teal-300",
  },
];

export function LastHourNarrative({ statistics }: LastHourNarrativeProps) {
  const cards: NarrativeCard[] = useMemo(() => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    return cardDefs
      .map((def) => {
        const stat = statistics.find((s) => s.id === def.id);
        if (!stat) return null;
        return { ...def, value: getCumulativeValue(stat, oneHourAgo, now).value };
      })
      .filter((c): c is NarrativeCard => c !== null);
  }, [statistics]);

  return (
    <section className="w-full max-w-full overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-subtle sm:p-5">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3 px-0.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg">
          ⏱️
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            What happened in the last hour?
          </h2>
          <p className="text-xs leading-tight text-muted-foreground">
            Average estimates, not live feeds
          </p>
        </div>
      </div>

      {/* Card grid */}
      <div className="grid w-full grid-cols-2 gap-2.5 lg:grid-cols-4">
        {cards.map((card) => {
          const val = card.value;
          const formatted = formatLargeNumber(val, val >= 10_000);

          return (
            <div
              key={card.id}
              className="flex min-w-0 items-center gap-3 rounded-xl border border-border/80 bg-background/50 px-3 py-3 transition hover:-translate-y-0.5 hover:border-primary/20 hover:bg-accent/30"
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base leading-none ${card.iconBg}`}
              >
                {card.emoji}
              </span>
              <div className="min-w-0">
                <p className={`text-lg font-semibold tabular-nums leading-none tracking-tight ${card.numberColor}`}>
                  {formatted}
                </p>
                <p className="mt-0.5 truncate text-[11px] font-semibold leading-tight text-foreground sm:text-xs">
                  {card.label}
                </p>
                <p className="truncate text-[10px] leading-tight text-muted-foreground sm:text-[11px]">
                  {card.sublabel}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div className="mt-3 px-0.5">
        <p className="truncate text-[10px] leading-tight text-muted-foreground/60">
          All figures derived from average annual estimates. Numbers reset every hour.
        </p>
      </div>
    </section>
  );
}
