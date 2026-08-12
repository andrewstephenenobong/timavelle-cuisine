import LinkButton from '@/components/ui/LinkButton';
import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="tv-hero">
      <div className="tv-hero__copy">
        <div className="tv-hero__eyebrow">Private culinary house <span className="ml-6 opacity-50">Est. 2021</span></div>
        <h1>Crafting flavors.<br /><em>Creating memories.</em></h1>
        <p>Authentic African delicacies and refined international cuisine, prepared for the rooms and occasions that matter.</p>
        <div className="tv-hero__actions">
          <LinkButton href="/#reserve" className="tv-hero__button">Book catering <ArrowUpRight size={15} /></LinkButton>
          <Link href="/#menu" className="tv-hero__link">Explore the menu <ArrowDownRight size={15} /></Link>
        </div>
      </div>
      <div className="tv-hero__visual"><div className="tv-hero__image"><img src="/images/About/image.png" alt="A plated Timavelle Cuisine dish" /></div><div className="tv-hero__note">A considered table<br />01 / 04</div></div>
    </section>
  );
}
