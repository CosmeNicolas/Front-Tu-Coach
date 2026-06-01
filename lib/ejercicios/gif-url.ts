export const PLACEHOLDER_EJERCICIO = '/placeholder-ejercicio.svg';

/**
 * Resuelve rutas de GIF legacy (`/gif/...` en /public) u otras URLs.
 */
export function resolveGifUrl(gif?: string | null): string {
  const raw = (gif ?? '').trim();
  if (!raw) return PLACEHOLDER_EJERCICIO;
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
  if (raw.startsWith('/')) return raw;
  return `/gif/${raw.replace(/^\/+/, '')}`;
}

export function gifParaItem(guardado?: string | null): string | null {
  const raw = (guardado ?? '').trim();
  if (!raw) return null;
  return resolveGifUrl(raw);
}
