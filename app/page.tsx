import Hero from '@/components/home/Hero';
import AboutTeaser from '@/components/home/AboutTeaser';
import MenuPreview from '@/components/home/MenuPreview';
import GalleryPreview from '@/components/home/GalleryPreview';
import Testimonials from '@/components/home/Testimonials';
import ReserveCTA from '@/components/home/ReserveCTA';

interface Testimonial {
  _id: string;
  clientName: string;
  quote: string;
  eventType?: string;
}

async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/testimonials`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.testimonials || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const testimonials = await getTestimonials();

  return (
    <>
      <Hero />
      <AboutTeaser />
      <MenuPreview />
      <GalleryPreview />
      <Testimonials testimonials={testimonials} />
      <ReserveCTA />
    </>
  );
}