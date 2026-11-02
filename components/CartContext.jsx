'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { ITEMS, ITEM_BY_KEY, MAX_QTY } from '@/lib/menu';

const CartContext = createContext(null);
const STORAGE_KEY = 'bobots-cart';

const clamp = (n) => Math.min(Math.max(parseInt(n, 10) || 0, 0), MAX_QTY);

// Restore the cart from the browser, dropping anything that's no longer on the menu.
function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const cart = {};
    for (const [key, n] of Object.entries(saved || {})) {
      if (ITEM_BY_KEY[key] && clamp(n) > 0) cart[key] = clamp(n);
    }
    return cart;
  } catch {
    return {};
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState({});          // { itemKey: qty }
  const [loaded, setLoaded] = useState(false);

  // localStorage only exists in the browser, so read the saved cart after the page loads.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCart(loadCart());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;   // don't overwrite the saved cart with {} before it's been read
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch { /* storage unavailable */ }
  }, [cart, loaded]);

  const setQty = (key, n) => setCart(c => {
    const next = { ...c };
    const q = clamp(n);
    if (q > 0) next[key] = q; else delete next[key];
    return next;
  });
  const add = (key) => setCart(c => ({ ...c, [key]: Math.min((c[key] || 0) + 1, MAX_QTY) }));
  const remove = (key) => setQty(key, 0);
  const clear = () => setCart({});

  // Lines keep menu order so the cart reads like the menu.
  const lines = ITEMS.filter(i => cart[i.key] > 0)
                     .map(i => ({ ...i, qty: cart[i.key], subtotal: i.price * cart[i.key] }));
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const total = lines.reduce((s, l) => s + l.subtotal, 0);

  return (
    <CartContext.Provider value={{ cart, lines, count, total, add, setQty, remove, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
