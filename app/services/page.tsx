import type { Metadata } from 'next';
import ServicesList from '@/components/services/ServicesList';

export const metadata: Metadata = {
  title: 'Services — Timavelle Cuisine',
  description: 'Private dining, corporate events, weddings, and personal chef services from Timavelle Cuisine.',
};

export default function ServicesPage() {
  return (
    <>
      <section className="bg-emerald-deep px-6 py-32 text-center text-ivory">
        <span className="font-utility text-xs uppercase tracking-[0.3em] text-gold">What We Offer</span>
        <h1 className="mt-4 font-display text-5xl font-medium">Services</h1>
      </section>
      <ServicesList />
    </>
  );
}
