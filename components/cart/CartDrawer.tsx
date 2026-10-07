'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useCart } from './CartProvider';
import { getLineTotal } from '@/lib/cart-types';
import QuantityStepper from '@/components/menu/QuantityStepper';
import CheckoutForm from './CheckoutForm';
import type { OrderResponse } from '@/lib/api';

function formatNaira(value: number) {
  return `₦${value.toLocaleString('en-NG')}`;
}

type Step = 'cart' | 'checkout' | 'success';

export default function CartDrawer() {
  const { lines, subtotal, isOpen, closeCart, updateQuantity, removeLine, isHydrated } = useCart();
  const [step, setStep] = useState<Step>('cart');
  const [placedOrder, setPlacedOrder] = useState<OrderResponse | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') closeCart(); };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, closeCart]);

  useEffect(() => {
    if (isOpen) return;
    const timer = window.setTimeout(() => { setStep('cart'); setPlacedOrder(null); }, 300);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  if (!isHydrated || !isOpen) return null;

  return (
    <div className="tv-cart-drawer" role="dialog" aria-modal="true" aria-label="Your cart" onClick={(event) => { if (event.target === event.currentTarget) closeCart(); }}>
      <div className="tv-cart-drawer__panel">
        <div className="tv-cart-drawer__head">
          <h2>{step === 'checkout' ? 'Checkout' : step === 'success' ? 'Order sent' : 'Your cart'}</h2>
          <button type="button" onClick={closeCart} aria-label="Close cart">×</button>
        </div>

        {step === 'success' && placedOrder ? (
          <div className="tv-cart-drawer__success">
            <p className="tv-cart-drawer__success-mark" aria-hidden="true">✓</p>
            <h3>Thank you, {placedOrder.customerName.split(' ')[0]}.</h3>
            <p>Your order has been sent — we&rsquo;ve also opened WhatsApp with your order ready to go. Please hit send there to confirm with us directly.</p>
            <p className="tv-cart-drawer__success-total">Order total: {formatNaira(placedOrder.total)}</p>
            <button type="button" className="tv-cart-drawer__continue" onClick={closeCart}>Continue browsing</button>
          </div>
        ) : step === 'checkout' ? (
          <CheckoutForm onBack={() => setStep('cart')} onPlaced={(order) => { setPlacedOrder(order); setStep('success'); }} />
        ) : lines.length === 0 ? (
          <div className="tv-cart-drawer__empty">
            <p>Your cart is empty.</p>
            <button type="button" onClick={closeCart}>Browse the menu</button>
          </div>
        ) : (
          <>
            <ul className="tv-cart-drawer__lines">
              {lines.map((line) => (
                <li key={line.lineId} className="tv-cart-drawer__line">
                  <div className="tv-cart-drawer__line-media">
                    {line.image ? <Image src={line.image} alt={line.name} width={72} height={72} unoptimized /> : <span aria-hidden="true" />}
                  </div>
                  <div className="tv-cart-drawer__line-body">
                    <div className="tv-cart-drawer__line-head">
                      <strong>{line.name}</strong>
                      <span>{formatNaira(getLineTotal(line))}</span>
                    </div>
                    {line.addOns.length > 0 && <small>{line.addOns.map((addOn) => addOn.name).join(', ')}</small>}
                    <div className="tv-cart-drawer__line-actions">
                      <QuantityStepper quantity={line.quantity} onChange={(next) => updateQuantity(line.lineId, next)} size="sm" label={`${line.name} quantity`} />
                      <button type="button" onClick={() => removeLine(line.lineId)}>Remove</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="tv-cart-drawer__summary">
              <div><span>Subtotal</span><strong>{formatNaira(subtotal)}</strong></div>
              <button type="button" className="tv-cart-drawer__checkout" onClick={() => setStep('checkout')}>Checkout</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
