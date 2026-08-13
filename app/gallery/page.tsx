import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Gallery — Timavelle Cuisine',
  description: 'A look at Timavelle Cuisine events, plated courses, and kitchen service.',
};

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

export default async function GalleryPage() {
  const images = await getImages();

  return (
    <>
      <section className="bg-emerald-deep px-6 py-32 text-center text-ivory">
        <span className="font-utility text-xs uppercase tracking-[0.3em] text-gold">Gallery</span>
        <h1 className="mt-4 font-display text-5xl font-medium">A Quiet Look at the Table</h1>
      </section>

      <section className="bg-ivory px-6 py-24 md:px-16">
        {images.length === 0 ? (
          <p className="text-center font-body text-stone">Our gallery is being updated — check back soon.</p>
        ) : (
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 md:grid-cols-4">
            {images.map((img) => (
              <Image key={img._id} src={img.imageUrl} alt={img.caption || img.category} width={720} height={720} className="aspect-square w-full rounded-2xl object-cover" />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
