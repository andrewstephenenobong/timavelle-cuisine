import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';

export default function AboutTeaser() {
  return (
    <section id="about" className="tv-section tv-about">
      <div className="tv-section__rail"><strong>02</strong><span>The house</span></div>
      <Reveal>
        <div className="tv-about__copy">
          <div className="tv-eyebrow">The house</div>
          <h2>Beautiful food.<br /><em>Room to remember it.</em></h2>
          <p className="tv-lead">
            Timavelle Cuisine is where exceptional food meets unforgettable experiences.
          </p>
          <p>
            We specialize in beautifully crafted African and international cuisine for private dining,
             celebrations, corporate events, and bespoke catering. Every dish is thoughtfully prepared with
              premium ingredients, elegant presentation, and genuine hospitality because every occasion deserves
               something extraordinary.
          </p>
          <Link href="/#reserve" className="tv-hero__link !text-emerald">Tell us about your occasion <ArrowUpRight size={15} /></Link>
        </div>
      </Reveal>
      <Reveal delay={0.15}>
        <div>
        <div className="tv-about__image">
         <Image
          src="/images/About/image.png"
          alt="Timavelle Cuisine — plated dish"
          width={720}
          height={1080}
          className="h-auto w-full object-cover"
          />
        </div>
        <div className="tv-about__caption"><strong>Field note 02</strong><span>Warm rooms, generous tables.</span></div>
        </div>
      </Reveal>
    </section>
  );
}
