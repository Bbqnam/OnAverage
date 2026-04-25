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

export function DataModeBadge({ dataMode }: DataModeBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${styles[dataMode]}`}
    >
      {formatLabel(dataMode)}
    </span>
  );
}
