'use client';

import { useEffect, useId, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { track } from '@vercel/analytics';
import { getDeliveryAreas, getPaymentSettings, placePreparedOrder, submitOrder, uploadPaymentReceipt, type DeliveryArea, type OrderResponse, type PaymentSettings } from '@/lib/api';
import { useCart } from './CartProvider';
import { buildOrderMessage } from '@/lib/whatsapp';

const PENDING_CHECKOUT_KEY = 'timavelle_pending_bank_checkout_v2';
const formatNaira = (value: number) => `₦${value.toLocaleString('en-NG')}`;
const checkoutSchema = z.object({
  customerName: z.string().trim().min(2, 'Please enter your name'),
  customerPhone: z.string().trim().min(7, 'Please enter a valid phone number'),
  orderType: z.enum(['delivery', 'pickup']),
  deliveryAreaId: z.string().optional(),
  deliveryAddress: z.string().optional(),
  discountCode: z.string().optional(),
  notes: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.orderType === 'delivery' && !data.deliveryAreaId) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Please choose a delivery area', path: ['deliveryAreaId'] });
  if (data.orderType === 'delivery' && (!data.deliveryAddress || data.deliveryAddress.trim().length < 5)) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Please add a delivery address', path: ['deliveryAddress'] });
});
type CheckoutInput = z.infer<typeof checkoutSchema>;
type PaymentMethod = 'bank_transfer' | 'whatsapp';
type PendingPaymentOrder = { order: OrderResponse; checkoutToken: string };

function readPendingPaymentOrder(): PendingPaymentOrder | null {
  if (typeof window === 'undefined') return null;
  try {
    const value = JSON.parse(window.sessionStorage.getItem(PENDING_CHECKOUT_KEY) || 'null') as PendingPaymentOrder | null;
    return value?.order?._id && value.checkoutToken ? value : null;
  } catch { return null; }
}

function Progress({ payment }: { payment: boolean }) {
  return <ol className="tv-checkout__progress" aria-label="Checkout progress"><li data-active={!payment}>1 <span>Your details</span></li><li data-active={payment}>2 <span>Payment</span></li></ol>;
}

