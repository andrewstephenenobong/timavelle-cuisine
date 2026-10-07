import type { OrderResponse } from './api';

function formatNaira(value: number) {
  return `NGN ${value.toLocaleString('en-NG')}`;
}

function safeFilename(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, '-');
}

export async function downloadOrderReceipt(order: OrderResponse) {
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = 22;

  const ensureSpace = (height: number) => {
    if (y + height > pageHeight - margin) {
      pdf.addPage();
      y = margin;
    }
  };
  const writeWrapped = (text: string, x: number, width: number, lineHeight = 5) => {
    const lines = pdf.splitTextToSize(text, width) as string[];
    ensureSpace(lines.length * lineHeight + 2);
    pdf.text(lines, x, y);
    y += lines.length * lineHeight;
  };

  pdf.setTextColor(91, 50, 38);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(19);
  pdf.text('TIMAVELLE CUISINE', margin, y);
  y += 9;
  pdf.setFontSize(14);
  pdf.text('ORDER RECEIPT', margin, y);
  y += 7;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(70, 65, 60);
  pdf.text(`Order reference: ${order._id}`, margin, y);
  y += 5;
  const createdAt = order.createdAt
    ? new Intl.DateTimeFormat('en-NG', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Africa/Lagos' }).format(new Date(order.createdAt))
    : 'Just placed';
  pdf.text(`Placed: ${createdAt}`, margin, y);
  y += 9;

  pdf.setDrawColor(220, 210, 200);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 8;
  pdf.setFont('helvetica', 'bold');
  pdf.text('CUSTOMER', margin, y);
  y += 6;
  pdf.setFont('helvetica', 'normal');
  writeWrapped(`${order.customerName}  |  ${order.customerPhone}`, margin, contentWidth);
  pdf.text(`Fulfilment: ${order.orderType === 'delivery' ? 'Delivery' : 'Pickup'}`, margin, y);
  y += 6;
  if (order.orderType === 'delivery' && order.deliveryAddress) {
    writeWrapped(`Delivery address: ${order.deliveryAddress}`, margin, contentWidth);
  }
  y += 3;

  pdf.setDrawColor(220, 210, 200);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 8;
  pdf.setFont('helvetica', 'bold');
  pdf.text('ITEMS', margin, y);
  y += 7;

  for (const item of order.items) {
    ensureSpace(15);
    pdf.setFont('helvetica', 'bold');
    const addOns = item.addOns.length ? ` (${item.addOns.map((addOn) => addOn.name).join(', ')})` : '';
    writeWrapped(`${item.name}${addOns} x ${item.quantity}`, margin, contentWidth - 35);
    pdf.setFont('helvetica', 'normal');
    pdf.text(formatNaira(item.lineTotal), pageWidth - margin, y - 5, { align: 'right' });
    y += 2;
  }

  ensureSpace(30);
  y += 3;
  pdf.setDrawColor(220, 210, 200);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 7;
  pdf.setFont('helvetica', 'normal');
  pdf.text('Subtotal', margin, y);
  pdf.text(formatNaira(order.subtotal), pageWidth - margin, y, { align: 'right' });
  y += 7;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.text('TOTAL', margin, y);
  pdf.text(formatNaira(order.total), pageWidth - margin, y, { align: 'right' });
  y += 11;

  if (order.notes?.trim()) {
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ORDER NOTES', margin, y);
    y += 6;
    pdf.setFont('helvetica', 'normal');
    writeWrapped(order.notes.trim(), margin, contentWidth);
    y += 3;
  }

  ensureSpace(15);
  pdf.setDrawColor(220, 210, 200);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 7;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(91, 50, 38);
  pdf.text('This is an order receipt, not proof of payment.', margin, y);
  y += 5;
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(90, 85, 80);
  writeWrapped('Payment is confirmed separately by Timavelle Cuisine. Please attach this PDF when contacting us about your order or sending payment information.', margin, contentWidth, 4.5);

  pdf.save(`Timavelle-order-${safeFilename(order._id)}.pdf`);
}
