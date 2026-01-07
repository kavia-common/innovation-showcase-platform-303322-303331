import React from "react";
import { formatDistanceToNowStrict } from "../utils/time";

// PUBLIC_INTERFACE
export function InnovationDetails({ innovation }) {
  /** Details panel for an innovation (used inside Modal). */
  return (
    <div className="twoCol">
      <section className="panel" aria-label="Description">
        <p style={{ marginTop: 0, color: "#111827", lineHeight: 1.55 }}>{innovation.description}</p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
          {(innovation.tags || []).map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
      </section>

      <aside className="panel" aria-label="Key fields">
        <h3 className="panelTitle">Key fields</h3>
        <dl className="kv">
          <dt>Owner</dt>
          <dd>{innovation.owner}</dd>

          <dt>Status</dt>
          <dd>{innovation.status}</dd>

          <dt>Category</dt>
          <dd>{innovation.category}</dd>

          <dt>Updated</dt>
          <dd title={innovation.lastUpdated}>{formatDistanceToNowStrict(innovation.lastUpdated)}</dd>

          <dt>ID</dt>
          <dd style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" }}>
            {innovation.id}
          </dd>
        </dl>
      </aside>
    </div>
  );
}
