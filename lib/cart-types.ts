// Pure cart types and helpers, kept framework-free so the same logic can be reused by the
// cart context, the checkout summary, and (eventually) any other surface that needs it.

export interface CartAddOn {
  name: string;
  price: number;
}

export interface CartLine {
  lineId: string;
  menuItemId: string;
  name: string;
  unitPrice: number;
  image?: string;
  quantity: number;
  addOns: CartAddOn[];
}

export interface AddToCartInput {
  menuItemId: string;
  name: string;
  unitPrice: number;
  image?: string;
  quantity: number;
  addOns: CartAddOn[];
}

// Two cart lines are "the same line" only if they're the same dish with the exact same
// add-ons selected — so "Jollof, no add-ons" and "Jollof, extra chicken" stay separate entries.
export function buildLineId(menuItemId: string, addOns: CartAddOn[]) {
  const addOnKey = [...addOns].map((addOn) => addOn.name).sort().join('|');
  return `${menuItemId}::${addOnKey}`;
}

export function getLineUnitPrice(line: Pick<CartLine, 'unitPrice' | 'addOns'>) {
  return line.unitPrice + line.addOns.reduce((sum, addOn) => sum + addOn.price, 0);
}

export function getLineTotal(line: Pick<CartLine, 'unitPrice' | 'addOns' | 'quantity'>) {
  return getLineUnitPrice(line) * line.quantity;
}

export function getCartSubtotal(lines: CartLine[]) {
  return lines.reduce((sum, line) => sum + getLineTotal(line), 0);
}

export function getCartItemCount(lines: CartLine[]) {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}
