'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchCurrentUser } from '@/lib/api/client';
import { hydrateTokenStore, getAccessToken } from '@/lib/auth/token-store';

export function useAuth() {
  hydrateTokenStore();
  const hasToken = Boolean(getAccessToken());

  return useQuery({
    queryKey: ['auth', 'me'],
    // Siempre refrescar desde API: el cache en memoria puede quedar con nombre viejo
    queryFn: () => fetchCurrentUser({ force: true }),
    enabled: hasToken,
    staleTime: 30_000,
    retry: false,
  });
}
