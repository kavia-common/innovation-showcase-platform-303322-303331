import React from "react";
import { formatDistanceToNowStrict } from "../utils/time";

// PUBLIC_INTERFACE
export function InnovationCard({
  innovation,
  onOpen,
  onEdit,
  onToggleFavorite,
  isFavorite,
}) {
  /** Card UI for an innovation. */
  const fav = isFavorite(innovation.id);

  return (
    <article className="card" aria-label={`Innovation: ${innovation.title}`}>
      <div className="cardTitleRow">
        <h3 className="cardTitle">{innovation.title}</h3>
        <button
          className="iconBtn"
          aria-label={fav ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={fav}
          onClick={() => onToggleFavorite(innovation.id)}
        >
          {fav ? "★" : "☆"}
        </button>
      </div>

      <div className="cardMeta" aria-label="Innovation metadata">
        <span className="badge" title="Status">
          <span className="badgeDot" style={{ background: statusColor(innovation.status) }} />
          {innovation.status}
        </span>
        <span className="badge" title="Category">
          {innovation.category}
        </span>
        <span className="badge" title="Owner">
          {innovation.owner}
        </span>
      </div>

      <p className="cardDesc">{innovation.description}</p>

      <div className="cardMeta" aria-label="Tags">
        {(innovation.tags || []).slice(0, 3).map((t) => (
          <span key={t} className="tag">
            {t}
          </span>
        ))}
        {(innovation.tags || []).length > 3 ? (
          <span className="tag">+{(innovation.tags || []).length - 3}</span>
        ) : null}
      </div>

      <div className="cardFooter">
        <span className="smallMuted">
          Updated {formatDistanceToNowStrict(innovation.lastUpdated)}
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn" onClick={() => onOpen(innovation.id)}>
            View
          </button>
          <button className="btn btnPrimary" onClick={() => onEdit(innovation.id)}>
            Edit
          </button>
        </div>
      </div>
    </article>
  );
}

function statusColor(status) {
  const s = String(status || "").toLowerCase();
  if (s.includes("active")) return "#10b981";
  if (s.includes("progress")) return "#2563eb";
  if (s.includes("proposed")) return "#f59e0b";
  if (s.includes("hold")) return "#6b7280";
  if (s.includes("complete")) return "#8b5cf6";
  return "#6b7280";
}
