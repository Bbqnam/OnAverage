import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  applyThemeSettings,
  getStoredThemeSettings,
  type AccentTheme,
  type ThemeMode,
  type ThemeSettings,
} from "../lib/theme";

interface ThemeContextValue extends ThemeSettings {
  setMode: (mode: ThemeMode) => void;
  setAccent: (accent: AccentTheme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [settings, setSettings] = useState<ThemeSettings>(getStoredThemeSettings);

  useEffect(() => {
    applyThemeSettings(settings);
  }, [settings]);

  useEffect(() => {
    if (settings.mode !== "system") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => applyThemeSettings(settings);

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [settings]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode: settings.mode,
      accent: settings.accent,
      setMode: (mode) => {
        const nextSettings = { ...settings, mode };
        applyThemeSettings(nextSettings);
        setSettings(nextSettings);
      },
      setAccent: (accent) => {
        const nextSettings = { ...settings, accent };
        applyThemeSettings(nextSettings);
        setSettings(nextSettings);
      },
    }),
    [settings],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}
