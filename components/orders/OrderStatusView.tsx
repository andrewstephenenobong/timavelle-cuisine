'use client';

import { useEffect, useState } from 'react';
import { accessOrder, type OrderResponse } from '@/lib/api';

const steps = ['new', 'confirmed', 'preparing', 'ready', 'completed'];
const labels: Record<string, string> = { awaiting_payment: 'Payment pending', new: 'Order submitted', confirmed: 'Order accepted', preparing: 'Preparing', ready: 'Ready / out for delivery', completed: 'Completed', cancelled: 'Cancelled' };
const money = (value: number) => `₦${value.toLocaleString('en-NG')}`;

export default function OrderStatusView({ orderId, token }: { orderId: string; token: string }) {
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(Boolean(token));
  const missingToken = !token;

  useEffect(() => {
    if (!token) return;
    let active = true;
    void accessOrder(orderId, token).then((value) => { if (active) setOrder(value); }).catch((err) => { if (active) setError(err instanceof Error ? err.message : 'We could not load this order.'); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [orderId, token]);

  if (loading) return <main className="tv-order-page"><div className="tv-order-page__loading" aria-live="polite"><span className="tv-loading-dot" /> Loading your order securely…</div></main>;
  if (missingToken || error || !order) return <main className="tv-order-page"><section className="tv-order-page__empty"><p className="tv-eyebrow">Private order link</p><h1>We could not open this order.</h1><p role="alert">{missingToken ? 'This order link is missing its secure access token.' : error}</p><a className="tv-order-page__link" href="/menu">Return to menu</a></section></main>;

  const activeIndex = steps.indexOf(order.status);
  const paymentCopy = order.paymentStatus === 'paid' ? 'Verified' : order.paymentStatus === 'receipt_submitted' ? 'Receipt submitted · verification pending' : order.paymentStatus === 'rejected' ? 'Receipt needs attention' : order.paymentStatus;
  return <main className="tv-order-page"><header><p className="tv-eyebrow">Private order link · #{order._id}</p><h1>Your order is <em>{labels[order.status] || order.status}.</em></h1><p>Placed {new Intl.DateTimeFormat('en-NG', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Africa/Lagos' }).format(new Date(order.createdAt))}</p></header><section className="tv-order-page__card"><div className="tv-order-page__status"><div><span className="tv-order-page__status-kicker">Current status</span><strong>{labels[order.status] || order.status}</strong></div><div><span className="tv-order-page__status-kicker">Payment</span><span>{paymentCopy}</span></div></div>{order.paymentStatus === 'rejected' && <p className="tv-order-page__notice" role="status">Please contact Timavelle on WhatsApp with your order reference so we can help verify your payment.</p>}<ol className="tv-order-page__timeline">{steps.map((step, index) => <li key={step} data-current={step === order.status} data-complete={activeIndex >= index}><span>{activeIndex >= index ? '✓' : index + 1}</span><div><strong>{labels[step]}</strong>{step === order.status && <small>Current step</small>}</div></li>)}</ol><div className="tv-order-page__items"><div className="tv-order-page__section-head"><h2>Your order</h2><span>{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span></div>{order.items.map((item, index) => <div key={`${item.name}-${index}`}><span>{item.quantity}× {item.name}{item.addOns.length ? ` · ${item.addOns.map((addon) => addon.name).join(', ')}` : ''}</span><strong>{money(item.lineTotal)}</strong></div>)}</div><dl className="tv-order-page__totals"><div><dt>Subtotal</dt><dd>{money(order.subtotal)}</dd></div>{order.deliveryFee > 0 && <div><dt>Delivery · {order.deliveryAreaName}</dt><dd>{money(order.deliveryFee)}</dd></div>}{order.discountAmount > 0 && <div><dt>Discount {order.discountCode ? `(${order.discountCode})` : ''}</dt><dd>-{money(order.discountAmount)}</dd></div>}<div><dt>Total</dt><dd>{money(order.total)}</dd></div></dl><div className="tv-order-page__facts"><p><strong>{order.orderType === 'delivery' ? 'Delivery' : 'Pickup'}</strong>{order.orderType === 'delivery' ? ` · ${order.deliveryAddress}` : ''}</p>{order.notes && <p>Notes: {order.notes}</p>}</div></section><a className="tv-order-page__link" href="/menu">Continue shopping ↗</a></main>;
}
