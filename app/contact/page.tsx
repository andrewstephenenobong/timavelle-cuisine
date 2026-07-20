import type { Metadata } from 'next';
import ContactForm from '@/components/contact/ContactForm';

export const metadata: Metadata = {
  title: 'Contact — Timavelle Cuisine',
  description: 'Get in touch with Timavelle Cuisine for bookings, questions, or event enquiries.',
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-emerald-deep px-6 py-32 text-center text-ivory">
        <span className="font-utility text-xs uppercase tracking-[0.3em] text-gold">Get in Touch</span>
        <h1 className="mt-4 font-display text-5xl font-medium">Contact</h1>
      </section>

      <section className="grid gap-12 bg-ivory px-6 py-24 md:grid-cols-2 md:px-16">
        <div className="flex flex-col gap-6">
          <h2 className="font-display text-2xl font-semibold text-ink">Visit or Reach Us</h2>
          <ul className="flex flex-col gap-3 font-body text-stone">
            <li>14 Ilaro Crescent, Lagos</li>
            <li>Tue &ndash; Sun, 7am &ndash; 10pm</li>
            <li>+234 800 000 0000</li>
            <li>hello@timavellecuisine.com</li>
          </ul>
        </div>

        <ContactForm />
      </section>
    </>
  );
}
