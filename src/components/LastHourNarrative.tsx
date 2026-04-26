import {
  Baby,
  Bot,
  Cloud,
  Coffee,
  Plane,
  Search,
  TreePine,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import { useMemo } from "react";
import { yearlyToPerHour } from "../lib/calculations";
import { formatLargeNumber } from "../lib/formatting";
import type { Statistic } from "../types/statistic";

interface LastHourNarrativeProps {
  statistics: Statistic[];
}

interface NarrativeCard {
  id: string;
  icon: LucideIcon;
  emoji: string;
  label: string;
  sublabel: string;
  color: string;
  iconBg: string;
  iconColor: string;
  numberColor: string;
  value: number;
}

const cardDefs: Array<{
  id: string;
  icon: LucideIcon;
  emoji: string;
  label: string;
  sublabel: string;
  color: string;
  iconBg: string;
  iconColor: string;
  numberColor: string;
}> = [
  {
    id: "people-born",
    icon: Baby,
    emoji: "👶",
    label: "babies born",
    sublabel: "new humans arrived",
    color: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/50",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/50",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    numberColor: "text-emerald-700 dark:text-emerald-300",
  },
  {
    id: "flights-taking-off",
    icon: Plane,
    emoji: "✈️",
    label: "flights took off",
    sublabel: "somewhere on Earth",
    color: "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/50",
    iconBg: "bg-blue-100 dark:bg-blue-900/50",
    iconColor: "text-blue-600 dark:text-blue-400",
    numberColor: "text-blue-700 dark:text-blue-300",
  },
  {
    id: "internet-searches",
    icon: Search,
    emoji: "🔍",
    label: "internet searches",
    sublabel: "questions asked online",
    color: "bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-800/50",
    iconBg: "bg-violet-100 dark:bg-violet-900/50",
    iconColor: "text-violet-600 dark:text-violet-400",
    numberColor: "text-violet-700 dark:text-violet-300",
  },
  {
    id: "messages-sent",
    icon: MessageCircle,
    emoji: "💬",
    label: "messages sent",
    sublabel: "texts, chats & DMs",
    color: "bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/50",
    iconBg: "bg-sky-100 dark:bg-sky-900/50",
    iconColor: "text-sky-600 dark:text-sky-400",
    numberColor: "text-sky-700 dark:text-sky-300",
  },
  {
    id: "ai-prompts-asked",
    icon: Bot,
    emoji: "🤖",
    label: "AI prompts",
    sublabel: "asked to machines",
    color: "bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/50",
    iconBg: "bg-purple-100 dark:bg-purple-900/50",
    iconColor: "text-purple-600 dark:text-purple-400",
    numberColor: "text-purple-700 dark:text-purple-300",
  },
  {
    id: "co2-emitted",
    icon: Cloud,
    emoji: "🌫️",
    label: "tonnes of CO₂",
    sublabel: "emitted into atmosphere",
    color: "bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/50",
    iconBg: "bg-slate-100 dark:bg-slate-900/50",
    iconColor: "text-slate-500 dark:text-slate-400",
    numberColor: "text-slate-600 dark:text-slate-300",
  },
  {
    id: "coffee-consumed",
    icon: Coffee,
    emoji: "☕",
    label: "cups of coffee",
    sublabel: "consumed worldwide",
    color: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/50",
    iconBg: "bg-amber-100 dark:bg-amber-900/50",
    iconColor: "text-amber-600 dark:text-amber-400",
    numberColor: "text-amber-700 dark:text-amber-300",
  },
  {
    id: "trees-cut-down",
    icon: TreePine,
    emoji: "🌲",
    label: "trees cut down",
    sublabel: "lost from forests",
    color: "bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800/50",
    iconBg: "bg-teal-100 dark:bg-teal-900/50",
    iconColor: "text-teal-600 dark:text-teal-400",
    numberColor: "text-teal-700 dark:text-teal-300",
  },
];

export function LastHourNarrative({ statistics }: LastHourNarrativeProps) {
  const cards: NarrativeCard[] = useMemo(() => {
    return cardDefs
      .map((def) => {
        const stat = statistics.find((s) => s.id === def.id);
        if (!stat) return null;
        return { ...def, value: yearlyToPerHour(stat.yearlyEstimate) };
      })
      .filter((c): c is NarrativeCard => c !== null);
  }, [statistics]);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-subtle">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-xl">
          ⏱️
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            What happened in the last hour?
          </h2>
          <p className="text-xs text-muted-foreground">
            Average estimates — not live feeds
          </p>
        </div>
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-2 divide-x divide-y divide-border sm:grid-cols-4">
        {cards.map((card, i) => {
          const Icon = card.icon;
          const val = card.value;
          const formatted = formatLargeNumber(val, val >= 10_000);

          return (
            <div
              key={card.id}
              className="flex flex-col gap-1.5 p-3 transition-colors hover:bg-accent/30"
            >
              {/* Emoji */}
              <span className="text-xl leading-none">{card.emoji}</span>

              {/* Number + labels */}
              <div>
                <p className={`text-xl font-bold tabular-nums leading-none ${card.numberColor}`}>
                  {formatted}
                </p>
                <p className="mt-0.5 text-xs font-semibold text-foreground">{card.label}</p>
                <p className="text-[11px] text-muted-foreground">{card.sublabel}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div className="border-t border-border px-4 py-2.5">
        <p className="text-[11px] text-muted-foreground/60">
          All figures derived from average annual estimates. Numbers reset every hour.
        </p>
      </div>
    </div>
  );
}
