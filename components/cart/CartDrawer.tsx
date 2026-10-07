'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useCart } from './CartProvider';
import { getLineTotal } from '@/lib/cart-types';
import QuantityStepper from '@/components/menu/QuantityStepper';
import CheckoutForm from './CheckoutForm';
import type { OrderResponse } from '@/lib/api';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { downloadOrderReceipt } from '@/lib/order-receipt';

function formatNaira(value: number) {
  return `₦${value.toLocaleString('en-NG')}`;
}

type Step = 'cart' | 'checkout' | 'success';

export default function CartDrawer() {
  const { lines, subtotal, isOpen, closeCart, updateQuantity, removeLine, isHydrated } = useCart();
  const [step, setStep] = useState<Step>('cart');
  const [placedOrder, setPlacedOrder] = useState<OrderResponse | null>(null);
  const [placedMessage, setPlacedMessage] = useState('');
  const [checkoutToken, setCheckoutToken] = useState('');
  const [receiptDownloaded, setReceiptDownloaded] = useState(false);
  const [receiptError, setReceiptError] = useState('');

  const handleClose = useCallback(() => {
    setStep('cart');
    setPlacedOrder(null);
    setPlacedMessage('');
    setCheckoutToken('');
    setReceiptDownloaded(false);
    setReceiptError('');
    closeCart();
  }, [closeCart]);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, handleClose]);

  if (!isHydrated || !isOpen) return null;

  return (
    <div className="tv-cart-drawer" role="dialog" aria-modal="true" aria-label="Your cart" onClick={(event) => { if (event.target === event.currentTarget) handleClose(); }}>
      <div className="tv-cart-drawer__panel">
        <div className="tv-cart-drawer__head">
          <h2>{step === 'checkout' ? 'Checkout' : step === 'success' ? 'Order placed' : 'Your cart'}</h2>
          <button type="button" onClick={handleClose} aria-label="Close cart">×</button>
        </div>

        {step === 'success' && placedOrder ? (
          <div className="tv-cart-drawer__success">
            <p className="tv-cart-drawer__success-mark" aria-hidden="true">✓</p>
            <h3>Thank you, {placedOrder.customerName.split(' ')[0]}.</h3>
            <p>{placedOrder.paymentMethod === 'bank_transfer' ? 'Your order has been saved. It is awaiting payment verification and is not confirmed as paid yet.' : 'Your order has been saved. Continue with us on WhatsApp to confirm the details.'}</p>
            <p className="tv-cart-drawer__success-total">Order reference: <strong>{placedOrder._id}</strong></p>
            {checkoutToken && <a className="tv-cart-drawer__continue" href={`/orders/${encodeURIComponent(placedOrder._id)}?token=${encodeURIComponent(checkoutToken)}`}>View order status</a>}
            <p className="tv-cart-drawer__success-total">Order total: {formatNaira(placedOrder.total)}</p>
            {placedOrder.paymentMethod === 'bank_transfer' && placedOrder.paymentInstructions && <section className="tv-checkout__transfer" aria-label="Bank transfer details for this order"><h3>Transfer to complete payment</h3><dl><div><dt>Bank</dt><dd>{placedOrder.paymentInstructions.bankName}</dd></div><div><dt>Account name</dt><dd>{placedOrder.paymentInstructions.accountName}</dd></div><div><dt>Account number</dt><dd><strong>{placedOrder.paymentInstructions.accountNumber}</strong></dd></div><div><dt>Amount</dt><dd>{formatNaira(placedOrder.total)}</dd></div></dl><p>After transferring, send your bank-issued payment proof on WhatsApp and include this order reference.</p></section>}
            <p>Your downloadable order receipt is not proof of payment.</p>
            <button type="button" className="tv-cart-drawer__continue" onClick={() => {
              setReceiptError('');
              void downloadOrderReceipt(placedOrder).then(() => setReceiptDownloaded(true)).catch(() => setReceiptError('We could not create the PDF. Please try again.'));
            }}>Download order receipt (PDF)</button>
            {receiptError && <p role="alert">{receiptError}</p>}
            {placedOrder.paymentMethod === 'whatsapp' && <a className="tv-cart-drawer__continue" href={buildWhatsAppUrl(placedMessage)} target="_blank" rel="noreferrer">Continue via WhatsApp</a>}
            {placedOrder.paymentMethod === 'bank_transfer' && <button type="button" className="tv-cart-drawer__continue" onClick={() => window.open(buildWhatsAppUrl(`Hello Timavelle Cuisine, I have transferred ${formatNaira(placedOrder.total)} for order #${placedOrder._id}. I am attaching my bank payment receipt for verification.`), '_blank', 'noopener,noreferrer')}>Send bank payment receipt via WhatsApp</button>}
            {receiptDownloaded && <button type="button" className="tv-cart-drawer__continue" onClick={() => window.open(buildWhatsAppUrl(`Hello Timavelle Cuisine, please see the order summary PDF for order #${placedOrder._id}.`), '_blank', 'noopener,noreferrer')}>Share order summary PDF via WhatsApp</button>}
            {!receiptDownloaded && <p role="status">Download the order summary PDF above before sharing that PDF on WhatsApp. For payment verification, attach your bank-issued transfer receipt instead.</p>}
            <a className="tv-cart-drawer__continue" href="/contact" onClick={handleClose}>Continue with an enquiry</a>
            <button type="button" className="tv-cart-drawer__continue" onClick={handleClose}>Continue browsing</button>
          </div>
        ) : step === 'checkout' ? (
          <CheckoutForm onBack={() => setStep('cart')} onPlaced={(order, message, token) => { setPlacedOrder(order); setPlacedMessage(message); setCheckoutToken(token || ''); setStep('success'); }} />
        ) : lines.length === 0 ? (
          <div className="tv-cart-drawer__empty">
            <p>Your cart is empty.</p>
            <button type="button" onClick={handleClose}>Browse the menu</button>
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
