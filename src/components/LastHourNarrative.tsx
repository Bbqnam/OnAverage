import { Clock, RefreshCw } from "lucide-react";
import { useMemo } from "react";
import { yearlyToPerHour } from "../lib/calculations";
import { formatLargeNumber } from "../lib/formatting";
import type { Statistic } from "../types/statistic";

interface LastHourNarrativeProps {
  statistics: Statistic[];
}

const narrativeIds = [
  "people-born",
  "people-died",
  "flights-taking-off",
  "internet-searches",
  "messages-sent",
  "co2-emitted",
  "trees-cut-down",
  "coffee-consumed",
  "books-sold",
  "ai-prompts-asked",
];

function fmt(n: number): string {
  return formatLargeNumber(n, n >= 10_000);
}

function buildNarrative(stats: Statistic[]): string {
  const byId: Record<string, number> = {};
  for (const s of stats) {
    byId[s.id] = yearlyToPerHour(s.yearlyEstimate);
  }

  const sentences: string[] = [];

  if (byId["people-born"] && byId["people-died"]) {
    sentences.push(
      `In the last hour, **${fmt(byId["people-born"])} babies were born** and **${fmt(byId["people-died"])} people passed away** — a net addition of ${fmt(byId["people-born"] - byId["people-died"])} people to Earth.`,
    );
  } else if (byId["people-born"]) {
    sentences.push(`**${fmt(byId["people-born"])} babies were born** in the last hour.`);
  }

  if (byId["flights-taking-off"]) {
    sentences.push(
      `**${fmt(byId["flights-taking-off"])} flights** took off somewhere in the world.`,
    );
  }

  if (byId["internet-searches"]) {
    sentences.push(
      `Humans made **${fmt(byId["internet-searches"])} internet searches** — roughly ${fmt(byId["internet-searches"] / 3600)} every second.`,
    );
  }

  if (byId["messages-sent"]) {
    sentences.push(`**${fmt(byId["messages-sent"])} messages** were sent.`);
  }

  if (byId["ai-prompts-asked"]) {
    sentences.push(`**${fmt(byId["ai-prompts-asked"])} AI prompts** were asked.`);
  }

  if (byId["co2-emitted"]) {
    sentences.push(
      `**${fmt(byId["co2-emitted"])} tonnes of CO₂** were emitted into the atmosphere.`,
    );
  }

  if (byId["coffee-consumed"]) {
    sentences.push(`**${fmt(byId["coffee-consumed"])} cups of coffee** were consumed.`);
  }

  if (sentences.length === 0) {
    return "Loading narrative…";
  }

  return sentences.join(" ");
}

function RichText({ text }: { text: string }) {
  // Split on ** pairs and render bold segments
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-foreground">
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

export function LastHourNarrative({ statistics }: LastHourNarrativeProps) {
  const featured = useMemo(
    () => statistics.filter((s) => narrativeIds.includes(s.id)),
    [statistics],
  );

  const narrative = useMemo(() => buildNarrative(featured), [featured]);
  const sentences = narrative.split(". ").filter(Boolean);

  return (
    <div className="rounded-xl border border-border bg-card px-4 py-4 shadow-subtle">
      {/* Header */}
      <div className="mb-3 flex items-center gap-2">
        <Clock className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold">What happened in the last hour?</h2>
        <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
          Average estimates
        </span>
      </div>

      <div className="space-y-2">
        {sentences.map((sentence, i) => (
          <p key={i} className="text-sm leading-relaxed text-muted-foreground">
            <RichText text={sentence + (sentence.endsWith(".") ? "" : ".")} />
          </p>
        ))}
      </div>

      <p className="mt-3 text-[11px] text-muted-foreground/60">
        All figures are derived from average annual estimates — not live feeds.
      </p>
    </div>
  );
}
