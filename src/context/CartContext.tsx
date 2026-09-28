import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Product, CartItem } from '@/lib/supabase';

type CartContextValue = {
  items: CartItem[];
  wishlist: Product[];
  isOpen: boolean;
  totalItems: number;
  subtotal: number;
  addItem: (product: Product, quantity?: number) => void;
  toggleWishlist: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function readStored<T>(key: string): T | null {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) as T : null;
  } catch {
    return null;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => readStored<CartItem[]>('maven-cart') ?? []);
  const [wishlist, setWishlist] = useState<Product[]>(() => readStored<Product[]>('maven-wishlist') ?? []);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('maven-cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('maven-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    if (product.stock <= 0 || quantity <= 0) return;
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, product, quantity: Math.min(product.stock, item.quantity + quantity) }
            : item,
        );
      }
      return [...prev, { product, quantity: Math.min(product.stock, quantity) }];
    });
    setIsOpen(true);
  }, []);

  const toggleWishlist = useCallback((product: Product) => {
    setWishlist((prev) => prev.some((item) => item.id === product.id)
      ? prev.filter((item) => item.id !== product.id)
      : [...prev, product]);
  }, []);

  const isWishlisted = useCallback((productId: string) =>
    wishlist.some((item) => item.id === productId), [wishlist]);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.product.id !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(item.product.stock, quantity) }
          : item,
      ),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        wishlist,
        isOpen,
        totalItems,
        subtotal,
        addItem,
        toggleWishlist,
        isWishlisted,
        removeItem,
        updateQuantity,
        clear,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
