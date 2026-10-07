'use client';

import { useCart } from './CartProvider';

function formatNaira(value: number) {
  return `₦${value.toLocaleString('en-NG')}`;
}

export default function FloatingCartBar() {
  const { itemCount, subtotal, openCart, isOpen, isHydrated } = useCart();
  if (!isHydrated || itemCount === 0 || isOpen) return null;
  return (
    <button type="button" className="tv-floating-cart" onClick={openCart}>
      <span className="tv-floating-cart__count">🛒 {itemCount} item{itemCount === 1 ? '' : 's'} · {formatNaira(subtotal)}</span>
      <span className="tv-floating-cart__cta">View Cart →</span>
    </button>
  );
}
