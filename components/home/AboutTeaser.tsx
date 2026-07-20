import Image from 'next/image';
import Reveal from '@/components/ui/Reveal';

export default function AboutTeaser() {
  return (
    <section id="about" className="grid gap-12 bg-ivory px-6 py-24 md:grid-cols-2 md:px-16">
      <Reveal>
        <div className="flex flex-col justify-center gap-6">
          <span className="font-utility text-xs uppercase tracking-[0.3em] text-gold">The House</span>
          <h2 className="font-display text-4xl font-medium text-ink">
            CRAFTED WITH PASSION, SERVED WITH EXCELLENCE.
          </h2>
          <p className="font-body text-stone">
            Timavelle Cuisine is where exceptional food meets unforgettable experiences.
             We specialize in beautifully crafted African and international cuisine for private dining, 
             celebrations, corporate events, and bespoke catering. Every dish is thoughtfully prepared with
              premium ingredients, elegant presentation, and genuine hospitality because every occasion deserves
               something extraordinary.
          </p>
        </div>
      </Reveal>
      <Reveal delay={0.15}>
        <div className="mx-auto max-w-sm overflow-hidden rounded-3xl">
         <Image
          src="/images/About/image.png"
          alt="Timavelle Cuisine — plated dish"
          width={720}
          height={1080}
          className="h-auto w-full object-cover"
        />
        </div>
      </Reveal>
    </section>
  );
}
