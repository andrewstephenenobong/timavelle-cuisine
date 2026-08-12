import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Menu — Timavelle Cuisine',
  description: 'The Timavelle Cuisine signature menu.',
};

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  category: string;
  image?: string;
}

async function getMenuItems(): Promise<MenuItem[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.items || [];
  } catch {
    return [];
  }
}

export default async function MenuPage() {
  const items = await getMenuItems();

  return (
    <>
      <section className="bg-emerald-deep px-6 py-32 text-center text-ivory">
        <span className="font-utility text-xs uppercase tracking-[0.3em] text-gold">The Menu</span>
        <h1 className="mt-4 font-display text-5xl font-medium">A Short List, Held to a High Standard</h1>
      </section>

      <section className="bg-ivory px-6 py-24 md:px-16">
        {items.length === 0 ? (
          <p className="text-center font-body text-stone">Our menu is being finalized — check back soon.</p>
        ) : (
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
            {items.map((item) => (
              <div key={item._id} className="overflow-hidden rounded-3xl bg-white shadow-lg">
                {item.image && <img src={item.image} alt={item.name} className="h-56 w-full object-cover" />}
                <div className="p-6">
                  <p className="font-utility text-xs uppercase tracking-wide text-stone/70">{item.category}</p>
                  <h3 className="mt-1 font-display text-xl font-semibold text-ink">{item.name}</h3>
                  <p className="mt-2 font-body text-sm text-stone">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}