import { loadPersistedInnovations, savePersistedInnovations } from "../utils/storage";

/**
 * Note: CRA serves files in /public at the root path.
 * We default to /mock/innovations.json but allow overriding via REACT_APP_API_BASE.
 */
function getMockBaseUrl() {
  const envBase = process.env.REACT_APP_API_BASE;
  // If provided, allow e.g. https://cdn.example.com/mock
  if (envBase && typeof envBase === "string") return envBase.replace(/\/$/, "");
  return "";
}

// PUBLIC_INTERFACE
export async function loadInnovations() {
  /** Load innovations from localStorage override, else fetch from public mock JSON. */
  const persisted = loadPersistedInnovations();
  if (persisted) return persisted;

  const url = `${getMockBaseUrl()}/mock/innovations.json`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    throw new Error(`Failed to load mock data from ${url} (${res.status})`);
  }
  const json = await res.json();
  const innovations = Array.isArray(json?.innovations) ? json.innovations : [];
  // Cache for subsequent loads
  savePersistedInnovations(innovations);
  return innovations;
}

// PUBLIC_INTERFACE
export function persistInnovations(innovations) {
  /** Persist innovations to localStorage. */
  savePersistedInnovations(innovations);
}
