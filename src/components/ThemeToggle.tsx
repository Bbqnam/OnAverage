import { Laptop, Moon, Sun } from "lucide-react";
import { AccentSelector } from "./AccentSelector";
import { useTheme } from "./ThemeProvider";
import { themeModes } from "../lib/theme";

const modeIcons = {
  light: Sun,
  dark: Moon,
  system: Laptop,
};

export function ThemeToggle() {
  const { mode, accent, setMode, setAccent } = useTheme();

  return (
    <div className="flex shrink-0 items-center gap-2">
      <div className="flex rounded-xl border border-border bg-card/70 p-0.5 shadow-subtle">
        {themeModes.map((themeMode) => {
          const Icon = modeIcons[themeMode];
          const isSelected = mode === themeMode;

          return (
            <button
              key={themeMode}
              type="button"
              onClick={() => setMode(themeMode)}
              className={`flex h-8 items-center gap-1.5 rounded-lg px-2 text-xs font-medium capitalize transition ${
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
              aria-pressed={isSelected}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">{themeMode}</span>
            </button>
          );
        })}
      </div>
      <AccentSelector value={accent} onChange={setAccent} />
    </div>
  );
}
