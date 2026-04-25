import type { Confidence } from "../types/statistic";
import { formatLabel } from "../lib/formatting";

interface ConfidenceBadgeProps {
  confidence: Confidence;
}

const styles: Record<Confidence, string> = {
  high: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  medium: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  low: "border-muted bg-muted text-muted-foreground",
};

export function ConfidenceBadge({ confidence }: ConfidenceBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${styles[confidence]}`}
    >
      {formatLabel(confidence)}
    </span>
  );
}
