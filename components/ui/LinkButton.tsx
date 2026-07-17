import Link from 'next/link';
import type { ReactNode } from 'react';

interface LinkButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export default function LinkButton({ href, children, className = '' }: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-block rounded-full bg-gold px-6 py-3 font-utility text-sm font-medium text-emerald-deep transition-colors hover:bg-emerald hover:text-ivory ${className}`}
    >
      {children}
    </Link>
  );
}
