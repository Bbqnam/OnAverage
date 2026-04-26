import type { DataMode } from "../types/statistic";
import { formatLabel } from "../lib/formatting";

interface DataModeBadgeProps {
  dataMode: DataMode;
}

const styles: Record<DataMode, string> = {
  live: "border-primary/20 bg-primary/10 text-primary",
  "semi-live": "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  estimated: "border-border bg-muted text-muted-foreground",
};

const tooltips: Record<DataMode, string> = {
  live: "Connected to a live data feed — updates in real time.",
  "semi-live": "Derived from a verified annual figure divided by seconds — ticks live but the base number is periodically updated.",
  estimated: "Derived from annual statistics or surveys; the counter animates but the underlying data is a modelled estimate.",
};

export function DataModeBadge({ dataMode }: DataModeBadgeProps) {
  return (
    <span
      className={`inline-flex cursor-help items-center rounded-md border px-2 py-0.5 text-xs font-medium ${styles[dataMode]}`}
      title={tooltips[dataMode]}
      aria-label={`${formatLabel(dataMode)}: ${tooltips[dataMode]}`}
    >
      {formatLabel(dataMode)}
    </span>
  );
}
