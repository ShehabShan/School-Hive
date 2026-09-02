import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

const KEY = "compareIds";
const MAX = 4;

function read() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
    return new Set(raw.map(String));
  } catch {
    return new Set();
  }
}

export default function useCompare() {
  const [ids, setIds] = useState(() => read());

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify([...ids]));
    window.dispatchEvent(new CustomEvent("compare:change", { detail: [...ids] }));
  }, [ids]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === KEY) setIds(read());
    };
    const onCustom = (e) => setIds(new Set((e.detail || []).map(String)));
    window.addEventListener("storage", onStorage);
    window.addEventListener("compare:change", onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("compare:change", onCustom);
    };
  }, []);

  const has = useCallback((id) => ids.has(String(id)), [ids]);

  const add = useCallback(
    (id) => {
      const sid = String(id);
      if (ids.has(sid)) return true;
      if (ids.size >= MAX) {
        toast.error("Can't add more than 4 — remove one to add another");
        return false;
      }
      setIds((prev) => {
        const next = new Set(prev);
        next.add(sid);
        return next;
      });
      toast.success("Added to compare");
      return true;
    },
    [ids]
  );

  const remove = useCallback((id) => {
    const sid = String(id);
    setIds((prev) => {
      const next = new Set(prev);
      next.delete(sid);
      return next;
    });
    toast.success("Removed from compare");
  }, []);

  const toggle = useCallback(
    (id) => {
      const sid = String(id);
      if (ids.has(sid)) {
        remove(sid);
        return false;
      }
      return add(sid);
    },
    [ids, add, remove]
  );

  const clear = useCallback(() => {
    setIds(new Set());
    toast.success("Compare cleared");
  }, []);

  return { ids, has, add, remove, toggle, clear, count: ids.size, max: MAX, canAdd: ids.size < MAX };
}
