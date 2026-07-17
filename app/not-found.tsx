'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import SpillingGlassIllustration from '@/components/ui/SpillingGlassIllustration';

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center gap-6 bg-ivory px-6 text-center">
      <SpillingGlassIllustration />

      <motion.span
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="font-utility text-xs uppercase tracking-[0.3em] text-gold"
      >
        404
      </motion.span>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, duration: 0.5 }}
        className="font-display text-4xl font-medium text-ink sm:text-5xl"
      >
        This table hasn&rsquo;t been set yet.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="max-w-md font-body text-stone"
      >
        The page you&rsquo;re looking for doesn&rsquo;t exist, or may have moved.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.15, duration: 0.5 }}
      >
        <Link
          href="/"
          className="rounded-full bg-gold px-6 py-3 font-utility text-sm font-medium text-emerald-deep transition-colors hover:bg-emerald hover:text-ivory"
        >
          Back to Home
        </Link>
      </motion.div>
    </section>
  );
}
