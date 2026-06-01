'use client';

import { useState } from 'react';
import { PLACEHOLDER_EJERCICIO, resolveGifUrl } from '@/lib/ejercicios/gif-url';

interface Props {
  gif?: string | null;
  nombre: string;
  size?: 'sm' | 'md' | 'lg';
  roundedFull?: boolean;
}

const SIZES = {
  sm: 'h-10 w-10',
  md: 'h-16 w-16',
  lg: 'h-16 w-16 sm:h-20 sm:w-20',
};

export function EjercicioAvatar({
  gif,
  nombre,
  size = 'md',
  roundedFull = false,
}: Props) {
  const cls = SIZES[size];
  const [failed, setFailed] = useState(false);
  const radius = roundedFull ? 'rounded-full' : 'rounded-lg';
  const src = failed ? PLACEHOLDER_EJERCICIO : resolveGifUrl(gif);

  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={nombre}
      className={
        roundedFull
          ? 'max-h-full max-w-full object-contain object-center'
          : `${cls} ejercicio-gif-fondo shrink-0 ${radius} border border-border object-contain object-center`
      }
      onError={() => setFailed(true)}
    />
  );

  if (roundedFull) {
    return (
      <div
        className={`${cls} ejercicio-gif-fondo mx-auto flex shrink-0 items-center justify-center overflow-hidden ${radius} border border-border`}
      >
        {img}
      </div>
    );
  }

  return img;
}
