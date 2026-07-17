'use client';

import { motion } from 'framer-motion';

export default function SpillingGlassIllustration() {
  return (
    <svg viewBox="0 0 300 200" className="h-40 w-full max-w-xs sm:h-48">
      <line x1="20" y1="170" x2="280" y2="170" stroke="currentColor" strokeWidth="1.5" className="text-stone" opacity={0.25} />

      {/* pour + stain — appear as the glass finishes tipping */}
      <motion.path
        d="M212,166 C 222,169 232,171 240,173"
        fill="none" strokeWidth="6" strokeLinecap="round" className="stroke-gold" opacity={0.55}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.55 }}
        transition={{ delay: 1.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.ellipse
        cx="248" cy="174" rx="42" ry="7" className="fill-gold" opacity={0.5}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 0.5 }}
        transition={{ delay: 1.3, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: '248px 174px' }}
      />

      {/* the glass — tips slowly and deliberately, no bounce */}
      <motion.g
        className="stroke-emerald-deep"
        style={{ transformOrigin: '120px 166px' }}
        initial={{ rotate: 0 }}
        animate={{ rotate: 90 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <g transform="translate(120,166)">
          <ellipse cx="0" cy="0" rx="15" ry="4" fill="none" strokeWidth="2.5" />
          <line x1="0" y1="-4" x2="0" y2="-52" strokeWidth="2.5" />
          <path
            d="M 0,-52 C 0,-70 -20,-72 -20,-90 M 0,-52 C 0,-70 20,-72 20,-90"
            fill="none" strokeWidth="2.5" strokeLinecap="round"
          />
          <line x1="-20" y1="-90" x2="20" y2="-90" strokeWidth="2.5" strokeLinecap="round" />
          <motion.path
            d="M -14,-64 C -14,-72 14,-72 14,-64 L 12,-58 C 6,-55 -6,-55 -12,-58 Z"
            className="fill-gold" opacity={0.5}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          />
        </g>
      </motion.g>
    </svg>
  );
}
