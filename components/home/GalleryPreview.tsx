import DishIllustration from '@/components/ui/DishIllustration';
import Reveal from '@/components/ui/Reveal';

export default function GalleryPreview() {
  return (
    <section id="gallery" className="bg-ivory px-6 py-24 md:px-16">
      <h2 className="mb-12 text-center font-display text-4xl font-medium text-ink">
        A quiet look at the table.
      </h2>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {['board', 'plate', 'bowl', 'plate'].map((variant, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <DishIllustration variant={variant as 'board' | 'plate' | 'bowl'} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
