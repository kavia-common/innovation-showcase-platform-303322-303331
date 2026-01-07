/**
 * Local storage utilities with safe JSON parsing.
 * Data model:
 * - innovations: array of innovation objects
 * - favorites: array of innovation ids
 */

const KEY_INNOVATIONS = "innovation_showcase__innovations";
const KEY_FAVORITES = "innovation_showcase__favorites";

// PUBLIC_INTERFACE
export function loadJSON(key, fallbackValue) {
  /** Safely load JSON from localStorage or return fallbackValue. */
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallbackValue;
    return JSON.parse(raw);
  } catch {
    return fallbackValue;
  }
}

// PUBLIC_INTERFACE
export function saveJSON(key, value) {
  /** Safely save JSON to localStorage. */
  window.localStorage.setItem(key, JSON.stringify(value));
}

// PUBLIC_INTERFACE
export function loadPersistedInnovations() {
  /** Load locally persisted innovations array (or null if missing). */
  const data = loadJSON(KEY_INNOVATIONS, null);
  return Array.isArray(data) ? data : null;
}

// PUBLIC_INTERFACE
export function savePersistedInnovations(innovations) {
  /** Persist innovations array to localStorage. */
  saveJSON(KEY_INNOVATIONS, innovations);
}

// PUBLIC_INTERFACE
export function loadFavorites() {
  /** Load favorite innovation ids. */
  const data = loadJSON(KEY_FAVORITES, []);
  return Array.isArray(data) ? data : [];
}

// PUBLIC_INTERFACE
export function saveFavorites(favoriteIds) {
  /** Persist favorite innovation ids. */
  saveJSON(KEY_FAVORITES, favoriteIds);
}
