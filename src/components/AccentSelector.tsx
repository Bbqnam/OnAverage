import { Check } from "lucide-react";
import { accentThemes, type AccentTheme } from "../lib/theme";

interface AccentSelectorProps {
  value: AccentTheme;
  onChange: (accent: AccentTheme) => void;
}

const swatches: Record<AccentTheme, string> = {
  neutral: "bg-zinc-500",
  blue: "bg-blue-500",
  green: "bg-emerald-500",
  purple: "bg-violet-500",
  amber: "bg-amber-500",
};

export function AccentSelector({ value, onChange }: AccentSelectorProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
      {accentThemes.map((accent) => {
        const isSelected = value === accent;

        return (
          <button
            key={accent}
            type="button"
            onClick={() => onChange(accent)}
            className={`relative flex h-8 w-8 items-center justify-center rounded-md transition hover:bg-accent ${
              isSelected ? "bg-accent ring-1 ring-ring/35" : ""
            }`}
            aria-label={`Use ${accent} accent`}
            aria-pressed={isSelected}
            title={`${accent[0].toUpperCase()}${accent.slice(1)} accent`}
          >
            <span
              className={`h-4 w-4 rounded-full transition ${
                isSelected ? "scale-110 shadow-sm" : ""
              } ${swatches[accent]}`}
              aria-hidden="true"
            />
            {isSelected && (
              <Check className="absolute h-3 w-3 text-white drop-shadow" aria-hidden="true" />
            )}
          </button>
        );
      })}
    </div>
  );
}
