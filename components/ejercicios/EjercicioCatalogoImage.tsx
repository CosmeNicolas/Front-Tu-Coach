'use client';

import { useEffect, useRef, useState } from 'react';
import { PLACEHOLDER_EJERCICIO, resolveGifUrl } from '@/lib/ejercicios/gif-url';
import { cn } from '@/lib/utils';

interface Props {
  src?: string | null;
  alt: string;
  className?: string;
  containerClassName?: string;
  eager?: boolean;
}

/** Imagen de catálogo con fallback y lazy load (sin Cloudinary). */
export function EjercicioCatalogoImage({
  src,
  alt,
  className = 'ejercicio-gif-fondo h-20 w-full rounded-md object-contain',
  containerClassName,
  eager = false,
}: Props) {
  const target = resolveGifUrl(src);
  const [display, setDisplay] = useState(eager ? target : PLACEHOLDER_EJERCICIO);
  const [loading, setLoading] = useState(Boolean(src?.trim()));
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setDisplay(eager ? target : PLACEHOLDER_EJERCICIO);
    setLoading(Boolean(src?.trim()));
  }, [target, eager, src]);

  useEffect(() => {
    if (eager || !src?.trim()) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setDisplay(target);
          obs.disconnect();
        }
      },
      { rootMargin: '80px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, eager, src]);

  return (
    <div
      className={cn('ejercicio-gif-fondo relative w-full', containerClassName)}
    >
      {loading ? (
        <div
          className="ejercicio-gif-fondo absolute inset-0 animate-pulse rounded-md"
          aria-hidden
        />
      ) : null}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={ref}
        src={display}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={`${className} transition-opacity duration-200 ${loading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setLoading(false)}
        onError={() => {
          setDisplay(PLACEHOLDER_EJERCICIO);
          setLoading(false);
        }}
      />
    </div>
  );
}
