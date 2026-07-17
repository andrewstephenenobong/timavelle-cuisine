import type { Metadata } from 'next';
import MenuPreview from '@/components/home/MenuPreview';

export const metadata: Metadata = {
  title: 'Menu — Timavelle Cuisine',
  description: 'A short, seasonal menu from Timavelle Cuisine, held to a high standard.',
};

export default function MenuPage() {
  return (
    <>
      <section className="bg-emerald-deep px-6 py-32 text-center text-ivory">
        <span className="font-utility text-xs uppercase tracking-[0.3em] text-gold">The Menu</span>
        <h1 className="mt-4 font-display text-5xl font-medium">A Short List, Held to a High Standard</h1>
      </section>
      <MenuPreview />
    </>
  );
}
