import { apiClient, clearSession } from '@/lib/api/client';
import { clearAccessToken, setAccessToken } from '@/lib/auth/token-store';
import { setSessionUser } from '@/lib/auth/session-store';
import { LoginCredentials, LoginResponse } from '@/types/auth';

export async function loginRequest(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  const response = await apiClient<LoginResponse>('/auth/login', {
    method: 'POST',
    body: credentials,
  });

  setAccessToken(response.accessToken);
  setSessionUser(response.user);

  return response;
}

export function logoutClient(): void {
  clearAccessToken();
  clearSession();
}
