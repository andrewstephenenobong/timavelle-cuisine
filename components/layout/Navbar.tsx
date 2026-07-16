'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-ivory/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-xl font-semibold text-emerald-deep">
          Timavelle <span className="text-gold">Cuisine</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link href="/" className="font-utility text-sm text-ink hover:text-gold">Home</Link>
          <Link href="/about" className="font-utility text-sm text-ink hover:text-gold">About</Link>
          <Link href="/menu" className="font-utility text-sm text-ink hover:text-gold">Menu</Link>
          <Link href="/gallery" className="font-utility text-sm text-ink hover:text-gold">Gallery</Link>
          <Button className="!px-5 !py-2 text-xs">Reserve a Table</Button>
        </div>

        <button aria-label="Toggle menu" onClick={() => setOpen(!open)} className="md:hidden">
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="flex flex-col gap-4 bg-ivory px-6 pb-6 md:hidden">
          <Link href="/" onClick={() => setOpen(false)} className="font-utility text-sm text-ink">Home</Link>
          <Link href="/about" onClick={() => setOpen(false)} className="font-utility text-sm text-ink">About</Link>
          <Link href="/menu" onClick={() => setOpen(false)} className="font-utility text-sm text-ink">Menu</Link>
          <Link href="/gallery" onClick={() => setOpen(false)} className="font-utility text-sm text-ink">Gallery</Link>
          <Button>Reserve a Table</Button>
        </div>
      )}
    </header>
  );
}
