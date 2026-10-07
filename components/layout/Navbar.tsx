'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import CartTrigger from '@/components/cart/CartTrigger';

const navLinks = [
  { label: 'The house', href: '/about' },
  { label: 'The menu', href: '/menu' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Services', href: '/services' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [open]);

  return <header className="tv-nav-shell"><nav className="tv-nav-inner" aria-label="Primary navigation"><Link href="/" className="tv-wordmark" aria-label="Timavelle Cuisine home"><span className="tv-mark" aria-hidden="true"><span className="tv-mark__bar" /><span className="tv-mark__bar" /><span className="tv-mark__bar" /></span><span className="tv-wordmark__name"><span>Timavelle</span><span className="tv-wordmark__suffix">Cuisine</span></span></Link><div id="primary-navigation" className="tv-nav-links" data-open={open}>{navLinks.map((link, index) => { const active = pathname === link.href || pathname.startsWith(`${link.href}/`); return <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="tv-nav-link" data-active={active} aria-current={active ? 'page' : undefined}><span>0{index + 1}</span>{link.label}</Link>; })}<Link href="/#reserve" className="tv-nav-button" onClick={() => setOpen(false)}>Plan an event <ArrowUpRight size={14} /></Link></div><div className="tv-nav-trailing"><CartTrigger /><button type="button" aria-controls="primary-navigation" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} onClick={() => setOpen((current) => !current)} className="tv-mobile-toggle">{open ? <X size={20} /> : <Menu size={20} />}</button></div></nav></header>;
}
