'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export const DEFAULT_IMAGEN_ZOOM = 100;
export const MIN_IMAGEN_ZOOM = 100;
export const MAX_IMAGEN_ZOOM = 300;

interface SponsorLogoProps {
  src: string;
  alt: string;
  className?: string;
  zoom?: number;
}

export function SponsorLogo({
  src,
  alt,
  className,
  zoom = DEFAULT_IMAGEN_ZOOM,
}: SponsorLogoProps) {
  const [failed, setFailed] = useState(false);
  const scale = Math.min(
    MAX_IMAGEN_ZOOM,
    Math.max(MIN_IMAGEN_ZOOM, zoom),
  ) / 100;

  useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl bg-muted/40',
        className,
      )}
    >
      {failed || !src ? (
        <span className="flex h-full w-full items-center justify-center px-3 text-center text-xs font-medium text-muted-foreground">
          {alt}
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover object-center"
          style={{ transform: `scale(${scale})` }}
        />
      )}
    </div>
  );
}
