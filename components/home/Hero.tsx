import Button from '@/components/ui/Button';

export default function Hero() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-6 bg-emerald-deep px-6 text-center">
      <span className="font-utility text-xs uppercase tracking-[0.3em] text-gold">
        Timavelle Cuisine — Private Culinary House
      </span>
      <h1 className="max-w-3xl font-display text-5xl font-medium leading-tight text-ivory sm:text-6xl">
        Cooking is our language. <span className="italic text-gold">Every table, our conversation.</span>
      </h1>
      <p className="max-w-xl font-body text-lg text-ivory/75">
        A private culinary house crafting elevated menus and bespoke catering for dinners, celebrations, and quiet moments that deserve better food.
      </p>
      <Button className="mt-4">Reserve a Table</Button>
    </section>
  );
}
