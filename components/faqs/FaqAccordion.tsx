'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'How far in advance should I book?',
    a: 'For private dinners, two to three weeks is comfortable. For weddings or large events, six to eight weeks lets us plan properly, including a tasting.',
  },
  {
    q: 'Can you accommodate dietary restrictions?',
    a: 'Yes — vegetarian, vegan, gluten-free, and allergy-specific menus are all things we plan for from the start, not substitute in at the last minute.',
  },
  {
    q: 'Do you travel outside Lagos?',
    a: 'For larger events, yes. Travel and logistics are quoted separately based on distance and event size.',
  },
  {
    q: 'What\u2019s included in a private dining booking?',
    a: 'The chef, the full menu (tasted and agreed beforehand), service staff for the evening, and cleanup. Tableware and venue are discussed case by case.',
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-ivory px-6 py-24 md:px-16">
      <div className="mx-auto max-w-2xl divide-y divide-stone/15">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={faq.q} className="py-5">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 text-left"
              >
                <span className="font-display text-lg font-medium text-ink">{faq.q}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="shrink-0 text-emerald-deep"
                >
                  <ChevronDown size={20} />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pt-3 font-body text-stone">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
