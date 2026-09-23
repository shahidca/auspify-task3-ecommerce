import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    if (!user) {
      setItems([]); setSubtotal(0); setItemCount(0);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get('/cart');
      setItems(res.data.items);
      setSubtotal(res.data.subtotal);
      setItemCount(res.data.itemCount);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    const res = await api.post('/cart', { productId, quantity });
    setItems(res.data.items);
    setSubtotal(res.data.subtotal);
    setItemCount(res.data.itemCount);
  };

  const updateQuantity = async (productId, quantity) => {
    const res = await api.put(`/cart/${productId}`, { quantity });
    setItems(res.data.items);
    setSubtotal(res.data.subtotal);
    setItemCount(res.data.itemCount);
  };

  const removeItem = async (productId) => {
    const res = await api.delete(`/cart/${productId}`);
    setItems(res.data.items);
    setSubtotal(res.data.subtotal);
    setItemCount(res.data.itemCount);
  };

  const clearCart = async () => {
    await api.delete('/cart');
    setItems([]); setSubtotal(0); setItemCount(0);
  };

  return (
    <CartContext.Provider value={{
      items, subtotal, itemCount, loading,
      addToCart, updateQuantity, removeItem, clearCart, refresh,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}