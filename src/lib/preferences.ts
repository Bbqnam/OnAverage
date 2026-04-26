import type { UserPreferences } from "../types/statistic";

const STORAGE_KEY = "onaverage_prefs_v1";

const DEFAULT_PREFS: UserPreferences = {
  favorites: [],
  myWorldIds: [],
  birthYear: null,
};

export function loadPreferences(): UserPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PREFS };
    return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

export function savePreferences(prefs: UserPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // ignore write errors
  }
}

export function toggleFavorite(prefs: UserPreferences, id: string): UserPreferences {
  const already = prefs.favorites.includes(id);
  return {
    ...prefs,
    favorites: already
      ? prefs.favorites.filter((f) => f !== id)
      : [...prefs.favorites, id],
  };
}

export function toggleMyWorld(prefs: UserPreferences, id: string): UserPreferences {
  const already = prefs.myWorldIds.includes(id);
  if (already) {
    return { ...prefs, myWorldIds: prefs.myWorldIds.filter((f) => f !== id) };
  }
  if (prefs.myWorldIds.length >= 10) return prefs; // cap at 10
  return { ...prefs, myWorldIds: [...prefs.myWorldIds, id] };
}
