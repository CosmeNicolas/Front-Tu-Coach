'use client';

import { useMemo, useState } from 'react';
import { Play } from 'lucide-react';
import { EjercicioCatalogoImage } from '@/components/ejercicios/EjercicioCatalogoImage';
import { PLACEHOLDER_EJERCICIO } from '@/lib/ejercicios/gif-url';
import {
  cloudinaryVideoPosterUrl,
  ExerciseMediaType,
  inferMediaType,
  youtubeEmbedUrl,
  youtubeThumbnailFallbacks,
} from '@/lib/ejercicios/media-type';
import { cn } from '@/lib/utils';

interface Props {
  src?: string | null;
  alt: string;
  mediaType?: ExerciseMediaType | null;
  mode?: 'thumbnail' | 'embed';
  className?: string;
  containerClassName?: string;
  eager?: boolean;
}

function MediaFallback({
  label,
  containerClassName,
  className,
}: {
  label: string;
  containerClassName?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'ejercicio-gif-fondo relative flex w-full flex-col items-center justify-center gap-1 overflow-hidden rounded-lg border border-border bg-muted/60 text-muted-foreground',
        containerClassName,
        className,
      )}
    >
      <Play className="size-5 opacity-70" aria-hidden />
      <span className="px-1 text-center text-[9px] font-semibold uppercase tracking-wide">
        {label}
      </span>
    </div>
  );
}

function YoutubeThumbnail({
  src,
  alt,
  className,
  containerClassName,
}: {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}) {
  const candidates = useMemo(() => youtubeThumbnailFallbacks(src), [src]);
  const [index, setIndex] = useState(0);
  const current = candidates[index];

  if (!current) {
    return <MediaFallback label="YouTube" containerClassName={containerClassName} />;
  }

  return (
    <div
      className={cn(
        'ejercicio-gif-fondo relative w-full overflow-hidden rounded-lg border border-border bg-black/90',
        containerClassName,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={current}
        alt={alt}
        className={cn('h-full w-full object-cover object-center', className)}
        onError={() => {
          setIndex((i) => (i + 1 < candidates.length ? i + 1 : candidates.length));
        }}
      />
      {index >= candidates.length ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-muted/80 text-muted-foreground">
          <Play className="size-5" aria-hidden />
          <span className="text-[9px] font-semibold uppercase">YouTube</span>
        </div>
      ) : (
        <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">
          YouTube
        </span>
      )}
    </div>
  );
}

function VideoThumbnail({
  src,
  alt,
  className,
  containerClassName,
}: {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}) {
  const poster = useMemo(() => cloudinaryVideoPosterUrl(src), [src]);
  const [posterFailed, setPosterFailed] = useState(false);

  if (poster && !posterFailed) {
    return (
      <div
        className={cn(
          'ejercicio-gif-fondo relative w-full overflow-hidden rounded-lg border border-border bg-black/90',
          containerClassName,
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={poster}
          alt={alt}
          className={cn('h-full w-full object-cover object-center', className)}
          onError={() => setPosterFailed(true)}
        />
        <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">
          Video
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'ejercicio-gif-fondo relative w-full overflow-hidden rounded-lg border border-border bg-black',
        containerClassName,
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        src={src}
        muted
        playsInline
        preload="metadata"
        aria-label={alt}
        className={cn('h-full w-full object-cover object-center', className)}
      />
      <span className="pointer-events-none absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">
        Video
      </span>
    </div>
  );
}

export function EjercicioMediaPreview({
  src,
  alt,
  mediaType,
  mode = 'thumbnail',
  className,
  containerClassName,
  eager = false,
}: Props) {
  const resolvedType = useMemo(
    () => inferMediaType(src, mediaType),
    [src, mediaType],
  );

  if (!src?.trim()) {
    return (
      <EjercicioCatalogoImage
        src={null}
        alt={alt}
        className={className}
        containerClassName={containerClassName}
        eager={eager}
      />
    );
  }

  if (resolvedType === 'youtube') {
    if (mode === 'embed') {
      const embed = youtubeEmbedUrl(src);
      if (!embed) {
        return (
          <MediaFallback
            label="YouTube inválido"
            containerClassName={containerClassName}
          />
        );
      }

      return (
        <div
          className={cn(
            'ejercicio-gif-fondo relative w-full overflow-hidden rounded-xl border border-border',
            containerClassName,
          )}
        >
          <div className="aspect-video w-full">
            <iframe
              src={embed}
              title={alt}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      );
    }

    return (
      <YoutubeThumbnail
        src={src}
        alt={alt}
        className={className}
        containerClassName={containerClassName}
      />
    );
  }

  if (resolvedType === 'mp4' || resolvedType === 'webm') {
    if (mode === 'embed') {
      return (
        <div
          className={cn(
            'ejercicio-gif-fondo relative w-full overflow-hidden rounded-xl border border-border',
            containerClassName,
          )}
        >
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            src={src}
            controls
            className={cn('max-h-full w-full object-contain', className)}
          />
        </div>
      );
    }

    return (
      <VideoThumbnail
        src={src}
        alt={alt}
        className={className}
        containerClassName={containerClassName}
      />
    );
  }

  return (
    <EjercicioCatalogoImage
      src={src}
      alt={alt}
      className={className ?? 'ejercicio-gif-fondo h-full w-full rounded-md object-contain'}
      containerClassName={containerClassName}
      eager={eager}
    />
  );
}

export { PLACEHOLDER_EJERCICIO };
