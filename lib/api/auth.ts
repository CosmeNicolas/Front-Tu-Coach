import { API_BASE_URL } from '@/lib/auth/constants';
import { apiClient, clearSession } from '@/lib/api/client';
import {
  clearAccessToken,
  getRefreshToken,
  setTokenPair,
} from '@/lib/auth/token-store';
import { setSessionUser } from '@/lib/auth/session-store';
import { LoginCredentials, LoginResponse } from '@/types/auth';

export async function loginRequest(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  const response = await apiClient<LoginResponse>('/auth/login', {
    method: 'POST',
    body: credentials,
  });

  setTokenPair(response.accessToken, response.refreshToken);
  setSessionUser(response.user);

  return response;
}

export async function refreshSessionRequest(
  refreshToken: string,
): Promise<LoginResponse> {
  return apiClient<LoginResponse>('/auth/refresh', {
    method: 'POST',
    body: { refreshToken },
  });
}

export function logoutClient(): void {
  clearAccessToken();
  clearSession();
}

/** Revoca el refresh en el servidor y después limpia la sesión local. */
export async function logoutRequest(): Promise<void> {
  const refreshToken = getRefreshToken();
  if (refreshToken) {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
    } catch {
      // el cierre local no depende del servidor
    }
  }
  logoutClient();
}

export async function forgotPasswordRequest(email: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>('/auth/forgot-password', {
    method: 'POST',
    body: { email },
  });
}

export async function resetPasswordRequest(
  token: string,
  password: string,
): Promise<{ message: string }> {
  return apiClient<{ message: string }>('/auth/reset-password', {
    method: 'POST',
    body: { token, password },
  });
}

export type RegisterProfesorPayload = {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  nombreEstudio?: string;
};

export type RegisterAutogestionadoPayload = {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
};

async function persistSession(response: LoginResponse): Promise<LoginResponse> {
  setTokenPair(response.accessToken, response.refreshToken);
  setSessionUser(response.user);
  return response;
}

export async function registerProfesorRequest(
  payload: RegisterProfesorPayload,
): Promise<LoginResponse> {
  const response = await apiClient<LoginResponse>('/auth/register-profesor', {
    method: 'POST',
    body: payload,
  });
  return persistSession(response);
}

export async function registerAutogestionadoRequest(
  payload: RegisterAutogestionadoPayload,
): Promise<LoginResponse> {
  const response = await apiClient<LoginResponse>(
    '/auth/register-autogestionado',
    {
      method: 'POST',
      body: payload,
    },
  );
  return persistSession(response);
}
