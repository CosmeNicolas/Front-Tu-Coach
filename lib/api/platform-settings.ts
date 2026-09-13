import { apiClient } from '@/lib/api/client';
import {
  FALLBACK_PUBLIC_PLATFORM_PRICING,
  normalizePublicPlatformPricing,
} from '@/lib/api/normalize-platform-pricing';
import { API_BASE_URL } from '@/lib/auth/constants';
import type {
  PlatformPricingAdminResponse,
  PlatformPricingValues,
  PublicPlatformPricing,
} from '@/types/platform-pricing';

export function fetchPublicPlatformPricing(): Promise<PublicPlatformPricing> {
  return fetch(`${API_BASE_URL}/platform/pricing`, {
    next: { revalidate: 300 },
  }).then(async (res) => {
    if (!res.ok) throw new Error('No se pudieron cargar los precios');
    const json: unknown = await res.json();
    return (
      normalizePublicPlatformPricing(json) ?? FALLBACK_PUBLIC_PLATFORM_PRICING
    );
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
