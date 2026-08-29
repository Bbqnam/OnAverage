export type ThemeMode = "light" | "dark" | "system";

export type AccentTheme = "neutral" | "blue" | "green" | "purple" | "amber";

export interface ThemeSettings {
  mode: ThemeMode;
  accent: AccentTheme;
}

const THEME_MODE_KEY = "onaverage-theme-mode";
const THEME_ACCENT_KEY = "onaverage-accent-theme";

export const accentThemes: AccentTheme[] = [
  "neutral",
  "blue",
  "green",
  "purple",
  "amber",
];

export const themeModes: ThemeMode[] = ["light", "dark", "system"];

function isThemeMode(value: string | null): value is ThemeMode {
  return value === "light" || value === "dark" || value === "system";
}

function isAccentTheme(value: string | null): value is AccentTheme {
  return (
    value === "neutral" ||
    value === "blue" ||
    value === "green" ||
    value === "purple" ||
    value === "amber"
  );
}

export function getStoredThemeSettings(): ThemeSettings {
  if (typeof window === "undefined") {
    return { mode: "dark", accent: "blue" };
  }

  const storedMode = window.localStorage.getItem(THEME_MODE_KEY);
  const storedAccent = window.localStorage.getItem(THEME_ACCENT_KEY);

  return {
    mode: isThemeMode(storedMode) ? storedMode : "dark",
    accent: isAccentTheme(storedAccent) ? storedAccent : "blue",
  };
}

export function resolveThemeMode(mode: ThemeMode): "light" | "dark" {
  if (mode !== "system") {
    return mode;
  }

  if (typeof window === "undefined") {
    return "dark";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyThemeSettings(settings: ThemeSettings): void {
  if (typeof document === "undefined") {
    return;
  }

  const resolvedMode = resolveThemeMode(settings.mode);
  const root = document.documentElement;

  root.classList.toggle("light", resolvedMode === "light");
  root.classList.toggle("dark", resolvedMode === "dark");
  root.dataset.accent = settings.accent;
  root.style.colorScheme = resolvedMode;

  window.localStorage.setItem(THEME_MODE_KEY, settings.mode);
  window.localStorage.setItem(THEME_ACCENT_KEY, settings.accent);
}
