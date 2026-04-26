import { X } from "lucide-react";
import { useState } from "react";
import { calculateSinceBorn } from "../lib/calculations";
import { formatLargeNumber } from "../lib/formatting";
import type { Statistic } from "../types/statistic";

interface SinceBornModalProps {
  statistics: Statistic[];
  birthYear: number | null;
  onClose: () => void;
  onSaveBirthYear: (year: number) => void;
}

const featuredCards = [
  { id: "people-born",        emoji: "👶", label: "babies born",           color: "bg-emerald-50 dark:bg-emerald-950/40", num: "text-emerald-700 dark:text-emerald-300", border: "border-emerald-200 dark:border-emerald-800/50" },
  { id: "people-died",        emoji: "🕊️", label: "people passed away",    color: "bg-slate-50 dark:bg-slate-950/40",   num: "text-slate-600 dark:text-slate-300",   border: "border-slate-200 dark:border-slate-700/50" },
  { id: "internet-searches",  emoji: "🔍", label: "internet searches",     color: "bg-violet-50 dark:bg-violet-950/40", num: "text-violet-700 dark:text-violet-300", border: "border-violet-200 dark:border-violet-800/50" },
  { id: "flights-taking-off", emoji: "✈️", label: "flights took off",      color: "bg-blue-50 dark:bg-blue-950/40",     num: "text-blue-700 dark:text-blue-300",     border: "border-blue-200 dark:border-blue-800/50" },
  { id: "co2-emitted",        emoji: "🌫️", label: "tonnes of CO₂ emitted", color: "bg-zinc-50 dark:bg-zinc-950/40",     num: "text-zinc-600 dark:text-zinc-300",     border: "border-zinc-200 dark:border-zinc-700/50" },
  { id: "trees-cut-down",     emoji: "🌲", label: "trees cut down",        color: "bg-teal-50 dark:bg-teal-950/40",     num: "text-teal-700 dark:text-teal-300",     border: "border-teal-200 dark:border-teal-800/50" },
  { id: "coffee-consumed",    emoji: "☕", label: "cups of coffee",        color: "bg-amber-50 dark:bg-amber-950/40",   num: "text-amber-700 dark:text-amber-300",   border: "border-amber-200 dark:border-amber-800/50" },
  { id: "messages-sent",      emoji: "💬", label: "messages sent",         color: "bg-sky-50 dark:bg-sky-950/40",       num: "text-sky-700 dark:text-sky-300",       border: "border-sky-200 dark:border-sky-800/50" },
  { id: "ai-prompts-asked",   emoji: "🤖", label: "AI prompts asked",      color: "bg-purple-50 dark:bg-purple-950/40", num: "text-purple-700 dark:text-purple-300", border: "border-purple-200 dark:border-purple-800/50" },
  { id: "car-journeys",       emoji: "🚗", label: "car journeys made",     color: "bg-orange-50 dark:bg-orange-950/40", num: "text-orange-700 dark:text-orange-300", border: "border-orange-200 dark:border-orange-800/50" },
];

export function SinceBornModal({
  statistics,
  birthYear,
  onClose,
  onSaveBirthYear,
}: SinceBornModalProps) {
  const [inputYear, setInputYear] = useState(birthYear ? String(birthYear) : "");
  const currentYear = new Date().getFullYear();
  const year = Number(inputYear);
  const isValidYear = year >= 1900 && year <= currentYear;
  const yearsElapsed = isValidYear ? currentYear - year : 0;

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
              <span className="text-sm text-muted-foreground">
                That's <span className="font-semibold text-foreground">{yearsElapsed} years</span> of Earth
              </span>
            )}
          </div>
          {!isValidYear && inputYear.length >= 4 && (
            <p className="mt-2 text-xs text-rose-500">Please enter a year between 1900 and {currentYear}.</p>
          )}
        </div>

        {/* Card grid — scrollable */}
        <div className="overflow-y-auto p-4">
          {isValidYear ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {featuredCards.map((def) => {
                const stat = statistics.find((s) => s.id === def.id);
                if (!stat) return null;
                const total = calculateSinceBorn(stat.yearlyEstimate, year);
                const formatted = formatLargeNumber(total, total >= 10_000);

                return (
                  <div
                    key={def.id}
                    className={`flex flex-col gap-2 rounded-xl border p-4 ${def.color} ${def.border}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl leading-none">{def.emoji}</span>
                    </div>
                    <div>
                      <p className={`text-2xl font-bold tabular-nums leading-tight ${def.num}`}>
                        {formatted}
                      </p>
                      <p className="mt-0.5 text-xs font-medium text-foreground">{def.label}</p>
                    </div>
                  </div>
                );
              })}
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
            Cumulative estimates based on yearly averages — not precise historical records.
          </p>
        </div>
      </div>
    </div>
  );
}
