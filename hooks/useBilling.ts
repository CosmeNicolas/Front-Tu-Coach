'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createBillingCheckout,
  fetchBillingPlanStatus,
} from '@/lib/api/billing';

export function useBillingPlanStatus() {
  return useQuery({
    queryKey: ['billing', 'plan-status'],
    queryFn: fetchBillingPlanStatus,
  });
}

export function useBillingCheckout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => createBillingCheckout('premium'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing', 'plan-status'] });
    },
  });
}
