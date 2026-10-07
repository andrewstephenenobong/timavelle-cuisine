'use client';

import { useEffect, useState } from 'react';
import { getCustomerOrders, requestCustomerOtp, verifyCustomerOtp, type CustomerHistoryOrder } from '@/lib/api';

const HISTORY_TOKEN_KEY = 'timavelle_customer_history_token_v1';
const money = (value: number) => `₦${value.toLocaleString('en-NG')}`;
const labels: Record<string, string> = { awaiting_payment: 'Payment pending', new: 'Order submitted', confirmed: 'Order accepted', preparing: 'Preparing', ready: 'Ready / out for delivery', completed: 'Completed', cancelled: 'Cancelled' };
const paymentLabels: Record<string, string> = { unpaid: 'Payment pending', receipt_submitted: 'Receipt submitted', paid: 'Payment verified', rejected: 'Receipt needs attention', refunded: 'Refunded' };

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-NG', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Africa/Lagos' }).format(new Date(value));
}

export default function CustomerOrderHistory() {
  const [token, setToken] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [devCode, setDevCode] = useState('');
  const [orders, setOrders] = useState<CustomerHistoryOrder[]>([]);
  const [step, setStep] = useState<'phone' | 'code' | 'history'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const savedToken = window.localStorage.getItem(HISTORY_TOKEN_KEY) || '';
      if (!savedToken) return;
      setToken(savedToken);
      setLoading(true);
      void getCustomerOrders(savedToken).then((items) => { setOrders(items); setStep('history'); }).catch(() => { window.localStorage.removeItem(HISTORY_TOKEN_KEY); setToken(''); }).finally(() => setLoading(false));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function sendCode(event: React.FormEvent) {
    event.preventDefault();
    setError(''); setLoading(true);
    try {
      const result = await requestCustomerOtp(phone);
      setDevCode(result.devCode || '');
      setStep('code');
    } catch (err) { setError(err instanceof Error ? err.message : 'We could not prepare a verification code.'); }
    finally { setLoading(false); }
  }

  async function verifyCode(event: React.FormEvent) {
    event.preventDefault();
    setError(''); setLoading(true);
    try {
      const result = await verifyCustomerOtp(phone, code);
      window.localStorage.setItem(HISTORY_TOKEN_KEY, result.token);
      setToken(result.token);
      setOrders(await getCustomerOrders(result.token));
      setStep('history');
    } catch (err) { setError(err instanceof Error ? err.message : 'We could not verify that code.'); }
    finally { setLoading(false); }
  }

  function signOut() {
    window.localStorage.removeItem(HISTORY_TOKEN_KEY);
    setToken(''); setOrders([]); setPhone(''); setCode(''); setDevCode(''); setError(''); setStep('phone');
  }

  if (step === 'history' && token) return <main className="tv-history-page"><header className="tv-history-page__header"><div><p className="tv-eyebrow">Your Timavelle account</p><h1>Your order <em>history.</em></h1><p>Review what you ordered, payment progress, and delivery or pickup details.</p></div><button type="button" className="tv-history-page__signout" onClick={signOut}>Sign out</button></header>{loading && <p className="tv-history-page__status" role="status">Refreshing your orders…</p>}{!loading && orders.length === 0 && <section className="tv-history-page__empty"><p className="tv-eyebrow">No orders yet</p><h2>Your next Timavelle experience starts here.</h2><p>Orders placed with this phone number will appear here after checkout.</p><a href="/menu" className="tv-history-page__primary">Explore the menu</a></section>}{!loading && orders.length > 0 && <div className="tv-history-list">{orders.map((order) => <article className="tv-history-card" key={order._id}><div className="tv-history-card__top"><div><span className="tv-history-card__eyebrow">Order #{order._id.slice(-8)}</span><h2>{labels[order.status] || 'Order update'}</h2><p>{formatDate(order.createdAt)} · {order.orderType === 'delivery' ? 'Delivery' : 'Pickup'}</p></div><strong>{money(order.total)}</strong></div><div className="tv-history-card__items">{order.items.map((item, index) => <div key={`${order._id}-${index}`}><span>{item.quantity}× {item.name}{item.addOns.length ? ` · ${item.addOns.map((addOn) => addOn.name).join(', ')}` : ''}</span><strong>{money(item.lineTotal)}</strong></div>)}</div><div className="tv-history-card__meta"><span>Payment: <strong>{paymentLabels[order.paymentStatus] || 'Payment update'}</strong></span>{order.orderType === 'delivery' && <span>{order.deliveryAreaName || 'Delivery'}{order.deliveryAddress ? ` · ${order.deliveryAddress}` : ''}</span>}</div>{order.paymentRejectionReason && <p className="tv-history-card__notice">Payment note: {order.paymentRejectionReason}</p>}</article>)}</div>}<a href="/menu" className="tv-history-page__link">Continue shopping ↗</a></main>;

  return <main className="tv-history-page"><section className="tv-history-auth"><p className="tv-eyebrow">Private customer access</p><h1>See your order <em>history.</em></h1><p>Verify the phone number used at checkout to securely view your Timavelle orders on this device.</p>{step === 'phone' && <form onSubmit={sendCode} className="tv-history-auth__form"><label htmlFor="history-phone">Phone number</label><input id="history-phone" type="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+234 …" required /><button type="submit" className="tv-history-page__primary" disabled={loading}>{loading ? 'Preparing code…' : 'Send verification code'}</button></form>}{step === 'code' && <form onSubmit={verifyCode} className="tv-history-auth__form"><label htmlFor="history-code">Verification code</label><p className="tv-history-auth__hint">Enter the six-digit code sent to your phone.</p><input id="history-code" inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="123456" minLength={6} maxLength={6} required />{devCode && <p className="tv-history-auth__dev" role="status">Development mode code: <strong>{devCode}</strong></p>}<button type="submit" className="tv-history-page__primary" disabled={loading || code.length !== 6}>{loading ? 'Verifying…' : 'View my orders'}</button><button type="button" className="tv-history-page__secondary" onClick={() => { setStep('phone'); setCode(''); setDevCode(''); }}>Use a different number</button></form>}{error && <p className="tv-history-page__error" role="alert">{error}</p>}<p className="tv-history-auth__footer">Your order history is private and only available after phone verification.</p></section></main>;
}
