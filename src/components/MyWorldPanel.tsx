import { Globe, Star, X } from "lucide-react";
import { StatCard } from "./StatCard";
import type { Statistic, TimeScale } from "../types/statistic";

interface MyWorldPanelProps {
  statistics: Statistic[];
  myWorldIds: string[];
  favorites: string[];
  openedAt: number;
  now: number;
  timeScale: TimeScale;
  onOpen: (statistic: Statistic) => void;
  onToggleFavorite: (id: string) => void;
  onToggleMyWorld: (id: string) => void;
  onClose: () => void;
}

export function MyWorldPanel({
  statistics,
  myWorldIds,
  favorites,
  openedAt,
  now,
  timeScale,
  onOpen,
  onToggleFavorite,
  onToggleMyWorld,
  onClose,
}: MyWorldPanelProps) {
  const myWorldStats = myWorldIds
    .map((id) => statistics.find((s) => s.id === id))
    .filter((s): s is Statistic => Boolean(s));

  const favoriteStats = favorites
    .map((id) => statistics.find((s) => s.id === id))
    .filter((s): s is Statistic => Boolean(s));

  const isEmpty = myWorldStats.length === 0;

  return (
    <div className="rounded-xl border border-border bg-card shadow-subtle">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
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
      <div className="p-4">
        {isEmpty ? (
          <div className="rounded-lg border border-dashed border-border py-8 text-center">
            <Globe className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm font-medium text-muted-foreground">
              Your custom dashboard is empty
            </p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              Click the ⊕ on any card to pin up to 10 signals here.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {myWorldStats.map((stat) => (
              <StatCard
                key={stat.id}
                statistic={stat}
                openedAt={openedAt}
                now={now}
                timeScale={timeScale}
                isFavorite={favorites.includes(stat.id)}
                isInMyWorld
                onOpen={onOpen}
                onToggleFavorite={onToggleFavorite}
                onToggleMyWorld={onToggleMyWorld}
              />
            ))}
          </div>
        )}

        {/* Favorites section */}
        {favoriteStats.length > 0 && (
          <div className="mt-5">
            <div className="mb-2 flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 text-amber-400" fill="currentColor" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Favorites
              </h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {favoriteStats.map((stat) => (
                <StatCard
                  key={stat.id}
                  statistic={stat}
                  openedAt={openedAt}
                  now={now}
                  timeScale={timeScale}
                  isFavorite
                  isInMyWorld={myWorldIds.includes(stat.id)}
                  onOpen={onOpen}
                  onToggleFavorite={onToggleFavorite}
                  onToggleMyWorld={onToggleMyWorld}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-border px-4 py-2.5">
        <p className="text-[11px] text-muted-foreground">
          Preferences are saved locally in your browser.
        </p>
      </div>
    </div>
  );
}
