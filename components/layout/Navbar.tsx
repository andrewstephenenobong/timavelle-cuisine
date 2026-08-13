'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import LinkButton from '@/components/ui/LinkButton';

const navLinks = [
  { label: 'The house', href: '/about' },
  { label: 'The menu', href: '/menu' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Services', href: '/services' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="tv-nav-shell">
      <nav className="tv-nav-inner" aria-label="Primary navigation">
        <Link href="/" className="tv-wordmark">
          <span className="tv-mark" aria-hidden="true"><span className="tv-mark__bar" /><span className="tv-mark__bar" /><span className="tv-mark__bar" /></span>
          <span className="tv-wordmark__name"><span>Timavelle</span><span className="tv-wordmark__suffix">Cuisine</span></span>
        </Link>
        <div id="primary-navigation" className="tv-nav-links" data-open={open}>
          {navLinks.map((link, index) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="tv-nav-link">
              <span>0{index + 1}</span>{link.label}
            </Link>
          ))}
          <LinkButton href="/#reserve" className="tv-nav-button">Plan an event <ArrowUpRight size={14} /></LinkButton>
        </div>
        <button aria-controls="primary-navigation" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} onClick={() => setOpen(!open)} className="tv-mobile-toggle">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>
    </header>
  );
}
