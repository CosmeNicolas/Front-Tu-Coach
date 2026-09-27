'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  confirmStandardPlanPayment,
  createStandardPlanCheckout,
} from '@/lib/api/billing';

export function useStandardPlanCheckout() {
  return useMutation({
    mutationFn: (planificationId: string) =>
      createStandardPlanCheckout(planificationId),
  });
}

export function useConfirmStandardPlanPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (paymentId: string) => confirmStandardPlanPayment(paymentId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['alumno'] });
    },
  });
}
