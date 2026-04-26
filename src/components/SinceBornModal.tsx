import { Baby, X } from "lucide-react";
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

const featuredIds = [
  "people-born",
  "people-died",
  "internet-searches",
  "flights-taking-off",
  "co2-emitted",
  "trees-cut-down",
  "coffee-consumed",
  "messages-sent",
  "ai-prompts-asked",
  "car-journeys",
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

  const featured = featuredIds
    .map((id) => statistics.find((s) => s.id === id))
    .filter((s): s is Statistic => Boolean(s));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-xl border border-border bg-background shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <Baby className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold">Since I was born</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground transition hover:bg-accent"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          <p className="text-sm text-muted-foreground">
            Enter your birth year to see cumulative totals since you arrived on Earth.
          </p>

          <div className="mt-4 flex items-center gap-3">
            <input
              type="number"
              value={inputYear}
              onChange={(e) => setInputYear(e.target.value)}
              placeholder="e.g. 1995"
              min={1900}
              max={currentYear}
              className="w-36 rounded-lg border border-border bg-background px-3 py-2 text-sm tabular-nums shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            {isValidYear && (
              <button
                type="button"
                onClick={() => onSaveBirthYear(year)}
                className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition hover:opacity-90"
              >
                Save year
              </button>
            )}
          </div>

          {isValidYear && (
            <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {featured.map((stat) => {
                const total = calculateSinceBorn(stat.yearlyEstimate, year);
                return (
                  <div
                    key={stat.id}
                    className="rounded-lg border border-border bg-card p-3"
                  >
                    <p className="text-xs text-muted-foreground">{stat.title}</p>
                    <p className="mt-1 text-xl font-semibold tabular-nums text-foreground">
                      {formatLargeNumber(total, total >= 100_000)}
                    </p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      {stat.sinceOpenedLabel}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {!isValidYear && inputYear.length >= 4 && (
            <p className="mt-3 text-xs text-rose-500">
              Please enter a year between 1900 and {currentYear}.
            </p>
          )}
        </div>

        <div className="border-t border-border px-5 py-3">
          <p className="text-[11px] text-muted-foreground">
            Totals are cumulative estimates based on yearly averages — not precise historical records.
          </p>
        </div>
      </div>
    </div>
  );
}
