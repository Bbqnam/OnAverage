import type { Confidence, Statistic } from "../types/statistic";

export function getDisplayedConfidence(statistic: Statistic): {
  confidence: Confidence;
  tooltip?: string;
} {
  if (statistic.sourceTier === "estimated" && statistic.confidence === "high") {
    return {
      confidence: "medium",
      tooltip: "Confidence capped at Medium because no official source exists for this signal",
    };
  }

  return { confidence: statistic.confidence };
}
