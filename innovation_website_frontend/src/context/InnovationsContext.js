import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loadInnovations, persistInnovations } from "../services/mockDataService";
import { loadFavorites, saveFavorites } from "../utils/storage";

const InnovationsContext = createContext(null);

function nowISO() {
  return new Date().toISOString();
}

function normalizeTags(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((t) => String(t).trim()).filter(Boolean);
  return String(value)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function makeId() {
  // Deterministic enough for mock in-app creation.
  return `inv-${Math.random().toString(16).slice(2)}-${Date.now().toString(16)}`;
}

// PUBLIC_INTERFACE
export function InnovationsProvider({ children }) {
  /** Provider holding innovations list, CRUD, and favorites, backed by localStorage. */
  const [innovations, setInnovations] = useState([]);
  const [favorites, setFavorites] = useState(() => new Set(loadFavorites()));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load mock data initially
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");
    loadInnovations()
      .then((data) => {
        if (!mounted) return;
        setInnovations(Array.isArray(data) ? data : []);
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e?.message || "Failed to load innovations");
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  // Persist innovations whenever list changes (after initial load)
  useEffect(() => {
    if (!loading) {
      persistInnovations(innovations);
    }
  }, [innovations, loading]);

  // Persist favorites whenever they change
  useEffect(() => {
    saveFavorites(Array.from(favorites));
  }, [favorites]);

  const value = useMemo(() => {
    // PUBLIC_INTERFACE
    const createInnovation = (draft) => {
      /** Create an innovation from draft fields. Returns created object. */
      const created = {
        id: makeId(),
        title: String(draft.title || "").trim(),
        description: String(draft.description || "").trim(),
        owner: String(draft.owner || "").trim(),
        status: String(draft.status || "Proposed").trim(),
        category: String(draft.category || "General").trim(),
        tags: normalizeTags(draft.tags),
        lastUpdated: nowISO(),
      };
      setInnovations((prev) => [created, ...prev]);
      return created;
    };

    // PUBLIC_INTERFACE
    const updateInnovation = (id, patch) => {
      /** Update an innovation by id. Returns updated object or null if not found. */
      let updated = null;
      setInnovations((prev) =>
        prev.map((inv) => {
          if (inv.id !== id) return inv;
          updated = {
            ...inv,
            ...patch,
            tags: patch.tags !== undefined ? normalizeTags(patch.tags) : inv.tags,
            lastUpdated: nowISO(),
          };
          return updated;
        })
      );
      return updated;
    };

    // PUBLIC_INTERFACE
    const deleteInnovation = (id) => {
      /** Delete an innovation by id. */
      setInnovations((prev) => prev.filter((inv) => inv.id !== id));
      setFavorites((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    };

    // PUBLIC_INTERFACE
    const toggleFavorite = (id) => {
      /** Toggle favorite state for an innovation id. */
      setFavorites((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    };

    // PUBLIC_INTERFACE
    const isFavorite = (id) => {
      /** Returns true if id is in favorites set. */
      return favorites.has(id);
    };

    return {
      innovations,
      loading,
      error,
      favorites,
      createInnovation,
      updateInnovation,
      deleteInnovation,
      toggleFavorite,
      isFavorite,
    };
  }, [innovations, loading, error, favorites]);

  return <InnovationsContext.Provider value={value}>{children}</InnovationsContext.Provider>;
}

// PUBLIC_INTERFACE
export function useInnovations() {
  /** Hook to access innovations context. */
  const ctx = useContext(InnovationsContext);
  if (!ctx) throw new Error("useInnovations must be used within InnovationsProvider");
  return ctx;
}
