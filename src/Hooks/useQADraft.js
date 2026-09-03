import { useEffect, useState } from "react";

const KEY = "qa-draft-v1";

export function useQADraft(initial) {
  const [draft, setDraft] = useState(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return { ...initial, ...JSON.parse(raw) };
    } catch { /* ignore */ }
    return initial;
  });

  useEffect(() => {
    const t = setTimeout(() => {
      try { localStorage.setItem(KEY, JSON.stringify(draft)); } catch { /* quota */ }
    }, 600);
    return () => clearTimeout(t);
  }, [draft]);

  const clearDraft = () => {
    try { localStorage.removeItem(KEY); } catch { /* */ }
  };

  const hasDraft = (() => {
    try { return !!localStorage.getItem(KEY); } catch { return false; }
  })();

  return [draft, setDraft, clearDraft, hasDraft];
}
