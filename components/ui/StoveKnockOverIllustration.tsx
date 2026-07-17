'use client';

import { motion } from 'framer-motion';

export default function StoveKnockOverIllustration() {
  return (
    <svg viewBox="0 0 340 240" className="h-48 w-full max-w-sm sm:h-56">
      <line x1="15" y1="200" x2="325" y2="200" stroke="currentColor" strokeWidth="2" className="text-stone" opacity={0.25} />

      {/* stove — static, never moves */}
      <rect x="80" y="115" width="90" height="85" rx="6" className="fill-ivory stroke-emerald-deep" strokeWidth="4.5" />
      <rect x="90" y="150" width="30" height="18" rx="3" fill="none" className="stroke-emerald-deep" strokeWidth="3" opacity={0.6} />
      <rect x="130" y="150" width="30" height="18" rx="3" fill="none" className="stroke-emerald-deep" strokeWidth="3" opacity={0.6} />
      <ellipse cx="125" cy="115" rx="32" ry="7" fill="none" className="stroke-emerald-deep" strokeWidth="3" />
      <line x1="98" y1="115" x2="152" y2="115" className="stroke-emerald-deep" strokeWidth="2" opacity={0.5} />

      {/* spill — appears only after the pot lands */}
      <motion.path
        d="M232,178 C 248,185 258,190 268,193"
        fill="none" strokeWidth="9" strokeLinecap="round" className="stroke-gold" opacity={0.55}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.55 }}
        transition={{ delay: 1.5, duration: 0.35 }}
      />
      <motion.ellipse
        cx="275" cy="195" rx="45" ry="9" className="fill-gold" opacity={0.55}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 0.55 }}
        transition={{ delay: 1.65, duration: 0.3 }}
        style={{ transformOrigin: '275px 195px' }}
      />
      <motion.circle cx="245" cy="188" r="3.5" className="fill-gold" opacity={0.6}
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.8, type: 'spring', stiffness: 300 }} />
      <motion.circle cx="300" cy="191" r="3" className="fill-gold" opacity={0.55}
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.87, type: 'spring', stiffness: 300 }} />
      <motion.path
        d="M258,175 q4,-10 -3,-16 q-6,-6 0,-14"
        fill="none" strokeWidth="2" strokeLinecap="round" className="stroke-stone"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.35, 0] }}
        transition={{ delay: 2.05, duration: 2, repeat: Infinity, repeatDelay: 0.5 }}
      />

      {/* impact burst, right as the cat hits the pot */}
      <motion.g
        className="stroke-gold"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1.3, opacity: [0, 1, 0] }}
        transition={{ delay: 0.68, duration: 0.3 }}
        style={{ transformOrigin: '125px 95px' }}
      >
        <line x1="125" y1="70" x2="125" y2="82" strokeWidth="3" strokeLinecap="round" />
        <line x1="150" y1="95" x2="138" y2="95" strokeWidth="3" strokeLinecap="round" />
        <line x1="142" y1="78" x2="134" y2="86" strokeWidth="3" strokeLinecap="round" />
      </motion.g>

      {/* pot — starts on the stove, falls when the cat hits it */}
      <motion.g
        className="stroke-emerald-deep"
        style={{ transformOrigin: '0px 0px' }}
        initial={{ x: 125, y: 95, rotate: 0 }}
        animate={{ x: 215, y: 182, rotate: 75 }}
        transition={{ delay: 0.7, type: 'spring', stiffness: 140, damping: 13 }}
      >
        <rect x="-25" y="-20" width="50" height="40" rx="6" className="fill-ivory" strokeWidth="4.5" />
        <path d="M -25,-11 q -11,0 -11,-9" fill="none" strokeWidth="4" strokeLinecap="round" />
        <path d="M 25,-11 q 11,0 11,-9" fill="none" strokeWidth="4" strokeLinecap="round" />
      </motion.g>

      {/* lid — pops off independently */}
      <motion.g
        className="stroke-emerald-deep"
        style={{ transformOrigin: '0px 0px' }}
        initial={{ x: 125, y: 75, rotate: 0 }}
        animate={{ x: 178, y: 205, rotate: -15 }}
        transition={{ delay: 0.75, type: 'spring', stiffness: 180, damping: 11 }}
      >
        <ellipse cx="0" cy="0" rx="26" ry="7" className="fill-ivory" strokeWidth="3.5" />
        <circle cx="0" cy="-7" r="4" className="fill-ivory" strokeWidth="3" />
      </motion.g>

      {/* the cat — runs in, knocks the pot, keeps going */}
      <motion.g
        className="stroke-emerald-deep"
        initial={{ x: -40, y: 183 }}
        animate={{ x: [-40, 115, 380], y: [183, 178, 183, 178, 183, 178, 183] }}
        transition={{
          x: { duration: 2, times: [0, 0.35, 1], ease: 'easeInOut' },
          y: { duration: 0.9, repeat: 3, ease: 'easeInOut' },
        }}
      >
        <ellipse cx="0" cy="0" rx="22" ry="10" className="fill-ivory" strokeWidth="3.5" />
        <circle cx="26" cy="-8" r="9" className="fill-ivory" strokeWidth="3.5" />
        <path d="M20,-15 L15,-24 L24,-17 Z" className="fill-emerald-deep" />
        <path d="M30,-15 L34,-25 L37,-16 Z" className="fill-emerald-deep" />
        <path d="M-20,-2 Q-34,-6 -30,-18" fill="none" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="-10" y1="7" x2="-14" y2="17" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="10" y1="7" x2="14" y2="17" strokeWidth="3.5" strokeLinecap="round" />
      </motion.g>
    </svg>
  );
}
