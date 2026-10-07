import type { Metadata } from 'next';
import { getMenuItems } from '@/lib/api';
import MenuBrowser from '@/components/menu/MenuBrowser';

export const metadata: Metadata = {
  title: 'Menu — Timavelle Cuisine',
  description: 'The Timavelle Cuisine signature menu — browse, customize, and order.',
};

export default async function MenuPage() {
  const items = await getMenuItems();

  return (
    <>
      <section className="bg-emerald-deep px-6 py-32 text-center text-ivory">
        <span className="font-utility text-xs uppercase tracking-[0.3em] text-gold">The Menu</span>
        <h1 className="mt-4 font-display text-5xl font-medium">A Short List, Held to a High Standard</h1>
      </section>

      <section className="bg-ivory px-6 py-16 md:px-16">
        <MenuBrowser items={items} />
      </section>
    </>
  );
}