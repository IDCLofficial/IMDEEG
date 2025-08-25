'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiX } from 'react-icons/fi';

interface ImageViewerProps {
  open: boolean;
  src: string;
  alt?: string;
  onClose: () => void;
}

export default function ImageViewer({ open, src, alt = 'Image preview', onClose }: ImageViewerProps) {
  const portalTarget = typeof window !== 'undefined' ? document.body : null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    // prevent background scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const content = (
    <div className="fixed inset-0 z-[10010]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative max-w-6xl w-full max-h-[90vh]">
          <button
            aria-label="Close image viewer"
            onClick={onClose}
            className="absolute -top-10 right-0 text-white text-3xl p-1"
          >
            <FiX />
          </button>
          <div className="relative w-full h-[70vh] md:h-[80vh] bg-black/20 rounded-lg overflow-hidden">
            <Image
              src={src}
              alt={alt}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );

  return portalTarget ? createPortal(content, portalTarget) : null;
}
