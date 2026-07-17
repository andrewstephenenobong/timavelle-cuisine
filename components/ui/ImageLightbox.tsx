'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageLightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
}

export default function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm"
    >
      <button
        aria-label="Close image"
        onClick={onClose}
        className="absolute right-5 top-5 text-ivory hover:text-gold"
      >
        <X size={28} />
      </button>

      <button
        aria-label={zoomed ? 'Zoom out' : 'Zoom in'}
        onClick={(e) => {
          e.stopPropagation();
          setZoomed((z) => !z);
        }}
        className="absolute bottom-5 right-5 flex items-center gap-2 rounded-full bg-ivory/90 px-4 py-2 text-sm font-utility text-ink hover:bg-ivory"
      >
        {zoomed ? <ZoomOut size={16} /> : <ZoomIn size={16} />}
        {zoomed ? 'Zoom out' : 'Zoom in'}
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative h-[80vh] w-full max-w-4xl overflow-auto transition-transform duration-300 ${
          zoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
        }`}
        onClickCapture={() => setZoomed((z) => !z)}
      >
        <Image src={src} alt={alt} fill className="object-contain" sizes="90vw" />
      </div>
    </div>
  );
}
