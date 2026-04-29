import type { Confidence } from "../types/statistic";
import { formatLabel } from "../lib/formatting";

interface ConfidenceBadgeProps {
  confidence: Confidence;
  title?: string;
}

const styles: Record<Confidence, string> = {
  high: "border-emerald-500/15 bg-emerald-500/5 text-emerald-700/80 dark:text-emerald-300/80",
  medium: "border-amber-500/15 bg-amber-500/5 text-amber-700/80 dark:text-amber-300/80",
  low: "border-muted bg-muted text-muted-foreground",
};

const tooltips: Record<Confidence, string> = {
  high: "Source is a major international dataset (UN, WHO, World Bank). Margin of error < 5%.",
  medium: "Based on a credible study or industry report. Some regional variation may apply.",
  low: "Rough model estimate, useful as a broad guide.",
};

export function ConfidenceBadge({ confidence, title }: ConfidenceBadgeProps) {
  const tooltip = title ?? tooltips[confidence];

  return (
    <span
      className={`inline-flex cursor-help items-center rounded-full border px-1.5 py-px text-[10px] font-medium leading-4 ${styles[confidence]}`}
      title={tooltip}
      aria-label={`Confidence ${formatLabel(confidence)}: ${tooltip}`}
    >
      {formatLabel(confidence)}
    </span>
  );
}
