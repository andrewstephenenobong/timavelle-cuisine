// Builds the exact WhatsApp order message the customer's phone opens pre-filled with,
// and holds the single business WhatsApp number used across the site.
export const BUSINESS_WHATSAPP_NUMBER = '2347015990266';

export interface WhatsAppOrderSnapshot {
  _id: string;
  customerName: string;
  customerPhone: string;
  orderType: 'delivery' | 'pickup';
  deliveryAddress?: string;
  notes?: string;
  items: { name: string; quantity: number; addOns: { name: string; price: number }[]; lineTotal: number }[];
  subtotal: number;
  total: number;
}

function formatNaira(value: number) {
  return `₦${value.toLocaleString('en-NG')}`;
}

export function buildOrderMessage(order: WhatsAppOrderSnapshot) {
  const itemLines = order.items.map((line) => {
    const addOnSuffix = line.addOns.length ? ` (${line.addOns.map((addOn) => addOn.name).join(', ')})` : '';
    return `- ${line.name}${addOnSuffix} × ${line.quantity} — ${formatNaira(line.lineTotal)}`;
  }).join('\n');

  return [
    'TIMAVELLE CUISINE — ORDER',
    `Order: #${order._id}`,
    `Customer Name: ${order.customerName}`,
    `Phone Number: ${order.customerPhone}`,
    `Order Type: ${order.orderType === 'delivery' ? 'Delivery' : 'Pickup'}`,
    order.orderType === 'delivery' && order.deliveryAddress ? `Delivery Address: ${order.deliveryAddress}` : null,
    '',
    'Items:',
    itemLines,
    '',
    `Subtotal: ${formatNaira(order.subtotal)}`,
    `Total: ${formatNaira(order.total)}`,
    '',
    `Additional Notes: ${order.notes?.trim() || 'None'}`,
  ].filter((line) => line !== null).join('\n');
}

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
