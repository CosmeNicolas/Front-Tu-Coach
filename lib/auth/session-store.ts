import { AuthUser } from '@/types/auth';

/** Sesión en memoria — evita llamadas redundantes a /auth/me */
let memoryUser: AuthUser | null = null;

export function setSessionUser(user: AuthUser | null): void {
  memoryUser = user;
}

export function getSessionUser(): AuthUser | null {
  return memoryUser;
}

export function clearSessionUser(): void {
  memoryUser = null;
}
