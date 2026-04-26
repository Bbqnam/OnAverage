import { ArrowLeftRight, X } from "lucide-react";
import { useMemo, useState } from "react";
import { getRateForScale } from "../lib/calculations";
import { formatLargeNumber } from "../lib/formatting";
import { getCategoryStyle } from "../lib/categoryStyles";
import { StatIcon } from "./StatIcon";
import type { Statistic, TimeScale } from "../types/statistic";

interface CompareSignalsProps {
  statistics: Statistic[];
  timeScale: TimeScale;
  onClose: () => void;
}

function StatPicker({
  statistics,
  selected,
  onChange,
  label,
}: {
  statistics: Statistic[];
  selected: Statistic | null;
  onChange: (s: Statistic) => void;
  label: string;
}) {
  const [query, setQuery] = useState("");
  const filtered = statistics.filter((s) =>
    s.title.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      {selected ? (
        <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2">
          <StatIcon name={selected.icon} className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">{selected.title}</span>
          <button
            type="button"
            onClick={() => onChange(selected)}
            className="ml-auto text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a signal…"
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          {query.length > 0 && (
            <ul className="max-h-48 overflow-y-auto rounded-lg border border-border bg-background shadow-md">
              {filtered.slice(0, 20).map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(s);
                      setQuery("");
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent"
                  >
                    <StatIcon name={s.icon} className="h-4 w-4 shrink-0 text-muted-foreground" />
                    {s.title}
                  </button>
                </li>
              ))}
              {filtered.length === 0 && (
                <li className="px-3 py-2 text-xs text-muted-foreground">No results.</li>
              )}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export function CompareSignals({ statistics, timeScale, onClose }: CompareSignalsProps) {
  const [statA, setStatA] = useState<Statistic | null>(null);
  const [statB, setStatB] = useState<Statistic | null>(null);

  const rateA = statA ? getRateForScale(statA.yearlyEstimate, timeScale) : null;
  const rateB = statB ? getRateForScale(statB.yearlyEstimate, timeScale) : null;

  const ratio = useMemo(() => {
    if (!rateA || !rateB || rateA === 0 || rateB === 0) return null;
    const bigger = Math.max(rateA, rateB);
    const smaller = Math.min(rateA, rateB);
    const biggerStat = rateA >= rateB ? statA : statB;
    const smallerStat = rateA >= rateB ? statB : statA;
    const r = bigger / smaller;
    return { r, biggerStat, smallerStat };
  }, [rateA, rateB, statA, statB]);

  const presetPairs: [string, string][] = [
    ["flights-taking-off", "people-born"],
    ["internet-searches", "people-born"],
    ["messages-sent", "coffee-consumed"],
    ["cars-produced", "flights-taking-off"],
  ];

  function applyPreset(aId: string, bId: string) {
    const a = statistics.find((s) => s.id === aId) ?? null;
    const b = statistics.find((s) => s.id === bId) ?? null;
    setStatA(a);
    setStatB(b);
  }

  const styleA = statA ? getCategoryStyle(statA.category) : null;
  const styleB = statB ? getCategoryStyle(statB.category) : null;

  return (
    <div className="rounded-xl border border-border bg-card shadow-subtle">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <ArrowLeftRight className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">Compare two signals</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 text-muted-foreground transition hover:bg-accent"
          aria-label="Close comparison"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="p-4">
        {/* Quick presets */}
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground self-center">Try:</span>
          {presetPairs.map(([a, b]) => {
            const sa = statistics.find((s) => s.id === a);
            const sb = statistics.find((s) => s.id === b);
            if (!sa || !sb) return null;
            return (
              <button
                key={`${a}-${b}`}
                type="button"
                onClick={() => applyPreset(a, b)}
                className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs hover:bg-accent"
              >
                {sa.shortTitle} vs {sb.shortTitle}
              </button>
            );
          })}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <StatPicker
            statistics={statistics}
            selected={statA}
            onChange={() => setStatA(null)}
            label="Signal A"
          />
          <StatPicker
            statistics={statistics}
            selected={statB}
            onChange={() => setStatB(null)}
            label="Signal B"
          />
        </div>

        {/* Result */}
        {statA && statB && rateA !== null && rateB !== null && (
          <div className="mt-5 rounded-xl border border-border bg-muted/30 p-4">
            {/* Side by side rates */}
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { stat: statA, rate: rateA, style: styleA },
                { stat: statB, rate: rateB, style: styleB },
              ].map(({ stat, rate, style }) => (
                <div
                  key={stat.id}
                  className={`rounded-lg border ${style?.leftBorder ?? ""} border-y border-r bg-card p-3`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${style?.iconBg ?? ""} ${style?.text ?? ""}`}
                    >
                      <StatIcon name={stat.icon} className="h-3.5 w-3.5" />
                    </div>
                    <p className="text-sm font-medium">{stat.title}</p>
                  </div>
                  <p className={`mt-2 text-xl font-semibold tabular-nums ${style?.text ?? ""}`}>
                    {formatLargeNumber(rate, rate >= 10_000)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stat.unit} / {timeScale === "year" ? "year" : timeScale}
                  </p>
                </div>
              ))}
            </div>

            {/* Ratio insight */}
            {ratio && (
              <div className="mt-4 rounded-lg bg-primary/5 p-3 text-center">
                <p className="text-sm font-medium text-foreground">
                  For every{" "}
                  <span className="font-bold text-primary">1</span>{" "}
                  {ratio.smallerStat?.unit ?? "event"} of{" "}
                  <span className="font-semibold">{ratio.smallerStat?.title}</span>, there{" "}
                  {ratio.r >= 2 ? "are" : "is"}{" "}
                  <span className="font-bold text-primary">
                    {formatLargeNumber(ratio.r, ratio.r >= 10_000)}
                  </span>{" "}
                  {ratio.biggerStat?.unit ?? "events"} of{" "}
                  <span className="font-semibold">{ratio.biggerStat?.title}</span>.
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Screenshot this — it's the kind of thing worth sharing.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
