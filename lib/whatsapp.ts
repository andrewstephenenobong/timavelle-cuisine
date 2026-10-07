// Builds the exact WhatsApp order message the customer's phone opens pre-filled with,
// and holds the single business WhatsApp number used across the site.
import type { CartLine } from './cart-types';
import { getLineTotal } from './cart-types';

export const BUSINESS_WHATSAPP_NUMBER = '2347015990266';

export interface WhatsAppOrderDetails {
  customerName: string;
  customerPhone: string;
  orderType: 'delivery' | 'pickup';
  deliveryAddress?: string;
  notes?: string;
}

function formatNaira(value: number) {
  return `₦${value.toLocaleString('en-NG')}`;
}

export function buildOrderMessage(details: WhatsAppOrderDetails, lines: CartLine[], subtotal: number, total: number) {
  const itemLines = lines.map((line) => {
    const addOnSuffix = line.addOns.length ? ` (${line.addOns.map((addOn) => addOn.name).join(', ')})` : '';
    return `- ${line.name}${addOnSuffix} × ${line.quantity} — ${formatNaira(getLineTotal(line))}`;
  }).join('\n');

  return [
    `Customer Name: ${details.customerName}`,
    `Phone Number: ${details.customerPhone}`,
    `Order Type: ${details.orderType === 'delivery' ? 'Delivery' : 'Pickup'}`,
    details.orderType === 'delivery' && details.deliveryAddress ? `Delivery Address: ${details.deliveryAddress}` : null,
    '',
    'Items:',
    itemLines,
    '',
    `Subtotal: ${formatNaira(subtotal)}`,
    `Total: ${formatNaira(total)}`,
    '',
    `Additional Notes: ${details.notes?.trim() || 'None'}`,
  ].filter((line) => line !== null).join('\n');
}

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
