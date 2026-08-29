import {
  ArrowLeftRight,
  Baby,
  Camera,
  ChevronRight,
  Globe2,
  Shuffle,
  Sparkles,
} from "lucide-react";

type ActivePanel = "none" | "myworld" | "compare" | "snapshot";

interface DashboardHeroProps {
  countryName: string;
  signalCount: number;
  categoryCount: number;
  favoritesCount: number;
  activePanel: ActivePanel;
  onSurprise: () => void;
  onOpenSinceBorn: () => void;
  onTogglePanel: (panel: Exclude<ActivePanel, "none">) => void;
}

const panelActions = [
  { id: "myworld", label: "My World", icon: Globe2 },
  { id: "compare", label: "Compare", icon: ArrowLeftRight },
  { id: "snapshot", label: "Share", icon: Camera },
] as const;

export function DashboardHero({
  countryName,
  signalCount,
  categoryCount,
  favoritesCount,
  activePanel,
  onSurprise,
  onOpenSinceBorn,
  onTogglePanel,
}: DashboardHeroProps) {
  return (
    <section className="hero-surface relative overflow-hidden rounded-[1.5rem] border border-border/80 bg-card text-card-foreground shadow-panel">
      <div className="hero-grid" aria-hidden="true" />
      <div className="relative grid gap-7 px-5 py-7 sm:px-8 sm:py-9 lg:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)] lg:items-end lg:px-10 lg:py-11">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            The world in motion
          </div>

          <h2 className="max-w-2xl text-balance text-4xl font-semibold leading-[1.04] tracking-[-0.045em] text-foreground sm:text-5xl lg:text-[3.65rem]">
            See the scale of everyday life.
          </h2>
          <p className="mt-4 max-w-2xl text-pretty text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
            OnAverage turns annual research into human-scale, live-feeling counters—so global change becomes easier to understand at a glance.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onSurprise}
              className="button-lift inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_-12px_hsl(var(--primary)/0.7)] transition hover:brightness-110"
            >
              <Shuffle className="h-4 w-4" aria-hidden="true" />
              Surprise me
              <ChevronRight className="h-4 w-4 opacity-70" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onOpenSinceBorn}
              className="button-lift inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-background/70 px-4 text-sm font-medium text-foreground shadow-subtle transition hover:border-primary/30 hover:bg-accent"
            >
              <Baby className="h-4 w-4 text-primary" aria-hidden="true" />
              Since I was born
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-background/55 p-2.5 shadow-[inset_0_1px_0_hsl(var(--foreground)/0.04)] backdrop-blur-sm">
          <div className="grid grid-cols-3 gap-1.5">
            <Metric value={String(signalCount)} label="signals" />
            <Metric value={String(categoryCount)} label="categories" />
            <Metric value={favoritesCount > 0 ? String(favoritesCount) : "—"} label="saved" />
          </div>

          <div className="my-2.5 h-px bg-border/80" />

          <p className="px-1.5 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Your workspace
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            {panelActions.map(({ id, label, icon: Icon }) => {
              const isActive = activePanel === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onTogglePanel(id)}
                  className={`flex min-w-0 flex-col items-center justify-center gap-1.5 rounded-xl border px-2 py-3 text-xs font-medium transition ${
                    isActive
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-transparent text-muted-foreground hover:border-border hover:bg-card hover:text-foreground"
                  }`}
                  aria-pressed={isActive}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span className="truncate">{label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-2 flex items-center gap-2 rounded-xl border border-border/70 bg-card/60 px-3 py-2 text-[11px] text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
            Exploring {countryName} averages
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-border/70 bg-card/70 px-2 py-3 text-center">
      <p className="text-xl font-semibold tabular-nums tracking-tight text-foreground">{value}</p>
      <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
