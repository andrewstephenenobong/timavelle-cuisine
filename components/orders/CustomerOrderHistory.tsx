'use client';

import { useEffect, useMemo, useState } from 'react';
import { getCustomerOrders, lookupCustomerHistory, type CustomerHistoryOrder } from '@/lib/api';

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
  const [orders, setOrders] = useState<CustomerHistoryOrder[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [step, setStep] = useState<'phone' | 'history'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesSearch = !query || [order._id, order.status, order.customerName, order.deliveryAreaName, ...order.items.flatMap((item) => [item.name, ...item.addOns.map((addOn) => addOn.name)])].some((value) => value?.toLowerCase().includes(query));
      return matchesSearch && (statusFilter === 'all' || order.status === statusFilter) && (typeFilter === 'all' || order.orderType === typeFilter);
    });
  }, [orders, search, statusFilter, typeFilter]);

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

  async function lookupOrders(event: React.FormEvent) {
    event.preventDefault();
    setError(''); setLoading(true);
    try {
      const result = await lookupCustomerHistory(phone);
      window.localStorage.setItem(HISTORY_TOKEN_KEY, result.token);
      setToken(result.token);
      setOrders(await getCustomerOrders(result.token));
      setStep('history');
    } catch (err) { setError(err instanceof Error ? err.message : 'We could not load your orders.'); }
    finally { setLoading(false); }
  }

  function signOut() {
    window.localStorage.removeItem(HISTORY_TOKEN_KEY);
    setToken(''); setOrders([]); setPhone(''); setError(''); setStep('phone');
  }

  if (step === 'history' && token) return <main className="tv-history-page"><header className="tv-history-page__header"><div><p className="tv-eyebrow">Your Timavelle account</p><h1>Your order <em>history.</em></h1><p>Review what you ordered, payment progress, and delivery or pickup details.</p></div><button type="button" className="tv-history-page__signout" onClick={signOut}>Sign out</button></header>{loading && <p className="tv-history-page__status" role="status">Refreshing your orders…</p>}{!loading && orders.length === 0 && <section className="tv-history-page__empty"><p className="tv-eyebrow">No orders yet</p><h2>Your next Timavelle experience starts here.</h2><p>Orders placed with this phone number will appear here after checkout.</p><a href="/menu" className="tv-history-page__primary">Explore the menu</a></section>}{!loading && orders.length > 0 && <><section className="tv-history-filters" aria-label="Find an order"><div className="tv-history-filters__search"><label htmlFor="order-history-search">Search orders</label><input id="order-history-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Order number, dish, or area" /></div><div><label htmlFor="order-history-status">Status</label><select id="order-history-status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="all">All statuses</option>{Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div><div><label htmlFor="order-history-type">Fulfilment</label><select id="order-history-type" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}><option value="all">Delivery & pickup</option><option value="delivery">Delivery</option><option value="pickup">Pickup</option></select></div></section><p className="tv-history-results" role="status">Showing {filteredOrders.length} of {orders.length} {orders.length === 1 ? 'order' : 'orders'}</p>{filteredOrders.length > 0 ? <div className="tv-history-list">{filteredOrders.map((order) => <article className="tv-history-card" key={order._id}><div className="tv-history-card__top"><div><span className="tv-history-card__eyebrow">Order #{order._id.slice(-8)}</span><h2>{labels[order.status] || 'Order update'}</h2><p>{formatDate(order.createdAt)} · {order.orderType === 'delivery' ? 'Delivery' : 'Pickup'}</p></div><strong>{money(order.total)}</strong></div><div className="tv-history-card__items">{order.items.map((item, index) => <div key={`${order._id}-${index}`}><span>{item.quantity}× {item.name}{item.addOns.length ? ` · ${item.addOns.map((addOn) => addOn.name).join(', ')}` : ''}</span><strong>{money(item.lineTotal)}</strong></div>)}</div><div className="tv-history-card__meta"><span>Payment: <strong>{paymentLabels[order.paymentStatus] || 'Payment update'}</strong></span>{order.orderType === 'delivery' && <span>{order.deliveryAreaName || 'Delivery'}{order.deliveryAddress ? ` · ${order.deliveryAddress}` : ''}</span>}</div>{order.paymentRejectionReason && <p className="tv-history-card__notice">Payment note: {order.paymentRejectionReason}</p>}</article>)}</div> : <section className="tv-history-page__empty tv-history-page__empty--filtered"><h2>No matching orders</h2><p>Try a different search term or clear one of the filters.</p><button type="button" className="tv-history-page__secondary" onClick={() => { setSearch(''); setStatusFilter('all'); setTypeFilter('all'); }}>Clear filters</button></section>}</>}<a href="/menu" className="tv-history-page__link">Continue shopping ↗</a></main>;

  return <main className="tv-history-page"><section className="tv-history-auth"><p className="tv-eyebrow">Private customer access</p><h1>See your order <em>history.</em></h1><p>Enter the phone number you used during checkout to view your Timavelle orders on this device.</p><form onSubmit={lookupOrders} className="tv-history-auth__form"><label htmlFor="history-phone">Phone number used at checkout</label><input id="history-phone" type="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+234 …" required /><button type="submit" className="tv-history-page__primary" disabled={loading}>{loading ? 'Loading your orders…' : 'View my orders'}</button></form>{error && <p className="tv-history-page__error" role="alert">{error}</p>}<p className="tv-history-auth__footer">Use the same number you entered when placing your order.</p></section></main>;
}
