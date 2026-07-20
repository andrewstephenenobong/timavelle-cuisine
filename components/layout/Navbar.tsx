'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import LinkButton from '@/components/ui/LinkButton';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Menu', href: '/menu' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Services', href: '/services' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-ivory/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-xl font-semibold text-emerald-deep">
          Timavelle <span className="text-gold">Cuisine</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="font-utility text-sm text-ink hover:text-gold">
              {link.label}
            </Link>
          ))}
          <LinkButton href="/#reserve" className="px-5! py-2! text-xs">Reserve a Table</LinkButton>
        </div>

        <button aria-label="Toggle menu" onClick={() => setOpen(!open)} className="md:hidden">
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="flex flex-col gap-4 bg-ivory px-6 pb-6 md:hidden">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="font-utility text-sm text-ink">
              {link.label}
            </Link>
          ))}
          <LinkButton href="/#reserve" className="w-full text-center">Reserve a Table</LinkButton>
        </div>
      )}
    </header>
  );
}
