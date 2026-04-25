import {
  CalendarDays,
  CalendarRange,
  Clock,
  Clock3,
  ExternalLink,
  Globe2,
  LineChart,
  Sprout,
  Timer,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { DataModeBadge } from "./DataModeBadge";
import { StatIcon } from "./StatIcon";
import { getCategoryStyle } from "../lib/categoryStyles";
import {
  yearlyToPerDay,
  yearlyToPerHour,
  yearlyToPerMinute,
  yearlyToPerSecond,
} from "../lib/calculations";
import { formatLargeNumber } from "../lib/formatting";
import type { Statistic } from "../types/statistic";

interface StatDetailDrawerProps {
  statistic: Statistic | null;
  onClose: () => void;
}

type StatVisualVariant = "bar" | "flight" | "flow" | "line" | "pulse" | "ripple" | "signal";

function getStatVisualVariant(statistic: Statistic): StatVisualVariant {
  const searchText =
    `${statistic.id} ${statistic.category} ${statistic.icon} ${statistic.tags.join(" ")}`.toLowerCase();

  if (/flight|aviation|takeoff|landing|passenger|plane/.test(searchText)) return "flight";
  if (/stock|crypto|trading|market|payment|purchase|ecommerce|sales|money/.test(searchText))
    return "line";
  if (/co2|carbon|climate|tree|forest|plastic|waste|renewable|energy|environment/.test(searchText))
    return "bar";
  if (/birth|babies|population|death|mortality|marriage|school|earthquake|storm/.test(searchText))
    return "ripple";
  if (/internet|email|message|video|app|social|ai|technology|download/.test(searchText))
    return "signal";
  if (/crime|emergency|hospital|health|society|safety/.test(searchText)) return "pulse";

  return statistic.category === "Travel" ? "flight" : "flow";
}

function confidenceLabel(statistic: Statistic): string {
  if (statistic.confidence === "high") return "Based on a strong institutional data series";
  if (statistic.confidence === "medium")
    return "Grounded in public reporting, may be rounded";
  return statistic.isFuzzyEstimate
    ? "Directional or playful estimate — useful for curiosity"
    : "Source coverage is incomplete or not globally standardized";
}

function StatHeroVisual({ statistic }: { statistic: Statistic }) {
  const categoryStyle = getCategoryStyle(statistic.category);
  const variant = getStatVisualVariant(statistic);
  const visualId = `stat-visual-${statistic.id}`;

  return (
    <div
      className={`relative mt-4 h-32 overflow-hidden rounded-xl border ${categoryStyle.border} bg-background/65 sm:h-36`}
      aria-hidden="true"
    >
      <div className={`absolute inset-0 ${categoryStyle.iconBg}`} />
      <div className={`absolute inset-0 ${categoryStyle.text}`}>
        {variant === "flight" && (
          <svg className="h-full w-full" viewBox="0 0 640 160" preserveAspectRatio="none">
            <path
              d="M28 116 C 148 34 252 48 356 96 S 512 130 612 42"
              fill="none"
              stroke="currentColor"
              strokeDasharray="8 13"
              strokeLinecap="round"
              strokeOpacity="0.22"
              strokeWidth="2"
            />
            <path
              d="M40 120 C 174 18 315 128 596 48"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeOpacity="0.42"
              strokeWidth="3"
            />
            <circle r="5" fill="currentColor" opacity="0.72">
              <animateMotion
                dur="5.8s"
                repeatCount="indefinite"
                path="M40 120 C 174 18 315 128 596 48"
              />
            </circle>
            <circle r="3.5" fill="currentColor" opacity="0.5">
              <animateMotion
                begin="1.8s"
                dur="5.8s"
                repeatCount="indefinite"
                path="M40 120 C 174 18 315 128 596 48"
              />
            </circle>
          </svg>
        )}

        {variant === "line" && (
          <svg className="h-full w-full" viewBox="0 0 640 160" preserveAspectRatio="none">
            <path d="M36 42 H604" stroke="currentColor" strokeOpacity="0.08" />
            <path d="M36 82 H604" stroke="currentColor" strokeOpacity="0.08" />
            <path d="M36 122 H604" stroke="currentColor" strokeOpacity="0.08" />
            <path
              className="stat-visual-line"
              d="M44 118 C 96 86 124 100 166 78 S 250 46 298 76 S 378 126 434 84 S 528 42 596 54"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity="0.7"
              strokeWidth="4"
            />
            <path
              className="stat-visual-line stat-visual-line-soft"
              d="M44 130 C 112 116 148 72 212 92 S 312 132 386 108 S 512 72 596 88"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity="0.26"
              strokeWidth="3"
            />
            <circle r="4.5" fill="currentColor" opacity="0.7">
              <animateMotion
                dur="6s"
                repeatCount="indefinite"
                path="M44 118 C 96 86 124 100 166 78 S 250 46 298 76 S 378 126 434 84 S 528 42 596 54"
              />
            </circle>
          </svg>
        )}

        {variant === "bar" && (
          <svg className="h-full w-full" viewBox="0 0 640 160" preserveAspectRatio="none">
            <defs>
              <linearGradient id={`${visualId}-bar-gradient`} x1="0" x2="0" y1="1" y2="0">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.08" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.58" />
              </linearGradient>
            </defs>
            {[84, 148, 212, 276, 340, 404, 468, 532].map((x, index) => (
              <rect
                key={x}
                className={`stat-visual-bar stat-visual-bar-${(index % 4) + 1}`}
                x={x}
                y={42 - index * 2}
                width="38"
                height={86 + index * 2}
                rx="10"
                fill={`url(#${visualId}-bar-gradient)`}
              />
            ))}
          </svg>
        )}

        {variant === "ripple" && (
          <svg className="h-full w-full" viewBox="0 0 640 160" preserveAspectRatio="none">
            <circle cx="320" cy="80" r="12" fill="currentColor" opacity="0.2" />
            <circle
              className="stat-visual-ripple stat-visual-ripple-1"
              cx="320"
              cy="80"
              r="24"
            />
            <circle
              className="stat-visual-ripple stat-visual-ripple-2"
              cx="320"
              cy="80"
              r="38"
            />
            <circle
              className="stat-visual-ripple stat-visual-ripple-3"
              cx="320"
              cy="80"
              r="52"
            />
            <circle
              className="stat-visual-pop-dot stat-visual-pop-dot-1"
              cx="194"
              cy="70"
              r="5"
            />
            <circle
              className="stat-visual-pop-dot stat-visual-pop-dot-2"
              cx="444"
              cy="54"
              r="4"
            />
            <circle
              className="stat-visual-pop-dot stat-visual-pop-dot-3"
              cx="476"
              cy="112"
              r="5"
            />
          </svg>
        )}

        {variant === "pulse" && (
          <svg className="h-full w-full" viewBox="0 0 640 160" preserveAspectRatio="none">
            <path d="M36 80 H604" stroke="currentColor" strokeOpacity="0.11" strokeWidth="2" />
            <path
              className="stat-visual-pulse"
              d="M42 84 H136 L166 84 L190 48 L226 118 L254 84 H322 L348 66 L380 100 L414 84 H598"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity="0.66"
              strokeWidth="4"
            />
            <circle
              className="stat-visual-pop-dot stat-visual-pop-dot-2"
              cx="190"
              cy="48"
              r="5"
            />
            <circle
              className="stat-visual-pop-dot stat-visual-pop-dot-3"
              cx="380"
              cy="100"
              r="4"
            />
          </svg>
        )}

        {variant === "signal" && (
          <svg className="h-full w-full" viewBox="0 0 640 160" preserveAspectRatio="none">
            {[100, 180, 260, 340, 420, 500].map((x, index) => (
              <rect
                key={x}
                className={`stat-visual-signal stat-visual-signal-${(index % 3) + 1}`}
                x={x}
                y={58 - index * 2}
                width="34"
                height={44 + index * 5}
                rx="9"
                fill="currentColor"
                opacity="0.22"
              />
            ))}
            <path
              d="M46 104 C 154 74 206 120 304 86 S 454 50 594 78"
              fill="none"
              stroke="currentColor"
              strokeDasharray="4 15"
              strokeLinecap="round"
              strokeOpacity="0.34"
              strokeWidth="4"
            />
            <circle
              className="stat-visual-stream-dot stat-visual-stream-dot-1"
              cx="86"
              cy="102"
              r="5"
            />
            <circle
              className="stat-visual-stream-dot stat-visual-stream-dot-2"
              cx="274"
              cy="90"
              r="4"
            />
            <circle
              className="stat-visual-stream-dot stat-visual-stream-dot-3"
              cx="462"
              cy="62"
              r="5"
            />
          </svg>
        )}

        {variant === "flow" && (
          <svg className="h-full w-full" viewBox="0 0 640 160" preserveAspectRatio="none">
            <path
              d="M56 54 H584 M56 84 H584 M56 114 H584"
              stroke="currentColor"
              strokeLinecap="round"
              strokeOpacity="0.15"
              strokeWidth="2"
            />
            <circle
              className="stat-visual-stream-dot stat-visual-stream-dot-1"
              cx="116"
              cy="54"
              r="5"
            />
            <circle
              className="stat-visual-stream-dot stat-visual-stream-dot-2"
              cx="272"
              cy="84"
              r="5"
            />
            <circle
              className="stat-visual-stream-dot stat-visual-stream-dot-3"
              cx="428"
              cy="114"
              r="5"
            />
            <circle
              className="stat-visual-pop-dot stat-visual-pop-dot-1"
              cx="522"
              cy="84"
              r="4"
            />
          </svg>
        )}
      </div>
      <div
        className={`absolute bottom-3 right-3 flex h-12 w-12 items-center justify-center rounded-full ${categoryStyle.iconBg} ${categoryStyle.text} ring-1 ring-current/10`}
      >
        <StatIcon name={statistic.icon} className="h-5 w-5" />
      </div>
    </div>
  );
}

export function StatDetailDrawer({ statistic, onClose }: StatDetailDrawerProps) {
  const [methodologyOpen, setMethodologyOpen] = useState(false);

  useEffect(() => {
    if (!statistic) return;
    setMethodologyOpen(false);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, statistic]);

  if (!statistic) return null;

  const categoryStyle = getCategoryStyle(statistic.category);

  const conversions = [
    {
      label: "Per second",
      sublabel: "every second",
      value: yearlyToPerSecond(statistic.yearlyEstimate),
      icon: Clock3,
      style: "text-blue-400 bg-blue-500/10",
    },
    {
      label: "Per minute",
      sublabel: "every minute",
      value: yearlyToPerMinute(statistic.yearlyEstimate),
      icon: Timer,
      style: "text-emerald-400 bg-emerald-500/10",
    },
    {
      label: "Per hour",
      sublabel: "every hour",
      value: yearlyToPerHour(statistic.yearlyEstimate),
      icon: Clock,
      style: "text-violet-400 bg-violet-500/10",
    },
    {
      label: "Per day",
      sublabel: "every day",
      value: yearlyToPerDay(statistic.yearlyEstimate),
      icon: CalendarDays,
      style: "text-orange-400 bg-orange-500/10",
    },
    {
      label: "Per year",
      sublabel: "the seed value",
      value: statistic.yearlyEstimate,
      icon: CalendarRange,
      style: `${categoryStyle.iconBg} ${categoryStyle.text}`,
    },
  ] as const;

  return (
    <div
      className="fixed inset-0 z-50 flex min-h-dvh items-start justify-center overflow-y-auto bg-background/75 p-2 backdrop-blur-md sm:p-4 lg:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="stat-drawer-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="my-auto max-h-[calc(100vh-1rem)] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card/95 p-4 text-card-foreground shadow-panel dark:bg-[#07101d]/95 sm:max-h-[calc(100vh-2rem)] sm:p-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${categoryStyle.iconBg} ${categoryStyle.text}`}
            >
              <StatIcon name={statistic.icon} className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className={`text-xs font-semibold uppercase tracking-widest ${categoryStyle.text}`}>
                {statistic.category}
              </p>
              <h2
                id="stat-drawer-title"
                className="mt-0.5 text-xl font-semibold leading-snug sm:text-2xl"
              >
                {statistic.title}
              </h2>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <DataModeBadge dataMode={statistic.dataMode} />
                {statistic.sensitivity === "Sensitive" && (
                  <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
                    Contextual topic
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-background/70 text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
            aria-label="Close details"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Hero visual — kept exactly as original */}
        <StatHeroVisual statistic={statistic} />

        {/* Description */}
        <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
          {statistic.description}
        </p>

        {/* Context note */}
        {statistic.contextNote && (
          <p className="mt-2 text-xs italic leading-5 text-muted-foreground/70">
            {statistic.contextNote}
          </p>
        )}

        {/* Converted averages */}
        <div className="mt-5">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Converted averages
          </h3>
          <div className="overflow-hidden rounded-xl border border-border bg-background/70">
            {conversions.map((conversion) => {
              const Icon = conversion.icon;
              return (
                <div
                  key={conversion.label}
                  className="flex items-center justify-between gap-3 border-b border-border px-3 py-2.5 last:border-b-0"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${conversion.style}`}
                    >
                      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    </div>
                    <span className="text-sm font-medium">{conversion.label}</span>
                  </div>
                  <span className="text-sm font-semibold tabular-nums">
                    {formatLargeNumber(conversion.value, conversion.value >= 10_000)}{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      {statistic.unit}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info row: source + confidence + yearly seed */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Source */}
          <div
            className={`rounded-xl border ${categoryStyle.border} ${categoryStyle.iconBg} p-3`}
          >
            <div className="mb-1 flex items-center gap-1.5">
              <Globe2 className={`h-3.5 w-3.5 ${categoryStyle.text}`} aria-hidden="true" />
              <p
                className={`text-[10px] font-semibold uppercase tracking-wider ${categoryStyle.text}`}
              >
                Source
              </p>
            </div>
            {statistic.sourceUrl ? (
              <a
                href={statistic.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-foreground hover:underline"
              >
                <span className="line-clamp-2">{statistic.sourceName}</span>
                <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
              </a>
            ) : (
              <p className="line-clamp-2 text-xs font-medium">{statistic.sourceName}</p>
            )}
          </div>

          {/* Confidence */}
          <div className="rounded-xl border border-border bg-background/70 p-3">
            <div className="mb-1 flex items-center justify-between gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Confidence
              </p>
              <ConfidenceBadge confidence={statistic.confidence} />
            </div>
            <p className="text-xs leading-4 text-muted-foreground">
              {confidenceLabel(statistic)}
            </p>
          </div>

          {/* Yearly seed */}
          <div className="rounded-xl border border-border bg-background/70 p-3">
            <div className="mb-1 flex items-center gap-1.5">
              <Sprout className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Yearly seed
              </p>
            </div>
            <p className="text-lg font-semibold tabular-nums">
              {formatLargeNumber(statistic.yearlyEstimate, true)}
            </p>
            <p className="text-xs text-muted-foreground">{statistic.unit}</p>
          </div>
        </div>

        {/* Methodology — collapsed by default */}
        <div className="mt-3 overflow-hidden rounded-xl border border-border">
          <button
            type="button"
            onClick={() => setMethodologyOpen((o) => !o)}
            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-accent/50"
          >
            <div className="flex items-center gap-2">
              <LineChart className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <span className="text-sm font-medium">How is this calculated?</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {methodologyOpen ? "Hide" : "Show"}
            </span>
          </button>
          {methodologyOpen && (
            <div className="border-t border-border px-4 py-3">
              <p className="text-sm leading-6 text-muted-foreground">{statistic.methodology}</p>
            </div>
          )}
        </div>

      </section>
    </div>
  );
}