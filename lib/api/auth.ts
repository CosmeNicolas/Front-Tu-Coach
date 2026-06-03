import { apiClient, clearSession } from '@/lib/api/client';
import {
  clearAccessToken,
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
