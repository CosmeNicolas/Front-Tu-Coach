'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchAdminPlatformPricing,
  updateAdminPlatformPricing,
} from '@/lib/api/platform-settings';
import type { PlatformPricingValues } from '@/types/platform-pricing';

export function useAdminPlatformPricing() {
  return useQuery({
    queryKey: ['platform-pricing-admin'],
    queryFn: fetchAdminPlatformPricing,
  });
}

export function useUpdatePlatformPricing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (pricing: PlatformPricingValues) =>
      updateAdminPlatformPricing(pricing),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['platform-pricing-admin'] });
    },
  });
}
