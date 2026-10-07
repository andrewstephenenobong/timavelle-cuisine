'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import type { MenuItem } from '@/lib/api';
import { useCart } from '@/components/cart/CartProvider';
import QuantityStepper from './QuantityStepper';

function formatNaira(value: number) {
  return `₦${value.toLocaleString('en-NG')}`;
}

export default function MenuItemModal({ item, onClose }: { item: MenuItem; onClose: () => void }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  const addOnLookup = useMemo(() => new Map(item.addOns.map((addOn) => [addOn.name, addOn.price])), [item.addOns]);
  const addOnsTotal = useMemo(() => selectedAddOns.reduce((sum, name) => sum + (addOnLookup.get(name) ?? 0), 0), [selectedAddOns, addOnLookup]);
  const lineTotal = (item.price + addOnsTotal) * quantity;

  function toggleAddOn(name: string) {
    setSelectedAddOns((current) => current.includes(name) ? current.filter((entry) => entry !== name) : [...current, name]);
  }

  function handleAdd() {
    addItem({
      menuItemId: item._id,
      name: item.name,
      unitPrice: item.price,
      image: item.image,
      quantity,
      addOns: item.addOns.filter((addOn) => selectedAddOns.includes(addOn.name)),
    });
    onClose();
  }

  return (
    <div className="tv-menu-modal" role="dialog" aria-modal="true" aria-label={item.name} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="tv-menu-modal__panel">
        <button type="button" className="tv-menu-modal__close" onClick={onClose} aria-label="Close">×</button>
        <div className="tv-menu-modal__media">
          {item.image ? (
            <Image src={item.image} alt={item.name} width={800} height={600} className="tv-menu-modal__image" unoptimized priority />
          ) : (
            <span className="tv-menu-modal__placeholder" aria-hidden="true">{item.category}</span>
          )}
        </div>
        <div className="tv-menu-modal__content">
          <span className="tv-menu-modal__category">{item.category}</span>
          <h2>{item.name}</h2>
          <p className="tv-menu-modal__desc">{item.description}</p>
          <p className="tv-menu-modal__base-price">{formatNaira(item.price)}</p>

          {item.addOns.length > 0 && (
            <fieldset className="tv-menu-modal__addons">
              <legend>Add-ons</legend>
              {item.addOns.map((addOn) => (
                <label key={addOn.name} className="tv-menu-modal__addon">
                  <span><input type="checkbox" checked={selectedAddOns.includes(addOn.name)} onChange={() => toggleAddOn(addOn.name)} /> {addOn.name}</span>
                  <span>+{formatNaira(addOn.price)}</span>
                </label>
              ))}
            </fieldset>
          )}

          <div className="tv-menu-modal__footer">
            <QuantityStepper quantity={quantity} onChange={setQuantity} label={`${item.name} quantity`} />
            <button type="button" className="tv-menu-modal__add" onClick={handleAdd}>
              Add to Cart · {formatNaira(lineTotal)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
