import React, { useEffect, useRef } from "react";

/**
 * Lightweight accessible modal:
 * - traps initial focus to close button
 * - closes on ESC and overlay click
 */

// PUBLIC_INTERFACE
export function Modal({ title, onClose, children }) {
  /** Accessible modal overlay/panel. */
  const closeBtnRef = useRef(null);

  useEffect(() => {
    const prevActive = document.activeElement;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", onKeyDown);
    // Focus close button on open for predictable keyboard navigation
    closeBtnRef.current?.focus?.();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (prevActive && prevActive.focus) prevActive.focus();
    };
  }, [onClose]);

  return (
    <div
      className="modalOverlay"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(e) => {
        // only if user clicked overlay (not inside panel)
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="modalPanel" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          <div>
            <h2>{title}</h2>
          </div>
          <button ref={closeBtnRef} className="btn" onClick={onClose} aria-label="Close dialog">
            Close
          </button>
        </div>
        <div className="modalBody">{children}</div>
      </div>
    </div>
  );
}
