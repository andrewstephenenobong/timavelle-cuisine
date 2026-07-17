'use client';

import { motion } from 'framer-motion';

export default function SpilledPotIllustration() {
  return (
    <svg viewBox="0 0 300 220" className="h-40 w-full max-w-xs sm:h-48">
      <line x1="15" y1="188" x2="285" y2="188" stroke="currentColor" strokeWidth="2" className="text-stone" opacity={0.25} />

      {/* pour stream + puddle + droplets — appear after the pot lands */}
      <motion.path
        d="M148,158 C 168,168 182,172 195,178"
        fill="none"
        strokeWidth="10"
        strokeLinecap="round"
        className="stroke-gold"
        opacity={0.55}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.55 }}
        transition={{ delay: 0.55, duration: 0.35 }}
      />
      <motion.ellipse
        cx="225" cy="182" rx="62" ry="11"
        className="fill-gold"
        opacity={0.55}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 0.55 }}
        transition={{ delay: 0.7, duration: 0.3 }}
        style={{ transformOrigin: '225px 182px' }}
      />
      <motion.circle cx="185" cy="178" r="4" className="fill-gold" opacity={0.6}
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.85, type: 'spring', stiffness: 300 }} />
      <motion.circle cx="255" cy="177" r="3.5" className="fill-gold" opacity={0.55}
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.92, type: 'spring', stiffness: 300 }} />

      {/* fading steam — it was hot, now it's not */}
      <motion.path
        d="M220,168 q4,-10 -3,-16 q-6,-6 0,-14"
        fill="none" strokeWidth="2" strokeLinecap="round" className="stroke-stone"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.35, 0] }}
        transition={{ delay: 1.1, duration: 2, repeat: Infinity, repeatDelay: 0.5 }}
      />

      {/* the pot itself — falls from above, settles on its side */}
      <motion.g
        className="stroke-emerald-deep"
        style={{ transformOrigin: '90px 160px' }}
        initial={{ y: -200, rotate: -90, opacity: 0 }}
        animate={{ y: 0, rotate: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 12 }}
      >
        <path
          d="M40,145 L140,145 L140,175 L40,175 C 25,175 25,145 40,145 Z"
          className="fill-ivory"
          strokeWidth="4.5"
          strokeLinejoin="round"
        />
        <ellipse cx="140" cy="160" rx="7" ry="15" className="fill-emerald-soft" strokeWidth="4.5" />
        <path d="M62,145 q0,-14 14,-14" fill="none" strokeWidth="4" strokeLinecap="round" />
        <path d="M100,145 q0,-14 14,-14" fill="none" strokeWidth="4" strokeLinecap="round" />
      </motion.g>

      {/* lid — flew off on impact */}
      <motion.g
        className="stroke-emerald-deep"
        transform="translate(75,55) rotate(-20)"
        initial={{ y: -180, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 11, delay: 0.05 }}
      >
        <ellipse cx="0" cy="0" rx="28" ry="9" className="fill-ivory" strokeWidth="3.5" />
        <circle cx="0" cy="-9" r="4.5" fill="none" strokeWidth="3.5" />
      </motion.g>
    </svg>
  );
}