export default function CheckoutForm({ onBack, onPlaced, resumePendingPayment = false }: { onBack: () => void; onPlaced: (order: OrderResponse, message: string, checkoutToken?: string) => void; resumePendingPayment?: boolean }) {
  const { lines, clearCart } = useCart();
  const [serverError, setServerError] = useState('');
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);
  const [areas, setAreas] = useState<DeliveryArea[]>([]);
  const [settingsError, setSettingsError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank_transfer');
  const [pendingPaymentOrder, setPendingPaymentOrder] = useState<PendingPaymentOrder | null>(() => resumePendingPayment ? readPendingPaymentOrder() : null);
  const [placingPreparedOrder, setPlacingPreparedOrder] = useState(false);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [receiptName, setReceiptName] = useState('');
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [copiedField, setCopiedField] = useState<'accountName' | 'accountNumber' | ''>('');
  const idempotencyKey = useId();
  const receiptInputId = useId();
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<CheckoutInput>({ resolver: zodResolver(checkoutSchema), defaultValues: { orderType: 'delivery' } });
  const orderType = useWatch({ control, name: 'orderType' });
  const deliveryAreaId = useWatch({ control, name: 'deliveryAreaId' });
  const selectedArea = useMemo(() => areas.find((area) => area._id === deliveryAreaId), [areas, deliveryAreaId]);

  useEffect(() => {
    let active = true;
    getPaymentSettings().then((settings) => { if (active) { setPaymentSettings(settings); setPaymentMethod(settings.bankTransferEnabled ? 'bank_transfer' : 'whatsapp'); } }).catch(() => { if (active) setSettingsError('Payment options are temporarily unavailable. Please try again shortly.'); });
    getDeliveryAreas().then((nextAreas) => { if (active) setAreas(nextAreas); }).catch(() => { /* Pickup remains available when delivery settings are unavailable. */ });
    return () => { active = false; };
  }, []);

  async function onSubmit(data: CheckoutInput) {
    setServerError('');
    if (!paymentSettings) { setServerError(settingsError || 'Please wait for checkout options to load.'); return; }
    try {
      const result = await submitOrder({ customerName: data.customerName, customerPhone: data.customerPhone, orderType: data.orderType, deliveryAreaId: data.orderType === 'delivery' ? data.deliveryAreaId : undefined, deliveryAddress: data.orderType === 'delivery' ? data.deliveryAddress?.trim() : undefined, discountCode: data.discountCode?.trim() || undefined, notes: data.notes, paymentMethod, channel: paymentMethod === 'whatsapp' ? 'whatsapp' : 'website', items: lines.map((line) => ({ menuItemId: line.menuItemId, quantity: line.quantity, addOns: line.addOns.map((addOn) => addOn.name) })) }, idempotencyKey);
      if (paymentMethod === 'bank_transfer') {
        if (!result.checkoutToken || !result.order.paymentInstructions) throw new Error('We could not prepare secure transfer instructions. Please try again.');
        const pending = { order: result.order, checkoutToken: result.checkoutToken }; setPendingPaymentOrder(pending);
        try { window.sessionStorage.setItem(PENDING_CHECKOUT_KEY, JSON.stringify(pending)); } catch { /* In-memory fallback remains available. */ }
        return;
      }
      track('order_submitted', { orderType: data.orderType, paymentMethod, itemCount: lines.length }); clearCart(); onPlaced(result.order, buildOrderMessage(result.order));
    } catch (err) { setServerError(err instanceof Error ? err.message : 'We could not save your order. Please try again.'); }
  }

  async function placeAfterTransfer() {
    if (!pendingPaymentOrder) return;
    if (!paymentConfirmed) { setServerError('Please confirm that you have transferred the exact order total.'); return; }
    if (!receipt) { setServerError('Please attach your payment receipt before placing the order.'); return; }
    setServerError(''); setPlacingPreparedOrder(true);
    try {
      const updated = await uploadPaymentReceipt(pendingPaymentOrder.order._id, pendingPaymentOrder.checkoutToken, receipt);
      const order = await placePreparedOrder(updated._id, pendingPaymentOrder.checkoutToken);
      window.sessionStorage.removeItem(PENDING_CHECKOUT_KEY); track('order_submitted', { orderType: order.orderType, paymentMethod: 'bank_transfer', itemCount: order.items.length }); clearCart(); onPlaced(order, buildOrderMessage(order), pendingPaymentOrder.checkoutToken);
    } catch (err) { setServerError(err instanceof Error ? err.message : 'We could not save the receipt. Your checkout is still available; please try again.'); } finally { setPlacingPreparedOrder(false); }
  }

  async function copyPaymentValue(field: 'accountName' | 'accountNumber', value: string) {
    try {
      await navigator.clipboard?.writeText(value);
      setCopiedField(field);
      window.setTimeout(() => setCopiedField(''), 2200);
    } catch {
      setServerError('Copy was unavailable. Please select and copy the account detail manually.');
    }
  }

  if (pendingPaymentOrder) {
    const { order } = pendingPaymentOrder;
    const instructions = order.paymentInstructions;
    const receiptInput = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] || null;
      if (file && file.size > 8 * 1024 * 1024) {
        setServerError('Receipt must be 8 MB or smaller.');
        return;
      }
      setReceipt(file);
      setReceiptName(file?.name || '');
      setServerError('');
    };
    return <div className="tv-checkout tv-checkout--payment" aria-label="Bank transfer checkout">
      <Progress payment />
      <button type="button" className="tv-checkout__back" onClick={onBack}>&larr; Back to cart</button>
      <section className="tv-payment-card" aria-labelledby="payment-title">
        <div className="tv-payment-card__intro"><p className="tv-eyebrow">Payment verification</p><h3 id="payment-title">Transfer, then attach your receipt</h3><p>Use the account details below to make the exact transfer. Your order is only placed after the receipt is attached.</p></div>
        <div className="tv-payment-callout"><span className="tv-payment-callout__icon" aria-hidden="true">₦</span><div><strong>Transfer exactly {formatNaira(order.total)}</strong><span>Timavelle will verify your payment before preparing the order.</span></div></div>
        <dl className="tv-payment-details">
          <div className="tv-payment-details__reference"><dt>Order reference</dt><dd>{order._id}</dd></div>
          <div className="tv-payment-details__total"><dt>Total to transfer</dt><dd>{formatNaira(order.total)}</dd></div>
          <div><dt>Bank</dt><dd>{instructions?.bankName || '—'}</dd></div>
          <div><dt>Account name</dt><dd><span>{instructions?.accountName || '—'}</span><button type="button" className="tv-copy" onClick={() => void copyPaymentValue('accountName', instructions?.accountName || '')} disabled={!instructions?.accountName}>{copiedField === 'accountName' ? 'Copied' : 'Copy'}</button></dd></div>
          <div><dt>Account number</dt><dd><strong>{instructions?.accountNumber || '—'}</strong><button type="button" className="tv-copy" onClick={() => void copyPaymentValue('accountNumber', instructions?.accountNumber || '')} disabled={!instructions?.accountNumber}>{copiedField === 'accountNumber' ? 'Copied' : 'Copy'}</button></dd></div>
        </dl>
      </section>
      <label className="tv-checkout__confirm"><input type="checkbox" checked={paymentConfirmed} onChange={(event) => setPaymentConfirmed(event.target.checked)} /><span><strong>I have completed the transfer</strong><small>I confirm that I paid {formatNaira(order.total)} to the account above.</small></span></label>
      <section className="tv-receipt-card" aria-labelledby="receipt-title"><div><p className="tv-eyebrow">Required before placing order</p><h3 id="receipt-title">Upload your payment receipt</h3><p>Attach a screenshot, photo, or PDF so our team can verify the transfer.</p></div><label className="tv-receipt-upload" htmlFor={receiptInputId}><input id={receiptInputId} type="file" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={receiptInput} /><span className="tv-receipt-upload__button"><span aria-hidden="true">↑</span>{receiptName ? 'Replace receipt' : 'Choose receipt file'}</span><span className="tv-receipt-upload__hint">JPG, PNG, WebP or PDF · max 8 MB</span></label>{receiptName && <div className="tv-receipt-upload__attached" role="status"><span aria-hidden="true">✓</span><span><strong>{receiptName}</strong><small>Receipt attached and ready to submit</small></span><button type="button" onClick={() => { setReceipt(null); setReceiptName(''); }}>Remove</button></div>}</section>
      {serverError && <p role="alert" className="tv-checkout__error">{serverError}</p>}
      <button type="button" className="tv-checkout__submit tv-checkout__submit--payment" onClick={() => void placeAfterTransfer()} disabled={placingPreparedOrder || !instructions || !paymentConfirmed || !receipt}>{placingPreparedOrder ? 'Uploading receipt…' : 'Place order securely'}</button>
      <p className="tv-payment-security"><span aria-hidden="true">⌁</span>Your payment details are sent securely for Timavelle verification.</p>
    </div>;
  }

  return <form onSubmit={handleSubmit(onSubmit)} className="tv-checkout" aria-label="Checkout"><Progress payment={false} /><button type="button" className="tv-checkout__back" onClick={onBack}>&larr; Back to cart</button><div className="tv-checkout__field"><label htmlFor="checkout-name">Full name</label><input id="checkout-name" autoComplete="name" {...register('customerName')} placeholder="Your name" aria-invalid={Boolean(errors.customerName)} />{errors.customerName && <p role="alert">{errors.customerName.message}</p>}</div><div className="tv-checkout__field"><label htmlFor="checkout-phone">Phone number</label><input id="checkout-phone" autoComplete="tel" {...register('customerPhone')} placeholder="+234 …" aria-invalid={Boolean(errors.customerPhone)} />{errors.customerPhone && <p role="alert">{errors.customerPhone.message}</p>}</div><fieldset className="tv-checkout__order-type"><legend>How should we fulfil it?</legend><label><input type="radio" value="delivery" {...register('orderType')} /> Delivery</label><label><input type="radio" value="pickup" {...register('orderType')} /> Pickup</label></fieldset>{orderType === 'delivery' && <><div className="tv-checkout__field"><label htmlFor="checkout-area">Delivery area</label><select id="checkout-area" {...register('deliveryAreaId')}><option value="">Choose your area…</option>{areas.map((area) => <option key={area._id} value={area._id}>{area.name} · {formatNaira(area.fee)}</option>)}</select>{errors.deliveryAreaId && <p role="alert">{errors.deliveryAreaId.message}</p>}{selectedArea && <small className="tv-checkout__hint">Delivery fee: {formatNaira(selectedArea.fee)}</small>}</div><div className="tv-checkout__field"><label htmlFor="checkout-address">Delivery address</label><textarea id="checkout-address" {...register('deliveryAddress')} placeholder="Street, house number, landmark" rows={3} aria-invalid={Boolean(errors.deliveryAddress)} />{errors.deliveryAddress && <p role="alert">{errors.deliveryAddress.message}</p>}</div></>}<div className="tv-checkout__field"><label htmlFor="checkout-discount">Discount code <span>(optional)</span></label><input id="checkout-discount" {...register('discountCode')} placeholder="Enter code" autoCapitalize="characters" /><small className="tv-checkout__hint">The server validates the code when your order is submitted.</small></div><div className="tv-checkout__field"><label htmlFor="checkout-notes">Order notes <span>(optional)</span></label><textarea id="checkout-notes" {...register('notes')} placeholder="Allergies, preferences, delivery instructions…" rows={3} /></div><fieldset className="tv-checkout__order-type tv-checkout__payment-choice"><legend>Payment</legend>{paymentSettings?.bankTransferEnabled && <label><input type="radio" name="paymentMethod" value="bank_transfer" checked={paymentMethod === 'bank_transfer'} onChange={() => setPaymentMethod('bank_transfer')} /> Bank transfer</label>}{paymentSettings?.whatsappEnabled && <label><input type="radio" name="paymentMethod" value="whatsapp" checked={paymentMethod === 'whatsapp'} onChange={() => setPaymentMethod('whatsapp')} /> WhatsApp</label>}</fieldset>{paymentMethod === 'bank_transfer' && <p className="tv-checkout__transfer-note">Your total, delivery fee, and discount will be calculated securely from the live menu and checkout settings.</p>}{settingsError && <p role="alert" className="tv-checkout__error">{settingsError}</p>}{serverError && <p role="alert" className="tv-checkout__error">{serverError}</p>}<button type="submit" className="tv-checkout__submit" disabled={isSubmitting || !paymentSettings || (!paymentSettings.bankTransferEnabled && !paymentSettings.whatsappEnabled)}>{isSubmitting ? 'Preparing checkout…' : paymentMethod === 'bank_transfer' ? 'Continue to payment' : 'Place order & continue via WhatsApp'}</button></form>;
}
