'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { GalleryImage } from '@/lib/api';

type Props = { images: GalleryImage[] };

export default function GalleryViewer({ images }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const selected = selectedIndex === null ? null : images[selectedIndex];

  const close = () => {
    setSelectedIndex(null);
    setZoom(1);
  };

  const open = (index: number) => {
    setSelectedIndex(index);
    setZoom(1);
  };

  const move = useCallback((direction: -1 | 1) => {
    if (selectedIndex === null || images.length === 0) return;
    setSelectedIndex((selectedIndex + direction + images.length) % images.length);
    setZoom(1);
  }, [images.length, selectedIndex]);

  useEffect(() => {
    if (selectedIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowRight') move(1);
      if (event.key === 'ArrowLeft') move(-1);
      if (event.key === '+' || event.key === '=') setZoom((value) => Math.min(3, Number((value + 0.25).toFixed(2))));
      if (event.key === '-' || event.key === '_') setZoom((value) => Math.max(1, Number((value - 0.25).toFixed(2))));
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [move, selectedIndex]);

  const counter = useMemo(() => selectedIndex === null ? '' : `${selectedIndex + 1} of ${images.length}`, [selectedIndex, images.length]);

  return <>
    <div className="tv-gallery-wall" aria-label="Timavelle Cuisine gallery">
      {images.map((image, index) => (
        <button type="button" className="tv-gallery-tile" key={image._id} onClick={() => open(index)} aria-label={`Open ${image.caption || image.category || 'gallery image'}`}>
          <Image src={image.imageUrl} alt={image.caption || image.category || 'Timavelle Cuisine gallery image'} width={900} height={900} unoptimized className="tv-gallery-tile__image" />
          <span className="tv-gallery-tile__meta"><strong>{image.caption || 'Timavelle Cuisine'}</strong><small>{image.category || 'From the table'}</small></span>
        </button>
      ))}
    </div>

    {selected && selectedIndex !== null && <div className="tv-gallery-lightbox" role="dialog" aria-modal="true" aria-label="Gallery image viewer" onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
      <div className="tv-gallery-lightbox__topbar"><span>{counter}</span><div className="tv-gallery-lightbox__actions"><button type="button" onClick={() => setZoom((value) => Math.max(1, Number((value - 0.25).toFixed(2))))} disabled={zoom <= 1} aria-label="Zoom out">−</button><span>{Math.round(zoom * 100)}%</span><button type="button" onClick={() => setZoom((value) => Math.min(3, Number((value + 0.25).toFixed(2))))} disabled={zoom >= 3} aria-label="Zoom in">+</button><button type="button" onClick={close} aria-label="Close image viewer">×</button></div></div>
      <button type="button" className="tv-gallery-lightbox__nav tv-gallery-lightbox__nav--prev" onClick={() => move(-1)} aria-label="Previous image">‹</button>
      <figure className="tv-gallery-lightbox__figure"><div className="tv-gallery-lightbox__canvas"><Image src={selected.imageUrl} alt={selected.caption || selected.category || 'Timavelle Cuisine gallery image'} width={1600} height={1200} unoptimized className="tv-gallery-lightbox__image" style={{ transform: `scale(${zoom})` }} priority /></div><figcaption><strong>{selected.caption || 'Timavelle Cuisine'}</strong><span>{selected.category || 'From the table'}</span></figcaption></figure>
      <button type="button" className="tv-gallery-lightbox__nav tv-gallery-lightbox__nav--next" onClick={() => move(1)} aria-label="Next image">›</button>
    </div>}
  </>;
}
