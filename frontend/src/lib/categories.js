import { useEffect, useState } from "react";
import { api } from "@/lib/api";

let cache = null;
let listeners = [];

export function useCategories() {
  const [cats, setCats] = useState(cache || []);
  useEffect(() => {
    if (cache) return;
    (async () => {
      try {
        const r = await api.get("/categories");
        cache = r.data || [];
        listeners.forEach((fn) => fn(cache));
      } catch {}
    })();
    const fn = (c) => setCats(c);
    listeners.push(fn);
    return () => { listeners = listeners.filter((l) => l !== fn); };
  }, []);
  return cats;
}

export function labelForCategory(id, cats) {
  const c = (cats || []).find((x) => x.id === id);
  return c?.label || id;
}
