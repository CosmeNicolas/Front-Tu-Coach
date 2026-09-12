import { apiClient } from '@/lib/api/client';
import { API_BASE_URL } from '@/lib/auth/constants';
import type {
  PlatformPricingAdminResponse,
  PlatformPricingValues,
  PublicPlatformPricing,
} from '@/types/platform-pricing';

export function fetchPublicPlatformPricing() {
  return fetch(`${API_BASE_URL}/platform/pricing`, {
    next: { revalidate: 300 },
  }).then(async (res) => {
    if (!res.ok) throw new Error('No se pudieron cargar los precios');
    return res.json() as Promise<PublicPlatformPricing>;
  });
}

export function fetchAdminPlatformPricing() {
  return apiClient<PlatformPricingAdminResponse>('/platform/admin/pricing', {
    auth: true,
  });
}

export function updateAdminPlatformPricing(pricing: PlatformPricingValues) {
  return apiClient<PlatformPricingAdminResponse>('/platform/admin/pricing', {
    auth: true,
    method: 'PATCH',
    body: pricing,
  });
}
