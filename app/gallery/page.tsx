import type { Metadata } from 'next';
import { getGalleryImages } from '@/lib/api';
import GalleryViewer from '@/components/gallery/GalleryViewer';

export const metadata: Metadata = {
  title: 'Gallery — Timavelle Cuisine',
  description: 'A look at Timavelle Cuisine events, plated courses, and kitchen service.',
};

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return <>
    <section className="bg-emerald-deep px-6 py-32 text-center text-ivory">
      <span className="font-utility text-xs uppercase tracking-[0.3em] text-gold">Gallery</span>
      <h1 className="mt-4 font-display text-5xl font-medium">A Quiet Look at the Table</h1>
      <p className="mx-auto mt-5 max-w-xl font-body text-base leading-7 text-ivory/75">Browse the table at your own pace. Select any image to open it, move between moments, or zoom in for a closer look.</p>
    </section>
    <section className="bg-ivory px-4 py-16 md:px-10 md:py-24">
      {images.length === 0 ? <p className="text-center font-body text-stone">Our gallery is being updated — check back soon.</p> : <GalleryViewer images={images} />}
    </section>
  </>;
}
