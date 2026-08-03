import type { AuthUser } from '@/types/auth';

/** Nombre de pila para saludos (fallback: email o "ahí"). */
export function getFirstName(user: AuthUser | null | undefined): string {
  const nombre = user?.profile?.nombre?.trim();
  if (nombre) return nombre;

  const emailLocal = user?.email?.split('@')[0]?.trim();
  if (emailLocal) return emailLocal;

  return '';
}

export function getFullName(user: AuthUser | null | undefined): string {
  const nombre = user?.profile?.nombre?.trim() ?? '';
  const apellido = user?.profile?.apellido?.trim() ?? '';
  const full = [nombre, apellido].filter(Boolean).join(' ');
  return full || getFirstName(user);
}

/** Iniciales para avatar (máx. 2). */
export function getInitials(user: AuthUser | null | undefined): string {
  const nombre = user?.profile?.nombre?.trim() ?? '';
  const apellido = user?.profile?.apellido?.trim() ?? '';
  if (nombre && apellido) {
    return `${nombre[0]}${apellido[0]}`.toUpperCase();
  }
  if (nombre) return nombre.slice(0, 2).toUpperCase();
  const email = user?.email?.trim() ?? '';
  return email ? email.slice(0, 2).toUpperCase() : '?';
}

export function formatGreeting(user: AuthUser | null | undefined): string {
  const name = getFirstName(user);
  return name ? `Hola, ${name}` : 'Hola';
}
