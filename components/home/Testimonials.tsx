import Reveal from '@/components/ui/Reveal';

export default function Testimonials() {
  return (
    <section className="bg-emerald-deep px-6 py-24 text-center text-ivory md:px-16">
      <Reveal>
        <span className="font-utility text-xs uppercase tracking-[0.3em] text-gold">From the Table</span>
        <p className="mx-auto mt-8 max-w-2xl font-display text-2xl italic leading-snug sm:text-3xl">
          &ldquo;Every course arrived like it had been considered for weeks. Our guests kept asking who catered it.&rdquo;
        </p>
        <p className="mt-5 font-utility text-sm text-ivory/60">Folake A. — Private dinner, 40 guests</p>
      </Reveal>
    </section>
  );
}
