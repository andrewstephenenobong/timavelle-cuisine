'use client';

import { ShoppingBag } from 'lucide-react';
import { useCart } from './CartProvider';

export default function CartTrigger() {
  const { itemCount, openCart, isHydrated } = useCart();
  return (
    <button type="button" className="tv-cart-trigger" onClick={openCart} aria-label={`Open cart${itemCount > 0 ? `, ${itemCount} item${itemCount === 1 ? '' : 's'}` : ''}`}>
      <ShoppingBag size={20} />
      {isHydrated && itemCount > 0 && <span className="tv-cart-trigger__badge">{itemCount > 99 ? '99+' : itemCount}</span>}
    </button>
  );
}
