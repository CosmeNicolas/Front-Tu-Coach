import { PrivateExerciseMediaType } from '@/types/private-exercise';

export type ExerciseMediaType = PrivateExerciseMediaType;

export function extractYoutubeVideoId(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  try {
    const u = new URL(trimmed);
    const host = u.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      return u.pathname.slice(1).split('/')[0] || null;
    }

    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
      const fromQuery = u.searchParams.get('v');
      if (fromQuery) return fromQuery;

      const embed = u.pathname.match(/^\/embed\/([^/?]+)/);
      if (embed) return embed[1];

      const shorts = u.pathname.match(/^\/shorts\/([^/?]+)/);
      if (shorts) return shorts[1];
    }
  } catch {
    return null;
  }

  return null;
}

export function isYoutubeUrl(url?: string | null): boolean {
  return Boolean(url?.trim() && extractYoutubeVideoId(url));
}

export function youtubeEmbedUrl(url: string): string | null {
  const id = extractYoutubeVideoId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}

export function youtubeThumbnailUrl(url: string): string | null {
  const id = extractYoutubeVideoId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

/** Posters alternativos si hqdefault falla. */
export function youtubeThumbnailFallbacks(url: string): string[] {
  const id = extractYoutubeVideoId(url);
  if (!id) return [];
  return [
    `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
    `https://img.youtube.com/vi/${id}/mqdefault.jpg`,
    `https://img.youtube.com/vi/${id}/sddefault.jpg`,
  ];
}

/** Frame JPG desde video en Cloudinary (mejor que usar <img> con URL .mp4). */
export function cloudinaryVideoPosterUrl(url: string): string | null {
  const trimmed = url.trim();
  if (
    !trimmed.includes('res.cloudinary.com') ||
    !trimmed.includes('/video/upload/')
  ) {
    return null;
  }

  const withPoster = trimmed.includes('/video/upload/so_')
    ? trimmed
    : trimmed.replace('/video/upload/', '/video/upload/so_0,w_320,h_320,c_fill/');

  if (/\.(jpg|jpeg|png|webp)(\?.*)?$/i.test(withPoster)) {
    return withPoster;
  }

  return withPoster.replace(/\.(mp4|webm|mov|m4v)(\?.*)?$/i, '.jpg$2');
}

export function isVideoMediaUrl(url?: string | null): boolean {
  const type = inferMediaType(url);
  return type === 'mp4' || type === 'webm' || type === 'youtube';
}

export function inferMediaType(
  mediaUrl?: string | null,
  explicit?: ExerciseMediaType | null,
): ExerciseMediaType {
  if (explicit === 'youtube' || isYoutubeUrl(mediaUrl)) {
    return 'youtube';
  }

  const url = (mediaUrl ?? '').toLowerCase();

  if (url.includes('.webm')) return 'webm';
  if (
    url.includes('.mp4') ||
    url.includes('.mov') ||
    url.includes('.m4v') ||
    url.includes('/video/upload/')
  ) {
    return 'mp4';
  }
  if (url.includes('.gif')) return 'gif';
  if (url.trim()) return 'image';

  return explicit ?? 'gif';
}
