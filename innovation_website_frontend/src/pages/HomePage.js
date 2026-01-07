import React, { useMemo, useState } from "react";
import { useInnovations } from "../context/InnovationsContext";
import { InnovationCard } from "../components/InnovationCard";
import { Modal } from "../components/Modal";
import { InnovationDetails } from "../components/InnovationDetails";
import { InnovationForm } from "../components/InnovationForm";

const SORTS = [
  { value: "updated_desc", label: "Last updated (newest)" },
  { value: "updated_asc", label: "Last updated (oldest)" },
  { value: "title_asc", label: "Title (A–Z)" },
  { value: "title_desc", label: "Title (Z–A)" },
];

function uniq(values) {
  return Array.from(new Set(values)).filter(Boolean).sort((a, b) => a.localeCompare(b));
}

// PUBLIC_INTERFACE
export function HomePage() {
  /** Home page: search/filter/sort innovations and open details + create/edit modals. */
  const {
    innovations,
    loading,
    error,
    createInnovation,
    updateInnovation,
    toggleFavorite,
    isFavorite,
  } = useInnovations();

  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("updated_desc");

  const [openId, setOpenId] = useState("");
  const [editingId, setEditingId] = useState("");
  const [creating, setCreating] = useState(false);

  const statusOptions = useMemo(
    () => ["All", ...uniq(innovations.map((i) => i.status))],
    [innovations]
  );
  const categoryOptions = useMemo(
    () => ["All", ...uniq(innovations.map((i) => i.category))],
    [innovations]
  );

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    let list = [...innovations];

    if (status !== "All") list = list.filter((i) => i.status === status);
    if (category !== "All") list = list.filter((i) => i.category === category);

    if (query) {
      list = list.filter((i) => {
        const hay = [
          i.title,
          i.description,
          i.owner,
          i.status,
          i.category,
          ...(i.tags || []),
        ]
          .join(" ")
          .toLowerCase();
        return hay.includes(query);
      });
    }

    list.sort((a, b) => sortCompare(a, b, sort));
    return list;
  }, [innovations, q, status, category, sort]);

  const openInnovation = innovations.find((i) => i.id === openId) || null;
  const editingInnovation = innovations.find((i) => i.id === editingId) || null;

  return (
    <>
      <section className="hero" aria-label="Innovation explorer">
        <h1 className="heroTitle">Innovation Showcase</h1>
        <p className="heroDesc">
          Discover, track, and evolve innovations. Search by keywords, filter by status/category,
          and shortlist your favorites.
        </p>

        <div className="toolbar" role="region" aria-label="Search and filters">
          <div className="field">
            <label htmlFor="search">Search</label>
            <input
              id="search"
              className="input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search title, owner, tags, description…"
            />
          </div>

          <div className="field">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              className="select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              className="select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categoryOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="sort">Sort</label>
            <select id="sort" className="select" value={sort} onChange={(e) => setSort(e.target.value)}>
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <button className="btn btnPrimary" onClick={() => setCreating(true)} style={{ height: 44 }}>
            + New
          </button>
        </div>
      </section>

      {loading ? (
        <div className="panel" role="status" aria-live="polite">
          Loading innovations…
        </div>
      ) : error ? (
        <div className="panel" role="alert" style={{ borderColor: "rgba(239,68,68,0.35)" }}>
          <strong>Could not load innovations:</strong> {error}
        </div>
      ) : filtered.length === 0 ? (
        <div className="panel" role="status" aria-live="polite">
          No innovations match your current filters.
        </div>
      ) : (
        <div className="grid" role="list" aria-label="Innovations list">
          {filtered.map((inv) => (
            <div key={inv.id} role="listitem">
              <InnovationCard
                innovation={inv}
                onOpen={(id) => setOpenId(id)}
                onEdit={(id) => setEditingId(id)}
                onToggleFavorite={toggleFavorite}
                isFavorite={isFavorite}
              />
            </div>
          ))}
        </div>
      )}

      {openInnovation ? (
        <Modal
          title={openInnovation.title}
          onClose={() => setOpenId("")}
        >
          <InnovationDetails innovation={openInnovation} />
        </Modal>
      ) : null}

      {creating ? (
        <Modal title="Create innovation" onClose={() => setCreating(false)}>
          <InnovationForm
            mode="create"
            onCancel={() => setCreating(false)}
            onSubmit={(draft) => {
              const created = createInnovation(draft);
              setCreating(false);
              // Open created innovation details for continuity
              setOpenId(created.id);
            }}
          />
        </Modal>
      ) : null}

      {editingInnovation ? (
        <Modal title={`Edit: ${editingInnovation.title}`} onClose={() => setEditingId("")}>
          <InnovationForm
            mode="edit"
            initialValue={editingInnovation}
            onCancel={() => setEditingId("")}
            onSubmit={(draft) => {
              updateInnovation(editingInnovation.id, draft);
              setEditingId("");
              setOpenId(editingInnovation.id);
            }}
          />
        </Modal>
      ) : null}
    </>
  );
}

function sortCompare(a, b, sort) {
  const ta = new Date(a.lastUpdated).getTime();
  const tb = new Date(b.lastUpdated).getTime();

  switch (sort) {
    case "updated_asc":
      return ta - tb;
    case "updated_desc":
      return tb - ta;
    case "title_desc":
      return String(b.title).localeCompare(String(a.title));
    case "title_asc":
    default:
      return String(a.title).localeCompare(String(b.title));
  }
}
