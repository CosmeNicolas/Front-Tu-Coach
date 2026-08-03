import { API_BASE_URL } from '@/lib/auth/constants';
import { getAccessToken } from '@/lib/auth/token-store';
import { tryRefreshAccessToken } from '@/lib/api/refresh-session';
import {
  clearSessionUser,
  getSessionUser,
  setSessionUser,
} from '@/lib/auth/session-store';
import { AuthUser } from '@/types/auth';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  auth?: boolean;
  /** Evita loop al refrescar token */
  skipRefresh?: boolean;
}

async function parseErrorMessage(response: Response): Promise<string> {
  let message = 'Error en la solicitud';
  try {
    const errorBody = await response.json();
    const raw = errorBody.message;
    message = Array.isArray(raw) ? raw.join(', ') : (raw ?? message);
  } catch {
    // respuesta no JSON
  }
  return message;
}

async function executeFetch<T>(
  path: string,
  options: RequestOptions,
): Promise<Response> {
  const { body, auth = false, headers, ...rest } = options;

  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (auth) {
    const token = getAccessToken();
    if (token) {
      (requestHeaders as Record<string, string>).Authorization = `Bearer ${token}`;
    }
  }

  return fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

export async function apiClient<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  let response = await executeFetch(path, options);

  if (
    response.status === 401 &&
    options.auth &&
    !options.skipRefresh &&
    path !== '/auth/refresh'
  ) {
    const refreshed = await tryRefreshAccessToken();
    if (refreshed) {
      response = await executeFetch(path, options);
    }
  }

  if (!response.ok) {
    throw new ApiError(await parseErrorMessage(response), response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function fetchCurrentUser(options?: {
  force?: boolean;
}): Promise<AuthUser> {
  if (!options?.force) {
    const cached = getSessionUser();
    if (cached) return cached;
  }

  const user = await apiClient<AuthUser>('/auth/me', { auth: true });
  setSessionUser(user);
  return user;
}

export function clearSession(): void {
  clearSessionUser();
}
