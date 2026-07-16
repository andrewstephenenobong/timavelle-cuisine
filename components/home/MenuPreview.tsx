import DishIllustration from '@/components/ui/DishIllustration';

const dishes = [
  { name: 'Smoked Jollof Risotto', desc: 'Slow-built smoked tomato stock, aged parmesan.', variant: 'bowl' as const },
  { name: 'Suya-Crusted Lamb Loin', desc: 'Peanut-spice crust, charred plantain purée.', variant: 'board' as const },
  { name: 'Zobo-Poached Pear', desc: 'Hibiscus and clove, whipped chevre.', variant: 'plate' as const },
];

export default function MenuPreview() {
  return (
    <section id="menu" className="bg-emerald/5 px-6 py-24 md:px-16">
      <h2 className="mb-12 text-center font-display text-4xl font-medium text-ink">
        A short list, held to a high standard.
      </h2>
      <div className="grid gap-8 md:grid-cols-3">
        {dishes.map((d) => (
          <div key={d.name} className="rounded-3xl bg-white p-6 shadow-lg">
            <DishIllustration variant={d.variant} />
            <h3 className="mt-4 font-display text-xl font-semibold text-ink">{d.name}</h3>
            <p className="mt-2 font-body text-sm text-stone">{d.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
