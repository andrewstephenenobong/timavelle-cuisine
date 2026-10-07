const DEFAULT_API_URL = 'https://timavelle-cuisine-backend.onrender.com';

export interface MenuAddOn {
  name: string;
  price: number;
}

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  addOns: MenuAddOn[];
  image?: string;
  featured?: boolean;
}

export interface GalleryImage {
  _id: string;
  imageUrl: string;
  caption?: string;
  category: string;
}

export interface Testimonial {
  _id: string;
  clientName: string;
  quote: string;
  eventType?: string;
}

export interface ServiceItem {
  _id: string;
  title: string;
  description: string;
}

export interface HeroImage {
  _id?: string;
  imageUrl: string;
  altText: string;
  publishedAt?: string;
}

export interface AboutImage {
  _id?: string;
  imageUrl: string;
  altText: string;
  publishedAt?: string;
} 

export interface FaqItem {
  _id: string;
  question: string;
  answer: string;
}

export interface ContactDetail {
  key: string;
  value: string;
}

export interface EnquiryPayload {
  name: string;
  email: string;
  phone?: string;
  eventDate?: string;
  partySize?: number | '';
  message: string;
}

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;

export async function publicApiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}/api${path}`, {
    cache: 'no-store',
    ...init,
  });
  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message = typeof payload === 'object' && payload !== null && 'error' in payload && typeof payload.error === 'string'
      ? payload.error
      : 'The Timavelle API is temporarily unavailable.';
    throw new Error(message);
  }
  return payload as T;
}

export async function getMenuItems(): Promise<MenuItem[]> {
  try {
    const payload = await publicApiRequest<{ items?: MenuItem[] }>('/menu');
    return payload.items || [];
  } catch {
    return [];
  }
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  try {
    const payload = await publicApiRequest<{ images?: GalleryImage[] }>('/gallery');
    return payload.images || [];
  } catch {
    return [];
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const payload = await publicApiRequest<{ testimonials?: Testimonial[] }>('/testimonials');
    return payload.testimonials || [];
  } catch {
    return [];
  }
}

export async function getServices(): Promise<ServiceItem[]> {
  try {
    const payload = await publicApiRequest<{ items?: ServiceItem[] }>('/services');
    return payload.items || [];
  } catch {
    return [];
  }
}

export async function getHeroImage(): Promise<HeroImage | null> {
  try {
    const payload = await publicApiRequest<{ item?: HeroImage | null }>('/hero-image');
    return payload.item || null;
  } catch {
    return null;
  }
}

export async function getAboutImage(): Promise<AboutImage | null> {
  try {
    const payload = await publicApiRequest<{ item?: AboutImage | null }>('/about-image');
    return payload.item || null;
  } catch {
    return null;
  }
}

export async function getFaqs(): Promise<FaqItem[]> {
  try {
    const payload = await publicApiRequest<{ items?: FaqItem[] }>('/faqs');
    return payload.items || [];
  } catch {
    return [];
  }
}

export async function getContactDetails(): Promise<ContactDetail[]> {
  try {
    const payload = await publicApiRequest<{ items?: ContactDetail[] }>('/contact-details');
    return payload.items || [];
  } catch {
    return [];
  }
}

export async function submitEnquiry(data: EnquiryPayload): Promise<void> {
  await publicApiRequest('/enquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}


export interface OrderItemPayload {
  menuItemId: string;
  quantity: number;
  addOns: string[];
}

export interface OrderPayload {
  customerName: string;
  customerPhone: string;
  orderType: 'delivery' | 'pickup';
  deliveryAddress?: string;
  deliveryAreaId?: string;
  discountCode?: string;
  notes?: string;
  paymentMethod: 'bank_transfer' | 'whatsapp';
  channel: 'website' | 'whatsapp' | 'admin';
  items: OrderItemPayload[];
}

export interface OrderResponseLine {
  name: string;
  unitPrice: number;
  quantity: number;
  addOns: { name: string; price: number }[];
  lineTotal: number;
}

export interface OrderResponse {
  _id: string;
  customerName: string;
  customerPhone: string;
  orderType: 'delivery' | 'pickup';
  deliveryAddress?: string;
  deliveryAreaName?: string;
  deliveryFee: number;
  items: OrderResponseLine[];
  subtotal: number;
  discountCode?: string;
  discountAmount: number;
  total: number;
  notes?: string;
  paymentMethod: 'bank_transfer' | 'whatsapp';
  paymentStatus: 'unpaid' | 'receipt_submitted' | 'paid' | 'rejected' | 'refunded';
  paymentInstructions?: { bankName: string; accountName: string; accountNumber: string };
  receiptUrl?: string;
  paymentRejectionReason?: string;
  status: string;
  createdAt: string;
}

export interface PreparedOrderResponse {
  order: OrderResponse;
  checkoutToken?: string;
}

export interface CustomerHistoryOrder extends Pick<OrderResponse, '_id' | 'customerName' | 'customerPhone' | 'orderType' | 'deliveryAreaName' | 'deliveryAddress' | 'items' | 'subtotal' | 'deliveryFee' | 'discountCode' | 'discountAmount' | 'total' | 'notes' | 'paymentMethod' | 'paymentStatus' | 'paymentRejectionReason' | 'status' | 'createdAt'> {
  updatedAt?: string;
}

export interface PaymentSettings {
  bankTransferEnabled: boolean;
  whatsappEnabled: boolean;
  bankName: string;
  accountName: string;
  accountNumber: string;
}

export interface DeliveryArea { _id: string; name: string; fee: number; active?: boolean; }

export async function getPaymentSettings(): Promise<PaymentSettings> {
  const payload = await publicApiRequest<{ settings: PaymentSettings }>('/payment-settings/public');
  return payload.settings;
}

export async function getDeliveryAreas(): Promise<DeliveryArea[]> {
  const payload = await publicApiRequest<{ items: DeliveryArea[] }>('/checkout-config/delivery-areas');
  return payload.items || [];
}

export async function submitOrder(data: OrderPayload, idempotencyKey?: string): Promise<PreparedOrderResponse> {
  return publicApiRequest<PreparedOrderResponse>('/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}) },
    body: JSON.stringify(data),
  });
}

export async function placePreparedOrder(orderId: string, checkoutToken: string): Promise<OrderResponse> {
  const payload = await publicApiRequest<{ order: OrderResponse }>(`/orders/${encodeURIComponent(orderId)}/place`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ checkoutToken }),
  });
  return payload.order;
}

export async function uploadPaymentReceipt(orderId: string, checkoutToken: string, file: File): Promise<OrderResponse> {
  const body = new FormData();
  body.append('checkoutToken', checkoutToken);
  body.append('receipt', file);
  const payload = await publicApiRequest<{ order: OrderResponse }>(`/orders/${encodeURIComponent(orderId)}/receipt`, { method: 'POST', body });
  return payload.order;
}

export async function accessOrder(orderId: string, checkoutToken: string): Promise<OrderResponse> {
  const payload = await publicApiRequest<{ order: OrderResponse }>(`/orders/${encodeURIComponent(orderId)}/access`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ checkoutToken }) });
  return payload.order;
}

export async function requestCustomerOtp(phone: string): Promise<{ message: string; expiresInSeconds: number; devCode?: string }> {
  return publicApiRequest('/customer-orders/request-otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone }) });
}

export async function verifyCustomerOtp(phone: string, code: string): Promise<{ token: string; expiresInSeconds: number }> {
  return publicApiRequest('/customer-orders/verify-otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone, code }) });
}

export async function getCustomerOrders(token: string): Promise<CustomerHistoryOrder[]> {
  const payload = await publicApiRequest<{ orders: CustomerHistoryOrder[] }>('/customer-orders', { headers: { Authorization: `Bearer ${token}` } });
  return payload.orders || [];
}
