import LinkButton from '@/components/ui/LinkButton';
import Image from 'next/image';
import { getGalleryImages } from '@/lib/api';

export default async function GalleryPreview() {
  const images = (await getGalleryImages()).slice(0, 6);

  return (
    <section id="gallery" className="tv-section">
      <div className="tv-section__rail"><strong>04</strong><span>Gallery</span></div>
      <div className="tv-section__head"><div><div className="tv-eyebrow">From the table</div><h2>A little<br /><em>visual appetite.</em></h2></div><p>A glimpse into the palette, texture, and generous spirit behind every Timavelle table.</p></div>

      {images.length === 0 ? (
        <p className="text-center font-body text-stone">Our gallery is being updated — check back soon.</p>
      ) : (
        <div className="tv-gallery-grid">
          {images.map((img) => (
            <div key={img._id} className="tv-gallery-item"><Image src={img.imageUrl} alt={img.caption || img.category} width={720} height={720} /><div className="tv-gallery-item__label"><strong>{img.category}</strong><span>{img.caption || 'From the table'}</span></div></div>
          ))}
        </div>
      )}

      <div className="mt-10 text-center">
        <LinkButton href="/gallery">View Full Gallery</LinkButton>
      </div>
    </section>
  );
}
