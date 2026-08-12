import LinkButton from '@/components/ui/LinkButton';

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

export default async function MenuPreview() {
  const items = await getMenuItems();
  const featured = items.filter((i) => i.image).slice(0, 3);

  return (
    <section id="menu" className="bg-emerald/5 px-6 py-24 md:px-16">
      <h2 className="mb-12 text-center font-display text-4xl font-medium text-ink">
        A short list, held to a high standard.
      </h2>

      {featured.length === 0 ? (
        <p className="text-center font-body text-stone">Our menu is being finalized — check back soon.</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-3">
          {featured.map((item) => (
            <div key={item._id} className="overflow-hidden rounded-3xl bg-white shadow-lg">
              <img src={item.image} alt={item.name} className="h-56 w-full object-cover" />
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold text-ink">{item.name}</h3>
                <p className="mt-2 font-body text-sm text-stone">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 text-center">
        <LinkButton href="/menu">View Full Menu</LinkButton>
      </div>
    </section>
  );
}