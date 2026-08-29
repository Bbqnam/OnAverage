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
    <div className="no-scrollbar flex min-w-0 items-center gap-1 overflow-x-auto rounded-xl border border-border/70 bg-background/60 p-1">
      <div className="flex h-8 shrink-0 items-center gap-1.5 px-2 text-xs font-medium text-muted-foreground">
        <Timer className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="hidden sm:inline">Time scale</span>
      </div>
      <div className="flex w-max gap-0.5">
        {timeScales.map((scale) => {
          const isSelected = scale === selectedScale;

          return (
            <button
              key={scale}
              type="button"
              onClick={() => onScaleChange(scale)}
              className={`h-8 whitespace-nowrap rounded-lg px-2.5 text-xs font-medium transition ${
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
