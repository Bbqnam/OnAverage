import type { DataMode } from "../types/statistic";
import { formatLabel } from "../lib/formatting";

interface DataModeBadgeProps {
  dataMode: DataMode;
}

const styles: Record<DataMode, string> = {
  live: "border-primary/15 bg-primary/5 text-primary/80",
  "semi-live": "border-sky-500/15 bg-sky-500/5 text-sky-700/80 dark:text-sky-300/80",
  estimated: "border-border bg-muted text-muted-foreground",
};

const tooltips: Record<DataMode, string> = {
  live: "Connected to a live data feed, updates in real time.",
  "semi-live": "Derived from a verified annual figure divided by seconds, ticks live but the base number is periodically updated.",
  estimated: "Derived from annual statistics or surveys; the counter animates but the underlying data is a modelled estimate.",
};

export function DataModeBadge({ dataMode }: DataModeBadgeProps) {
  return (
    <span
      className={`inline-flex cursor-help items-center rounded-full border px-1.5 py-px text-[10px] font-medium leading-4 ${styles[dataMode]}`}
      title={tooltips[dataMode]}
      aria-label={`${formatLabel(dataMode)}: ${tooltips[dataMode]}`}
    >
      {formatLabel(dataMode)}
    </span>
  );
}
