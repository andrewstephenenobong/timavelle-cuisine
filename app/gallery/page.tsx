import type { Metadata } from 'next';
import Image from 'next/image';
import { getGalleryImages } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Gallery — Timavelle Cuisine',
  description: 'A look at Timavelle Cuisine events, plated courses, and kitchen service.',
};

export default async function GalleryPage() {
  const images = await getGalleryImages();

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
          <div className="tv-gallery-page-grid">
            {images.map((img) => (
              <article key={img._id} className="tv-gallery-page-card">
                <div className="tv-gallery-page-card__media">
                  <Image src={img.imageUrl} alt={img.caption || img.category || 'Timavelle Cuisine gallery image'} width={720} height={720} className="tv-gallery-page-card__image" />
                </div>
                <div className="tv-gallery-page-card__content">
                  <span>{img.category || 'From the table'}</span>
                  <h2>{img.caption || 'A considered moment from the Timavelle table.'}</h2>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
