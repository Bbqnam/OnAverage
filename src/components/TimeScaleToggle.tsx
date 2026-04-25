import { Timer } from "lucide-react";
import { timeScales } from "../data/statistics";
import { sentenceCaseTimeScale } from "../lib/formatting";
import type { TimeScale } from "../types/statistic";

interface TimeScaleToggleProps {
  selectedScale: TimeScale;
  onScaleChange: (scale: TimeScale) => void;
}

export function TimeScaleToggle({
  selectedScale,
  onScaleChange,
}: TimeScaleToggleProps) {
  return (
    <div className="flex min-w-0 items-center gap-2 overflow-x-auto rounded-lg border border-border bg-card p-1 shadow-subtle">
      <div className="flex h-8 shrink-0 items-center gap-1.5 px-2 text-xs font-medium text-muted-foreground sm:text-sm">
        <Timer className="h-4 w-4" aria-hidden="true" />
        Time scale
      </div>
      <div className="flex w-max gap-1">
        {timeScales.map((scale) => {
          const isSelected = scale === selectedScale;

          return (
            <button
              key={scale}
              type="button"
              onClick={() => onScaleChange(scale)}
              className={`h-8 whitespace-nowrap rounded-md px-2.5 text-xs font-medium transition sm:text-sm ${
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
              aria-pressed={isSelected}
            >
              {sentenceCaseTimeScale(scale)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
