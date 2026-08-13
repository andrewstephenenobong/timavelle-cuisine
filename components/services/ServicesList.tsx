/* Timavelle public services: published API content with a static editorial fallback. */
'use client';

import { useEffect, useState } from 'react';
import Reveal from '@/components/ui/Reveal';

const fallbackServices = [
  {
    name: 'Private Dining',
    desc: 'An intimate, multi-course experience in your own home — menu shaped around your table, not a set menu handed to you.',
  },
  {
    name: 'Corporate Events',
    desc: 'From working lunches to milestone celebrations, catering built around your schedule and the impression you want to leave.',
  },
  {
    name: 'Weddings & Celebrations',
    desc: 'Full-service catering for the moments that deserve more than a standard buffet — tastings, planning, and day-of service included.',
  },
  {
    name: 'Personal Chef Experience',
    desc: 'Recurring or one-off in-home cooking, tailored to your household\u2019s tastes, dietary needs, and schedule.',
  },
];

export default function ServicesList() {
  const [services, setServices] = useState(fallbackServices);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://timavelle-cuisine-backend.onrender.com';
    fetch(`${apiUrl}/api/services`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Services unavailable')))
      .then((payload: { items?: Array<{ title: string; description: string }> }) => {
        if (payload.items?.length) setServices(payload.items.map((item) => ({ name: item.title, desc: item.description })));
      })
      .catch(() => undefined);
  }, []);

  return (
    <section className="bg-ivory px-6 py-24 md:px-16">
      <div className="grid gap-8 md:grid-cols-2">
        {services.map((service, i) => (
          <Reveal key={service.name} delay={i * 0.1}>
            <div className="rounded-3xl bg-white p-8 shadow-lg">
              <h3 className="font-display text-2xl font-semibold text-ink">{service.name}</h3>
              <p className="mt-3 font-body text-stone">{service.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
