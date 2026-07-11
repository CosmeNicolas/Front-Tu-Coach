'use client';

import { EjercicioMediaPreview } from '@/components/ejercicios/EjercicioMediaPreview';
import { inferMediaType } from '@/lib/ejercicios/media-type';
import { PrivateExerciseMediaType } from '@/types/private-exercise';
import { cn } from '@/lib/utils';

interface Props {
  gif?: string | null;
  nombre: string;
  mediaType?: PrivateExerciseMediaType | null;
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
  mediaType,
  size = 'md',
  roundedFull = false,
}: Props) {
  const cls = SIZES[size];
  const resolvedType = inferMediaType(gif, mediaType);
  const radius = roundedFull ? 'rounded-full' : 'rounded-lg';

  return (
    <EjercicioMediaPreview
      src={gif}
      alt={nombre}
      mediaType={resolvedType}
      mode="thumbnail"
      eager
      containerClassName={cn(
        'ejercicio-gif-fondo shrink-0 overflow-hidden border border-border',
        cls,
        radius,
      )}
      className="h-full w-full object-contain object-center"
    />
  );
}
