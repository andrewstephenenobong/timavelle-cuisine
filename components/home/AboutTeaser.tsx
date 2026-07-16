import DishIllustration from '@/components/ui/DishIllustration';

export default function AboutTeaser() {
  return (
    <section id="about" className="grid gap-12 bg-ivory px-6 py-24 md:grid-cols-2 md:px-16">
      <div className="flex flex-col justify-center gap-6">
        <span className="font-utility text-xs uppercase tracking-[0.3em] text-gold">The House</span>
        <h2 className="font-display text-4xl font-medium text-ink">
          Food that behaves like it was made for you, specifically.
        </h2>
        <p className="font-body text-stone">
          Timavelle Cuisine began as a single private chef&rsquo;s table and grew, deliberately slowly,
          into a culinary house. One menu at a time, shaped around the people eating it.
        </p>
      </div>
      <DishIllustration variant="bowl" />
    </section>
  );
}
