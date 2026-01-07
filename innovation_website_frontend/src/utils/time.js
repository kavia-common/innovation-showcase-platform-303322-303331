// PUBLIC_INTERFACE
export function formatDistanceToNowStrict(isoString) {
  /** Return a compact human readable relative time (e.g., '3d ago'). */
  const d = new Date(isoString);
  const ms = Date.now() - d.getTime();
  if (!Number.isFinite(ms)) return "unknown";

  const sec = Math.round(ms / 1000);
  const abs = Math.abs(sec);

  const units = [
    ["y", 60 * 60 * 24 * 365],
    ["mo", 60 * 60 * 24 * 30],
    ["d", 60 * 60 * 24],
    ["h", 60 * 60],
    ["m", 60],
    ["s", 1],
  ];

  for (const [label, size] of units) {
    if (abs >= size || label === "s") {
      const val = Math.floor(abs / size);
      return `${val}${label} ago`;
    }
  }
  return "just now";
}
