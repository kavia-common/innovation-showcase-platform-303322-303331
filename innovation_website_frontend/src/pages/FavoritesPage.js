import React, { useMemo, useState } from "react";
import { useInnovations } from "../context/InnovationsContext";
import { InnovationCard } from "../components/InnovationCard";
import { Modal } from "../components/Modal";
import { InnovationDetails } from "../components/InnovationDetails";
import { InnovationForm } from "../components/InnovationForm";

// PUBLIC_INTERFACE
export function FavoritesPage() {
  /** Favorites/shortlist page stored in localStorage. */
  const { innovations, favorites, toggleFavorite, isFavorite, updateInnovation } = useInnovations();
  const [openId, setOpenId] = useState("");
  const [editingId, setEditingId] = useState("");

  const favoriteList = useMemo(() => {
    const favSet = favorites;
    return innovations.filter((i) => favSet.has(i.id));
  }, [innovations, favorites]);

  const openInnovation = innovations.find((i) => i.id === openId) || null;
  const editingInnovation = innovations.find((i) => i.id === editingId) || null;

  return (
    <>
      <section className="hero" aria-label="Favorites">
        <h1 className="heroTitle">Favorites</h1>
        <p className="heroDesc">
          Your shortlist is saved in your browser (localStorage). Remove items anytime.
        </p>
      </section>

      {favoriteList.length === 0 ? (
        <div className="panel" role="status" aria-live="polite">
          No favorites yet. Go to Home and star innovations to shortlist them.
        </div>
      ) : (
        <div className="grid" role="list" aria-label="Favorite innovations list">
          {favoriteList.map((inv) => (
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
        <Modal title={openInnovation.title} onClose={() => setOpenId("")}>
          <InnovationDetails innovation={openInnovation} />
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
