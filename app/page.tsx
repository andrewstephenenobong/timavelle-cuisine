import Hero from '@/components/home/Hero';
import AboutTeaser from '@/components/home/AboutTeaser';
import MenuPreview from '@/components/home/MenuPreview';
import GalleryPreview from '@/components/home/GalleryPreview';
import Testimonials from '@/components/home/Testimonials';
import ReserveCTA from '@/components/home/ReserveCTA';

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutTeaser />
      <MenuPreview />
      <GalleryPreview />
      <Testimonials />
      <ReserveCTA />
    </>
  );
}
