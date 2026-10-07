'use client';

interface Props {
  quantity: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
  label?: string;
}

export default function QuantityStepper({ quantity, onChange, min = 1, max = 20, size = 'md', label = 'Quantity' }: Props) {
  return (
    <div className={`tv-qty tv-qty--${size}`} role="group" aria-label={label}>
      <button type="button" onClick={() => onChange(Math.max(min, quantity - 1))} disabled={quantity <= min} aria-label="Decrease quantity">−</button>
      <span aria-live="polite">{quantity}</span>
      <button type="button" onClick={() => onChange(Math.min(max, quantity + 1))} disabled={quantity >= max} aria-label="Increase quantity">+</button>
    </div>
  );
}
