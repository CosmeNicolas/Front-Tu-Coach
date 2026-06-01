import { apiClient } from '@/lib/api/client';
import { TenantSummary } from '@/types/gym-admin';

export function fetchTenants() {
  return apiClient<TenantSummary[]>('/tenants', { auth: true });
}
