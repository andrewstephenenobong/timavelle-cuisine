import DishIllustration from '@/components/ui/DishIllustration';

export default function GalleryPreview() {
  return (
    <section id="gallery" className="bg-ivory px-6 py-24 md:px-16">
      <h2 className="mb-12 text-center font-display text-4xl font-medium text-ink">
        A quiet look at the table.
      </h2>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        <DishIllustration variant="board" />
        <DishIllustration variant="plate" />
        <DishIllustration variant="bowl" />
        <DishIllustration variant="plate" />
      </div>
    </section>
  );
}
