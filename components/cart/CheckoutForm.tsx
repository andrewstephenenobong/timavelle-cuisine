'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { track } from '@vercel/analytics';
import { getPaymentSettings, placePreparedOrder, submitOrder, type OrderResponse, type PaymentSettings } from '@/lib/api';
import { useCart } from './CartProvider';
import { buildOrderMessage } from '@/lib/whatsapp';

const PENDING_CHECKOUT_KEY = 'timavelle_pending_bank_checkout_v1';

function formatNaira(value: number) {
  return `₦${value.toLocaleString('en-NG')}`;
}

const checkoutSchema = z.object({
  customerName: z.string().trim().min(2, 'Please enter your name'),
  customerPhone: z.string().trim().min(7, 'Please enter a valid phone number'),
  orderType: z.enum(['delivery', 'pickup']),
  deliveryAddress: z.string().optional(),
  notes: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.orderType === 'delivery' && (!data.deliveryAddress || data.deliveryAddress.trim().length < 5)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Please add a delivery address', path: ['deliveryAddress'] });
  }
});

type CheckoutInput = z.infer<typeof checkoutSchema>;
type PaymentMethod = 'bank_transfer' | 'whatsapp';
type PendingPaymentOrder = { order: OrderResponse; checkoutToken: string };

function readPendingPaymentOrder(): PendingPaymentOrder | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = window.sessionStorage.getItem(PENDING_CHECKOUT_KEY);
    if (!stored) return null;
    const pending = JSON.parse(stored) as PendingPaymentOrder;
    return pending?.order?._id && typeof pending.checkoutToken === 'string' ? pending : null;
  } catch {
    window.sessionStorage.removeItem(PENDING_CHECKOUT_KEY);
    return null;
  }
}

