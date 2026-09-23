import { useEffect, useState } from 'react';

const KEY = 'recentlyViewed';
const MAX = 6;

export function useRecentlyViewed() {
  const [ids, setIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]');
    } catch {
      return [];
    }
  });

  const add = (id) => {
    setIds((prev) => {
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, MAX);
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const clear = () => {
    setIds([]);
    try { localStorage.removeItem(KEY); } catch {}
  };

  return { ids, add, clear };
}