import type { Metadata } from 'next';
import GalleryPreview from '@/components/home/GalleryPreview';

export const metadata: Metadata = {
  title: 'Gallery — Timavelle Cuisine',
  description: 'A look at events, plated courses, and kitchen service at Timavelle Cuisine.',
};

export default function GalleryPage() {
  return (
    <>
      <section className="bg-emerald-deep px-6 py-32 text-center text-ivory">
        <span className="font-utility text-xs uppercase tracking-[0.3em] text-gold">Gallery</span>
        <h1 className="mt-4 font-display text-5xl font-medium">A Quiet Look at the Table</h1>
      </section>
      <GalleryPreview />
    </>
  );
}
