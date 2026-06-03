import { API_BASE_URL } from '@/lib/auth/constants';
import {
  getRefreshToken,
  setTokenPair,
} from '@/lib/auth/token-store';
import { LoginResponse } from '@/types/auth';

let refreshInFlight: Promise<boolean> | null = null;

export async function tryRefreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
        if (!response.ok) return false;

        const data = (await response.json()) as LoginResponse;
        setTokenPair(data.accessToken, data.refreshToken ?? refreshToken);
        return true;
      } catch {
        return false;
      } finally {
        refreshInFlight = null;
      }
    })();
  }

  return refreshInFlight;
}
