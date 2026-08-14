const DEFAULT_API_URL = 'https://timavelle-cuisine-backend.onrender.com';

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  category: string;
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
