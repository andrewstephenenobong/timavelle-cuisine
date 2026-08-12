import LinkButton from '@/components/ui/LinkButton';

interface GalleryImage {
  _id: string;
  imageUrl: string;
  caption?: string;
  category: string;
}

async function getImages(): Promise<GalleryImage[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gallery`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.images || [];
  } catch {
    return [];
  }
}

export default async function GalleryPreview() {
  const images = (await getImages()).slice(0, 6);

  return (
    <section id="gallery" className="bg-ivory px-6 py-24 md:px-16">
      <h2 className="mb-12 text-center font-display text-4xl font-medium text-ink">
        A quiet look at the table.
      </h2>

      {images.length === 0 ? (
        <p className="text-center font-body text-stone">Our gallery is being updated — check back soon.</p>
      ) : (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {images.map((img) => (
            <img key={img._id} src={img.imageUrl} alt={img.caption || img.category} className="aspect-square w-full rounded-2xl object-cover" />
          ))}
        </div>
      )}

      <div className="mt-10 text-center">
        <LinkButton href="/gallery">View Full Gallery</LinkButton>
      </div>
    </section>
  );
}