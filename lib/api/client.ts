import { API_BASE_URL } from '@/lib/auth/constants';
import { getAccessToken } from '@/lib/auth/token-store';
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
}

export async function apiClient<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
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

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let message = 'Error en la solicitud';
    try {
      const errorBody = await response.json();
      const raw = errorBody.message;
      message = Array.isArray(raw) ? raw.join(', ') : (raw ?? message);
    } catch {
      // respuesta no JSON
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  const cached = getSessionUser();
  if (cached) return cached;

  const user = await apiClient<AuthUser>('/auth/me', { auth: true });
  setSessionUser(user);
  return user;
}

export function clearSession(): void {
  clearSessionUser();
}
