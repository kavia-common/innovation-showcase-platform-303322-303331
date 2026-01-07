import React, { useMemo, useState } from "react";

const STATUS_OPTIONS = ["Proposed", "In Progress", "Active", "On Hold", "Completed"];
const CATEGORY_OPTIONS = ["AI & Automation", "Operations", "Sustainability", "Developer Experience", "People & Culture", "General"];

// PUBLIC_INTERFACE
export function InnovationForm({ mode, initialValue, onCancel, onSubmit }) {
  /** Create/Edit form for an innovation. */
  const initial = useMemo(() => {
    const inv = initialValue || {};
    return {
      title: inv.title || "",
      description: inv.description || "",
      owner: inv.owner || "",
      status: inv.status || "Proposed",
      category: inv.category || "General",
      tags: Array.isArray(inv.tags) ? inv.tags.join(", ") : (inv.tags || ""),
    };
  }, [initialValue]);

  const [form, setForm] = useState(initial);
  const [touched, setTouched] = useState(false);

  const errors = validate(form);
  const canSubmit = Object.keys(errors).length === 0;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setTouched(true);
        if (!canSubmit) return;
        onSubmit?.(form);
      }}
      aria-label={mode === "edit" ? "Edit innovation form" : "Create innovation form"}
    >
      <div className="twoCol">
        <div className="panel">
          <div className="field">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              className="input"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              onBlur={() => setTouched(true)}
              aria-invalid={touched && !!errors.title}
              aria-describedby={touched && errors.title ? "err-title" : undefined}
              placeholder="e.g., Customer Support Copilot"
              required
            />
            {touched && errors.title ? (
              <div id="err-title" className="smallMuted" style={{ color: "#991b1b", marginTop: 6 }}>
                {errors.title}
              </div>
            ) : null}
          </div>

          <div className="field" style={{ marginTop: 12 }}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              className="textarea"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              onBlur={() => setTouched(true)}
              aria-invalid={touched && !!errors.description}
              aria-describedby={touched && errors.description ? "err-description" : undefined}
              placeholder="What is the innovation, and what problem does it solve?"
              required
            />
            {touched && errors.description ? (
              <div
                id="err-description"
                className="smallMuted"
                style={{ color: "#991b1b", marginTop: 6 }}
              >
                {errors.description}
              </div>
            ) : null}
          </div>

          <div className="field" style={{ marginTop: 12 }}>
            <label htmlFor="tags">Tags (comma-separated)</label>
            <input
              id="tags"
              className="input"
              value={form.tags}
              onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
              placeholder="e.g., LLM, Analytics, Alerts"
            />
          </div>
        </div>

        <div className="panel">
          <h3 className="panelTitle">Details</h3>

          <div className="field">
            <label htmlFor="owner">Owner</label>
            <input
              id="owner"
              className="input"
              value={form.owner}
              onChange={(e) => setForm((p) => ({ ...p, owner: e.target.value }))}
              onBlur={() => setTouched(true)}
              aria-invalid={touched && !!errors.owner}
              aria-describedby={touched && errors.owner ? "err-owner" : undefined}
              placeholder="e.g., Ava Chen"
              required
            />
            {touched && errors.owner ? (
              <div id="err-owner" className="smallMuted" style={{ color: "#991b1b", marginTop: 6 }}>
                {errors.owner}
              </div>
            ) : null}
          </div>

          <div className="field" style={{ marginTop: 12 }}>
            <label htmlFor="status">Status</label>
            <select
              id="status"
              className="select"
              value={form.status}
              onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="field" style={{ marginTop: 12 }}>
            <label htmlFor="category">Category</label>
            <select
              id="category"
              className="select"
              value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
            <button type="submit" className="btn btnPrimary" disabled={!canSubmit}>
              {mode === "edit" ? "Save changes" : "Create innovation"}
            </button>
            <button type="button" className="btn" onClick={onCancel}>
              Cancel
            </button>
          </div>

          {!canSubmit && touched ? (
            <div className="smallMuted" style={{ marginTop: 10 }}>
              Please fix the highlighted fields to continue.
            </div>
          ) : null}
        </div>
      </div>
    </form>
  );
}

function validate(form) {
  const errors = {};
  const title = String(form.title || "").trim();
  const owner = String(form.owner || "").trim();
  const description = String(form.description || "").trim();

  if (!title) errors.title = "Title is required.";
  if (title.length > 90) errors.title = "Please keep the title under 90 characters.";

  if (!owner) errors.owner = "Owner is required.";
  if (owner.length > 60) errors.owner = "Please keep the owner name under 60 characters.";

  if (!description) errors.description = "Description is required.";
  if (description.length > 800) errors.description = "Please keep the description under 800 characters.";

  return errors;
}
