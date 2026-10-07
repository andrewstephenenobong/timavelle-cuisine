'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import {
  type AddToCartInput,
  type CartLine,
  buildLineId,
  getCartItemCount,
  getCartSubtotal,
  getLineTotal,
  getLineUnitPrice,
} from '@/lib/cart-types';
import {
  getCartServerSnapshot,
  getCartSnapshot,
  getIsClientServerSnapshot,
  getIsClientSnapshot,
  subscribeIsClient,
  subscribeToCart,
  writeCartLines,
} from '@/lib/cart-store';

const FEEDBACK_DURATION_MS = 2600;

interface AddedFeedback {
  name: string;
  quantity: number;
  at: number;
}

interface CartContextValue {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  isHydrated: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (input: AddToCartInput) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
  clearCart: () => void;
  addedFeedback: AddedFeedback | null;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const lines = useSyncExternalStore(subscribeToCart, getCartSnapshot, getCartServerSnapshot);
  const isHydrated = useSyncExternalStore(subscribeIsClient, getIsClientSnapshot, getIsClientServerSnapshot);
  const [isOpen, setIsOpen] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState<AddedFeedback | null>(null);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((current) => !current), []);

  const addItem = useCallback((input: AddToCartInput) => {
    const lineId = buildLineId(input.menuItemId, input.addOns);
    const current = getCartSnapshot();
    const existing = current.find((line) => line.lineId === lineId);
    const nextLines = existing
      ? current.map((line) => line.lineId === lineId ? { ...line, quantity: line.quantity + input.quantity } : line)
      : [...current, { lineId, menuItemId: input.menuItemId, name: input.name, unitPrice: input.unitPrice, image: input.image, quantity: input.quantity, addOns: input.addOns }];
    writeCartLines(nextLines);
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    setAddedFeedback({ name: input.name, quantity: input.quantity, at: Date.now() });
    feedbackTimer.current = setTimeout(() => setAddedFeedback(null), FEEDBACK_DURATION_MS);
  }, []);

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    const current = getCartSnapshot();
    const nextLines = quantity <= 0
      ? current.filter((line) => line.lineId !== lineId)
      : current.map((line) => line.lineId === lineId ? { ...line, quantity } : line);
    writeCartLines(nextLines);
  }, []);

  const removeLine = useCallback((lineId: string) => {
    writeCartLines(getCartSnapshot().filter((line) => line.lineId !== lineId));
  }, []);

  const clearCart = useCallback(() => writeCartLines([]), []);

  const itemCount = useMemo(() => getCartItemCount(lines), [lines]);
  const subtotal = useMemo(() => getCartSubtotal(lines), [lines]);

  const value = useMemo<CartContextValue>(() => ({
    lines, itemCount, subtotal, isHydrated, isOpen, openCart, closeCart, toggleCart,
    addItem, updateQuantity, removeLine, clearCart, addedFeedback,
  }), [lines, itemCount, subtotal, isHydrated, isOpen, openCart, closeCart, toggleCart, addItem, updateQuantity, removeLine, clearCart, addedFeedback]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}

export { buildLineId, getLineTotal, getLineUnitPrice };
export type { CartLine, AddToCartInput };
