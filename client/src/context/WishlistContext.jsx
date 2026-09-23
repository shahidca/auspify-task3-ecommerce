import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [ids, setIds] = useState(new Set());

  const refresh = async () => {
    if (!user) {
      setItems([]);
      setIds(new Set());
      return;
    }
    try {
      const res = await api.get('/wishlist');
      setItems(res.data.data);
      setIds(new Set(res.data.data.map((i) => i.productId)));
    } catch {
      /* ignore */
    }
  };

  useEffect(() => { refresh(); }, [user]);

  const toggle = async (productId) => {
    const res = await api.post(`/wishlist/${productId}`);
    await refresh();
    return res.data.added; // true if added, false if removed
  };

  const has = (productId) => ids.has(productId);

  return (
    <WishlistContext.Provider value={{ items, count: items.length, has, toggle, refresh }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be inside WishlistProvider');
  return ctx;
}