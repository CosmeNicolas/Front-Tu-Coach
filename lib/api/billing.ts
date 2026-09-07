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
    body: JSON.stringify({ planId }),
  });
}
