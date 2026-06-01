import {
  TOKEN_COOKIE_MAX_AGE,
  TOKEN_COOKIE_NAME,
  TOKEN_STORAGE_KEY,
} from '@/lib/auth/constants';

/** Token en memoria — fuente primaria durante la sesión activa */
let memoryToken: string | null = null;

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function syncCookie(token: string): void {
  if (!isBrowser()) return;
  document.cookie = `${TOKEN_COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=${TOKEN_COOKIE_MAX_AGE}; SameSite=Lax`;
}

function clearCookie(): void {
  if (!isBrowser()) return;
  document.cookie = `${TOKEN_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}

/** Sincroniza token en memory + localStorage + cookie */
export function setAccessToken(token: string): void {
  memoryToken = token;

  if (isBrowser()) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    syncCookie(token);
  }
}

export function getAccessToken(): string | null {
  if (memoryToken) return memoryToken;

  if (!isBrowser()) return null;

  const fromStorage = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (fromStorage) {
    memoryToken = fromStorage;
    syncCookie(fromStorage);
    return fromStorage;
  }

  return null;
}

export function clearAccessToken(): void {
  memoryToken = null;

  if (isBrowser()) {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    clearCookie();
  }
}

/** Hidrata memory desde localStorage al iniciar la app */
export function hydrateTokenStore(): void {
  if (!isBrowser() || memoryToken) return;

  const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (stored) {
    memoryToken = stored;
    syncCookie(stored);
  }
}
