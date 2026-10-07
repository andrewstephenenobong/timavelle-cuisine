// A tiny external store over localStorage for the cart. Reading it through
// React's useSyncExternalStore (rather than "load in a useEffect, then setState")
// keeps the in-memory value and localStorage perfectly in sync with no extra render
// pass and no risk of them drifting apart.
import type { CartLine } from './cart-types';

const STORAGE_KEY = 'timavelle_cart_v1';
const CHANGE_EVENT = 'timavelle-cart-change';
const EMPTY_LINES: CartLine[] = [];

function parseLines(raw: string | null): CartLine[] {
  if (!raw) return EMPTY_LINES;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY_LINES;
    const valid = parsed.filter((line): line is CartLine =>
      Boolean(line) && typeof line.lineId === 'string' && typeof line.menuItemId === 'string' && Array.isArray(line.addOns));
    return valid.length ? valid : EMPTY_LINES;
  } catch {
    return EMPTY_LINES;
  }
}

// useSyncExternalStore requires getSnapshot to return a referentially stable value
// when nothing has changed, so the parsed result is cached against the raw string.
let cachedRaw: string | null | undefined;
let cachedLines: CartLine[] = EMPTY_LINES;

export function getCartSnapshot(): CartLine[] {
  if (typeof window === 'undefined') return EMPTY_LINES;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedLines;
  cachedRaw = raw;
  cachedLines = parseLines(raw);
  return cachedLines;
}

export function getCartServerSnapshot(): CartLine[] {
  return EMPTY_LINES;
}

export function subscribeToCart(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

export function writeCartLines(lines: CartLine[]) {
  if (typeof window === 'undefined') return;
  const raw = JSON.stringify(lines);
  cachedRaw = raw;
  cachedLines = lines;
  try {
    window.localStorage.setItem(STORAGE_KEY, raw);
  } catch {
    // Storage can fail (private browsing, full quota) — the module cache above still
    // keeps the cart working correctly for the rest of this session.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

// Standard useSyncExternalStore trick for "has this mounted on the client yet" —
// server and the first client render both see false, then it flips to true.
export function subscribeIsClient() {
  return () => {};
}
export function getIsClientSnapshot() {
  return true;
}
export function getIsClientServerSnapshot() {
  return false;
}
