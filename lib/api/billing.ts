import { apiClient } from '@/lib/api/client';
import { PlanCodigo } from '@/types/admin';
import { TenantCupos } from '@/types/gym-admin';

export interface BillingPlanStatus {
  planCodigo: PlanCodigo;
  planEfectivo: PlanCodigo;
  trialEndsAt: string | null;
  planVenceAt: string | null;
  cupos: TenantCupos;
  checkoutAvailable: boolean;
  canCheckout: boolean;
  checkoutPlans: Array<{
    id: 'premium';
    planCodigo: PlanCodigo;
    title: string;
    amountArs: number;
    billingDays: number;
  }>;
}

export interface BillingCheckoutResult {
  preferenceId: string | null;
  checkoutUrl: string;
  amountArs: number;
  planCodigo: PlanCodigo;
}

export function fetchBillingPlanStatus() {
  return apiClient<BillingPlanStatus>('/billing/plan-status', { auth: true });
}

export function createBillingCheckout(planId: 'premium') {
  return apiClient<BillingCheckoutResult>('/billing/checkout', {
    method: 'POST',
    auth: true,
    body: { planId },
  });
}

export interface StandardPlanCheckoutResult {
  preferenceId: string | null;
  checkoutUrl: string;
  amountArs: number;
  enrollmentId: string;
  templateNombre: string;
}

export interface StandardPlanConfirmResult {
  ok: boolean;
  status: 'purchased' | 'pending' | 'rejected' | 'already';
  accessStatus?: string;
}

export function createStandardPlanCheckout(planificationId: string) {
  return apiClient<StandardPlanCheckoutResult>(
    '/billing/standard-plan/checkout',
    {
      method: 'POST',
      auth: true,
      body: { planificationId },
    },
  );
}

export function confirmStandardPlanPayment(paymentId: string) {
  return apiClient<StandardPlanConfirmResult>(
    '/billing/standard-plan/confirm',
    {
      method: 'POST',
      auth: true,
      body: { paymentId },
    },
  );
}
