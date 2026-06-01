'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchCurrentUser } from '@/lib/api/client';
import { hydrateTokenStore, getAccessToken } from '@/lib/auth/token-store';

export function useAuth() {
  hydrateTokenStore();
  const hasToken = Boolean(getAccessToken());

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: fetchCurrentUser,
    enabled: hasToken,
    retry: false,
  });
}
