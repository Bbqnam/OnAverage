import type { Confidence } from "../types/statistic";
import { formatLabel } from "../lib/formatting";

interface ConfidenceBadgeProps {
  confidence: Confidence;
  title?: string;
}

const styles: Record<Confidence, string> = {
  high: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  medium: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  low: "border-muted bg-muted text-muted-foreground",
};

const tooltips: Record<Confidence, string> = {
  high: "Source is a major international dataset (UN, WHO, World Bank). Margin of error < 5%.",
  medium: "Based on a credible study or industry report. Some regional variation may apply.",
  low: "Rough model estimate — directionally useful but treat as an order-of-magnitude guide.",
};

export function ConfidenceBadge({ confidence, title }: ConfidenceBadgeProps) {
  const tooltip = title ?? tooltips[confidence];

  return (
    <span
      className={`inline-flex cursor-help items-center rounded-md border px-2 py-0.5 text-xs font-medium ${styles[confidence]}`}
      title={tooltip}
      aria-label={`Confidence ${formatLabel(confidence)}: ${tooltip}`}
    >
      {formatLabel(confidence)} confidence
    </span>
  );
}
