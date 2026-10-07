'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { MenuItem } from '@/lib/api';
import { useCart } from '@/components/cart/CartProvider';
import QuantityStepper from './QuantityStepper';

function formatNaira(value: number) {
  return `₦${value.toLocaleString('en-NG')}`;
}

export default function MenuItemCard({ item, onOpenDetails }: { item: MenuItem; onOpenDetails: () => void }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const hasAddOns = item.addOns.length > 0;

  function handleQuickAdd() {
    addItem({ menuItemId: item._id, name: item.name, unitPrice: item.price, image: item.image, quantity, addOns: [] });
    setQuantity(1);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  }

  return (
    <article className="tv-dish-card">
      <button type="button" className="tv-dish-card__media" onClick={onOpenDetails} aria-label={`View details for ${item.name}`}>
        {item.image ? (
          <Image src={item.image} alt={item.name} width={400} height={400} className="tv-dish-card__image" unoptimized />
        ) : (
          <span className="tv-dish-card__placeholder" aria-hidden="true">{item.category}</span>
        )}
      </button>
      <div className="tv-dish-card__body">
        <button type="button" className="tv-dish-card__title-row" onClick={onOpenDetails}>
          <span className="tv-dish-card__name">{item.name}</span>
          <span className="tv-dish-card__price">{formatNaira(item.price)}</span>
        </button>
        <p className="tv-dish-card__desc">{item.description}</p>
        <div className="tv-dish-card__actions">
          {hasAddOns ? (
            <button type="button" className="tv-dish-card__options" onClick={onOpenDetails}>Select options</button>
          ) : (
            <>
              <QuantityStepper quantity={quantity} onChange={setQuantity} size="sm" label={`${item.name} quantity`} />
              <button type="button" className={`tv-dish-card__add${justAdded ? ' tv-dish-card__add--done' : ''}`} onClick={handleQuickAdd}>
                {justAdded ? 'Added ✓' : 'Add to Cart'}
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
