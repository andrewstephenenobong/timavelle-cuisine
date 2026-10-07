'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { track } from '@vercel/analytics';
import { submitOrder, type OrderResponse } from '@/lib/api';
import { useCart } from './CartProvider';
import { buildOrderMessage } from '@/lib/whatsapp';

function formatNaira(value: number) {
  return `₦${value.toLocaleString('en-NG')}`;
}

const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Please enter your name'),
  customerPhone: z.string().min(7, 'Please enter a valid phone number'),
  orderType: z.enum(['delivery', 'pickup']),
  deliveryAddress: z.string().optional(),
  notes: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.orderType === 'delivery' && (!data.deliveryAddress || data.deliveryAddress.trim().length < 5)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Please add a delivery address', path: ['deliveryAddress'] });
  }
});

type CheckoutInput = z.infer<typeof checkoutSchema>;

export default function CheckoutForm({ onBack, onPlaced }: { onBack: () => void; onPlaced: (order: OrderResponse, message: string) => void }) {
  const { lines, subtotal, clearCart } = useCart();
  const [serverError, setServerError] = useState('');
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { orderType: 'delivery' },
  });
  const orderType = watch('orderType');

  async function onSubmit(data: CheckoutInput) {
    setServerError('');
    try {
      const order = await submitOrder({
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        orderType: data.orderType,
        deliveryAddress: data.orderType === 'delivery' ? data.deliveryAddress : undefined,
        notes: data.notes,
        channel: 'whatsapp',
        items: lines.map((line) => ({ menuItemId: line.menuItemId, quantity: line.quantity, addOns: line.addOns.map((addOn) => addOn.name) })),
      });
      const message = buildOrderMessage(order);
      track('order_submitted', { orderType: data.orderType, itemCount: lines.length });
      clearCart();
      onPlaced(order, message);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong placing your order. Please try again.');
    }
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

      {orderType === 'delivery' && (
        <div className="tv-checkout__field">
          <label htmlFor="checkout-address">Delivery address</label>
          <textarea id="checkout-address" {...register('deliveryAddress')} placeholder="Street, area, landmark" rows={2} aria-invalid={Boolean(errors.deliveryAddress)} />
          {errors.deliveryAddress && <p role="alert">{errors.deliveryAddress.message}</p>}
        </div>
      )}

      <div className="tv-checkout__field">
        <label htmlFor="checkout-notes">Additional notes <span>(optional)</span></label>
        <textarea id="checkout-notes" {...register('notes')} placeholder="Anything we should know…" rows={2} />
      </div>

      {serverError && <p role="alert" className="tv-checkout__error">{serverError}</p>}

      <button type="submit" className="tv-checkout__submit" disabled={isSubmitting}>
        {isSubmitting ? 'Placing order…' : `Place Order · ${formatNaira(subtotal)}`}
      </button>
    </form>
  );
}