export default function CheckoutForm({ onBack, onPlaced }: { onBack: () => void; onPlaced: (order: OrderResponse, message: string) => void }) {
  const { lines, clearCart } = useCart();
  const [serverError, setServerError] = useState('');
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);
  const [settingsError, setSettingsError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank_transfer');
  const [pendingPaymentOrder, setPendingPaymentOrder] = useState<PendingPaymentOrder | null>(readPendingPaymentOrder);
  const [placingPreparedOrder, setPlacingPreparedOrder] = useState(false);
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { orderType: 'delivery' },
  });
  const orderType = useWatch({ control, name: 'orderType' });

  useEffect(() => {
    let active = true;
    getPaymentSettings().then((settings) => {
      if (!active) return;
      setPaymentSettings(settings);
      setPaymentMethod(settings.bankTransferEnabled ? 'bank_transfer' : 'whatsapp');
    }).catch(() => {
      if (active) setSettingsError('Checkout options are temporarily unavailable. Please try again shortly.');
    });
    return () => { active = false; };
  }, []);

  async function onSubmit(data: CheckoutInput) {
    setServerError('');
    if (!paymentSettings) {
      setServerError(settingsError || 'Please wait for checkout options to load.');
      return;
    }
    try {
      const result = await submitOrder({
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        orderType: data.orderType,
        deliveryAddress: data.orderType === 'delivery' ? data.deliveryAddress?.trim() : undefined,
        notes: data.notes,
        paymentMethod,
        channel: paymentMethod === 'whatsapp' ? 'whatsapp' : 'website',
        items: lines.map((line) => ({ menuItemId: line.menuItemId, quantity: line.quantity, addOns: line.addOns.map((addOn) => addOn.name) })),
      });

      if (paymentMethod === 'bank_transfer') {
        if (!result.checkoutToken || !result.order.paymentInstructions) throw new Error('We could not prepare secure transfer instructions. Please try again or choose WhatsApp.');
        const pending = { order: result.order, checkoutToken: result.checkoutToken };
        setPendingPaymentOrder(pending);
        try { window.sessionStorage.setItem(PENDING_CHECKOUT_KEY, JSON.stringify(pending)); } catch { /* In-memory checkout remains available for this visit. */ }
        return;
      }

      track('order_submitted', { orderType: data.orderType, paymentMethod, itemCount: lines.length });
      clearCart();
      onPlaced(result.order, buildOrderMessage(result.order));
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong placing your order. Please try again.');
    }
  }

  async function placeAfterTransfer() {
    if (!pendingPaymentOrder) return;
    setServerError('');
    setPlacingPreparedOrder(true);
    try {
      const order = await placePreparedOrder(pendingPaymentOrder.order._id, pendingPaymentOrder.checkoutToken);
      window.sessionStorage.removeItem(PENDING_CHECKOUT_KEY);
      track('order_submitted', { orderType: order.orderType, paymentMethod: 'bank_transfer', itemCount: order.items.length });
      clearCart();
      onPlaced(order, buildOrderMessage(order));
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'We could not place this order. Your saved checkout is still available; please try again.');
    } finally {
      setPlacingPreparedOrder(false);
    }
  }

  if (pendingPaymentOrder) {
    const { order } = pendingPaymentOrder;
    const instructions = order.paymentInstructions;
    return (
      <div className="tv-checkout" aria-label="Bank transfer checkout">
        <p className="tv-checkout__back">Checkout · Payment step</p>
        <section className="tv-checkout__transfer" aria-label="Bank transfer instructions">
          <h3>Transfer, then place your order</h3>
          <p>We saved a pending checkout and calculated this amount from the live menu. Transfer the exact amount below before you finalize your order.</p>
          <dl>
            <div><dt>Order reference</dt><dd>{order._id}</dd></div>
            <div><dt>Total to transfer</dt><dd><strong>{formatNaira(order.total)}</strong></dd></div>
            <div><dt>Bank</dt><dd>{instructions?.bankName}</dd></div>
            <div><dt>Account name</dt><dd>{instructions?.accountName}</dd></div>
            <div><dt>Account number</dt><dd><strong>{instructions?.accountNumber}</strong></dd></div>
          </dl>
          <p className="tv-checkout__transfer-note">After transferring, continue below to place the order. Payment remains unverified until Timavelle checks your bank receipt.</p>
        </section>
        {serverError && <p role="alert" className="tv-checkout__error">{serverError}</p>}
        <button type="button" className="tv-checkout__submit" onClick={() => void placeAfterTransfer()} disabled={placingPreparedOrder || !instructions}>
          {placingPreparedOrder ? 'Placing order…' : 'I have transferred · Place order'}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="tv-checkout" aria-label="Checkout">
      <button type="button" className="tv-checkout__back" onClick={onBack}>&larr; Back to cart</button>
      <div className="tv-checkout__field">
        <label htmlFor="checkout-name">Full name</label>
        <input id="checkout-name" autoComplete="name" {...register('customerName')} placeholder="Your name" aria-invalid={Boolean(errors.customerName)} />
        {errors.customerName && <p role="alert">{errors.customerName.message}</p>}
      </div>
      <div className="tv-checkout__field">
        <label htmlFor="checkout-phone">Phone number</label>
        <input id="checkout-phone" autoComplete="tel" {...register('customerPhone')} placeholder="+234 …" aria-invalid={Boolean(errors.customerPhone)} />
        {errors.customerPhone && <p role="alert">{errors.customerPhone.message}</p>}
      </div>
      <fieldset className="tv-checkout__order-type">
        <legend>Order type</legend>
        <label><input type="radio" value="delivery" {...register('orderType')} /> Delivery</label>
        <label><input type="radio" value="pickup" {...register('orderType')} /> Pickup</label>
      </fieldset>
      {orderType === 'delivery' && <div className="tv-checkout__field">
        <label htmlFor="checkout-address">Delivery address</label>
        <textarea id="checkout-address" {...register('deliveryAddress')} placeholder="Street, area, landmark" rows={2} aria-invalid={Boolean(errors.deliveryAddress)} />
        {errors.deliveryAddress && <p role="alert">{errors.deliveryAddress.message}</p>}
      </div>}
      <div className="tv-checkout__field">
        <label htmlFor="checkout-notes">Additional notes <span>(optional)</span></label>
        <textarea id="checkout-notes" {...register('notes')} placeholder="Anything we should know…" rows={2} />
      </div>
      <fieldset className="tv-checkout__order-type tv-checkout__payment-choice">
        <legend>How would you like to continue?</legend>
        {paymentSettings?.bankTransferEnabled && <label><input type="radio" name="paymentMethod" value="bank_transfer" checked={paymentMethod === 'bank_transfer'} onChange={() => setPaymentMethod('bank_transfer')} /> Bank transfer</label>}
        {paymentSettings?.whatsappEnabled && <label><input type="radio" name="paymentMethod" value="whatsapp" checked={paymentMethod === 'whatsapp'} onChange={() => setPaymentMethod('whatsapp')} /> Continue via WhatsApp</label>}
      </fieldset>
      {paymentMethod === 'bank_transfer' && paymentSettings?.bankTransferEnabled && <p className="tv-checkout__transfer-note">Next, we’ll save a pending order using server-calculated prices and show the exact transfer total and account. You’ll finalize the order after transferring.</p>}
      {paymentMethod === 'whatsapp' && paymentSettings?.whatsappEnabled && <p className="tv-checkout__transfer-note">We’ll save your order first, then you can continue the conversation with Timavelle on WhatsApp.</p>}
      {settingsError && <p role="alert" className="tv-checkout__error">{settingsError}</p>}
      {serverError && <p role="alert" className="tv-checkout__error">{serverError}</p>}
      <button type="submit" className="tv-checkout__submit" disabled={isSubmitting || !paymentSettings || (!paymentSettings.bankTransferEnabled && !paymentSettings.whatsappEnabled)}>
        {isSubmitting ? 'Saving checkout…' : !paymentSettings ? 'Loading checkout options…' : paymentMethod === 'bank_transfer' ? 'Continue to bank transfer' : 'Save order & continue via WhatsApp'}
      </button>
    </form>
  );
}
