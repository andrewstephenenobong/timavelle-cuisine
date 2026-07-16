import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function Button({ children, className = '', ...rest }: ButtonProps) {
  return (
    <button
      className={`rounded-full bg-gold px-6 py-3 font-utility text-sm font-medium text-emerald-deep transition-colors hover:bg-emerald hover:text-ivory ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
