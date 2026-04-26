import { Globe, X } from "lucide-react";
import { StatCard } from "./StatCard";
import type { Statistic, TimeScale } from "../types/statistic";

interface MyWorldPanelProps {
  statistics: Statistic[];
  favorites: string[];
  openedAt: number;
  now: number;
  timeScale: TimeScale;
  onOpen: (statistic: Statistic) => void;
  onToggleFavorite: (id: string) => void;
  onClose: () => void;
}

export function MyWorldPanel({
  statistics,
  favorites,
  openedAt,
  now,
  timeScale,
  onOpen,
  onToggleFavorite,
  onClose,
}: MyWorldPanelProps) {
  const myWorldStats = favorites
    .map((id) => statistics.find((s) => s.id === id))
    .filter((s): s is Statistic => Boolean(s));

  const isEmpty = myWorldStats.length === 0;

  return (
    <div className="rounded-lg border border-border bg-card shadow-subtle">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">My World</h2>
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
            {myWorldStats.length}/10 signals
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 text-muted-foreground transition hover:bg-accent"
          aria-label="Close My World"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* My World grid */}
      <div className="p-3">
        {isEmpty ? (
          <div className="rounded-lg border border-dashed border-border py-6 text-center">
            <Globe className="mx-auto mb-2 h-7 w-7 text-muted-foreground/40" />
            <p className="text-sm font-medium text-muted-foreground">
              Your custom dashboard is empty
            </p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              Star any card to save it here.
            </p>
          </div>
        ) : (
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {myWorldStats.map((stat) => (
              <StatCard
                key={stat.id}
                statistic={stat}
                openedAt={openedAt}
                now={now}
                timeScale={timeScale}
                isFavorite
                onOpen={onOpen}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-border px-3 py-2">
        <p className="text-[11px] text-muted-foreground">
          Preferences are saved locally in your browser.
        </p>
      </div>
    </div>
  );
}
