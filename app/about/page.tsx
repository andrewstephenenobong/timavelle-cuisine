import AboutTeaser from '@/components/home/AboutTeaser';

export default function AboutPage() {
  return (
    <>
      <section className="bg-emerald-deep px-6 py-32 text-center text-ivory">
        <span className="font-utility text-xs uppercase tracking-[0.3em] text-gold">Our Story</span>
        <h1 className="mt-4 font-display text-5xl font-medium">The House</h1>
      </section>
      <AboutTeaser />
    </>
  );
}
