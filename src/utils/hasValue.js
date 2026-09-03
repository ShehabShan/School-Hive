/**
 * hasValue — single source of truth for empty-field checks
 * Returns true only when value is meaningfully present.
 * - null / undefined => false
 * - empty string / whitespace => false
 * - empty array or array with no hasValue items => false
 * - empty object (all children empty) => false
 * - 0, false, numbers are considered present (use ?? not ||)
 */
export function hasValue(v) {
  if (v === null || v === undefined) return false;
  if (typeof v === "string") return v.trim().length > 0;
  if (typeof v === "number") return true; // 0 is valid (counts)
  if (typeof v === "boolean") return v; // true present, false empty for toggles -> treat false as empty for visibility purpose? keep false as present for explicit bool
  if (Array.isArray(v)) {
    if (v.length === 0) return false;
    return v.some((item) => hasValue(item));
  }
  if (typeof v === "object") {
    const vals = Object.values(v);
    if (vals.length === 0) return false;
    // if all children are empty => empty; otherwise has value
    return vals.some((child) => hasValue(child));
  }
  return Boolean(v);
}

export function joinFiltered(parts, sep = ", ") {
  return parts.filter((p) => hasValue(p)).join(sep);
}
