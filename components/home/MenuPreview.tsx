'use client';

import { useState } from 'react';
import Image from 'next/image';
import Reveal from '@/components/ui/Reveal';
import ImageLightbox from '@/components/ui/ImageLightbox';

const dishes = [
  {
    name: 'Creamy Chicken Alfredo',
    desc: 'Juicy grilled chicken served over fettuccine, coated in a rich Parmesan Alfredo.',
    image: '/images/menu/Creamy_Chicken_Alfredo.png',
  },
  {
    name: 'Creamy Seafood Spaghetti',
    desc: 'Creamy spaghetti tossed in a rich Parmesan cream sauce with succulent shrimp, finished with fresh herbs.',
    image: '/images/menu/Creamy_Seafood_spag.jpeg',
  },
  {
    name: 'Smoky Jollof & Grilled Chicken Skewers',
    desc: 'Smoky Nigerian Jollof rice served with flame-grilled chicken skewers, grilled onions, sweet carrots and a juicy grilled chicken drumstick.',
    image: '/images/menu/jollof.jpeg',
  },
];

export default function MenuPreview() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="menu" className="bg-emerald/5 px-6 py-24 md:px-16">
      <h2 className="mb-12 text-center font-display text-4xl font-medium text-ink">
        A short list, held to a high standard.
      </h2>

      <div className="grid gap-8 md:grid-cols-3">
        {dishes.map((d, i) => (
          <Reveal key={d.name} delay={i * 0.1}>
            <div className="overflow-hidden rounded-3xl bg-white shadow-lg transition hover:shadow-xl">
              <button
                type="button"
                onClick={() => setOpenIndex(i)}
                aria-label={`View larger image of ${d.name}`}
                className="block w-full cursor-zoom-in"
              >
                <Image
                  src={d.image}
                  alt={d.name}
                  width={600}
                  height={400}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </button>

              <div className="p-6">
                <h3 className="font-display text-xl font-semibold text-ink">{d.name}</h3>
                <p className="mt-2 font-body text-sm text-stone">{d.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {openIndex !== null && (
        <ImageLightbox
          src={dishes[openIndex].image}
          alt={dishes[openIndex].name}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </section>
  );
}
