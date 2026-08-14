import LinkButton from '@/components/ui/LinkButton';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { getHeroImage } from '@/lib/api';

export default async function Hero() {
  const heroImage = await getHeroImage();
  return (
    <section className="tv-hero">
      <div className="tv-hero__copy">
        <div className="tv-hero__eyebrow">Private culinary house <span className="ml-6 opacity-50">Est. 2026</span></div>
        <h1>Crafting flavors.<br /><em>Creating memories.</em></h1>
        <p>Authentic African delicacies and refined international cuisine, prepared for the rooms and occasions that matter.</p>
        <div className="tv-hero__actions">
          <LinkButton href="/#reserve" className="tv-hero__button">Book catering <ArrowUpRight size={15} /></LinkButton>
          <Link href="/#menu" className="tv-hero__link">Explore the menu <ArrowDownRight size={15} /></Link>
        </div>
      </div>
      <div className="tv-hero__visual"><div className="tv-hero__image"><Image src={heroImage?.imageUrl || '/images/About/image.png'} alt={heroImage?.altText || 'A plated Timavelle Cuisine dish'} width={760} height={920} priority /></div></div>
    </section>
  );
}
