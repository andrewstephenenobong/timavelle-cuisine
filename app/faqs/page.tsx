import type { Metadata } from 'next';
import FaqAccordion from '@/components/faqs/FaqAccordion';

export const metadata: Metadata = {
  title: 'FAQs — Timavelle Cuisine',
  description: 'Answers to common questions about booking, dietary needs, and travel for Timavelle Cuisine.',
};

export default function FaqsPage() {
  return (
    <>
      <section className="bg-emerald-deep px-6 py-32 text-center text-ivory">
        <span className="font-utility text-xs uppercase tracking-[0.3em] text-gold">Good to Know</span>
        <h1 className="mt-4 font-display text-5xl font-medium">Frequently Asked Questions</h1>
      </section>
      <FaqAccordion />
    </>
  );
}
