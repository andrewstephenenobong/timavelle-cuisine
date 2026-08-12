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
    <section id="menu" className="tv-section tv-section--dark">
      <div className="tv-section__rail"><strong>03</strong><span>The menu</span></div>
      <div className="tv-section__head"><div><div className="tv-eyebrow">A short list</div><h2>Held to a<br /><em>high standard.</em></h2></div><p>Menus are shaped around the mood of your event, with familiar flavours given a more considered finish.</p></div>

      {featured.length === 0 ? (
        <p className="text-center font-body text-ivory/60">Our menu is being finalized — check back soon.</p>
      ) : (
        <div className="tv-menu-grid">
          {featured.map((item, index) => (
            <div key={item._id} className="tv-menu-card">
              <div className="tv-menu-card__image"><img src={item.image} alt={item.name} /><span>0{index + 1}</span></div>
              <div className="tv-menu-card__body">
                <div className="tv-menu-card__category">{item.category}</div>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="tv-menu-footer">
        <span>Menus change with the room.</span>
        <LinkButton href="/menu">View Full Menu</LinkButton>
      </div>
    </section>
  );
}
