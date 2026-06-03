import {
  REFRESH_TOKEN_STORAGE_KEY,
  TOKEN_COOKIE_MAX_AGE,
  TOKEN_COOKIE_NAME,
  TOKEN_STORAGE_KEY,
} from '@/lib/auth/constants';

/** Token en memoria — fuente primaria durante la sesión activa */
let memoryToken: string | null = null;
let memoryRefreshToken: string | null = null;

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

export function setAccessToken(token: string): void {
  memoryToken = token;

  if (isBrowser()) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    syncCookie(token);
  }
}

export function setRefreshToken(token: string | null | undefined): void {
  memoryRefreshToken = token ?? null;

  if (!isBrowser()) return;

  if (token) {
    localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  }
}

export function setTokenPair(accessToken: string, refreshToken?: string | null): void {
  setAccessToken(accessToken);
  setRefreshToken(refreshToken);
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

export function getRefreshToken(): string | null {
  if (memoryRefreshToken) return memoryRefreshToken;

  if (!isBrowser()) return null;

  const fromStorage = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
  if (fromStorage) {
    memoryRefreshToken = fromStorage;
    return fromStorage;
  }

  return null;
}

export function clearAccessToken(): void {
  memoryToken = null;
  memoryRefreshToken = null;

  if (isBrowser()) {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    clearCookie();
  }
}

export function hydrateTokenStore(): void {
  if (!isBrowser()) return;

  if (!memoryToken) {
    const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (stored) {
      memoryToken = stored;
      syncCookie(stored);
    }
  }

  if (!memoryRefreshToken) {
    memoryRefreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
  }
}
