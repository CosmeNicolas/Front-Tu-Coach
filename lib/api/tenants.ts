import { apiClient } from '@/lib/api/client';
import {
  CreateTenantPayload,
  UpdateTenantPayload,
} from '@/types/admin';
import { TenantSummary } from '@/types/gym-admin';

export function fetchTenants() {
  return apiClient<TenantSummary[]>('/tenants', { auth: true });
}

export function fetchTenant(id: string) {
  return apiClient<TenantSummary>(`/tenants/${id}`, { auth: true });
}

export function createTenant(payload: CreateTenantPayload) {
  return apiClient<TenantSummary>('/tenants', {
    auth: true,
    method: 'POST',
    body: payload,
  });
}

export function updateTenant(id: string, payload: UpdateTenantPayload) {
  return apiClient<TenantSummary>(`/tenants/${id}`, {
    auth: true,
    method: 'PATCH',
    body: payload,
  });
}

export function suspendTenant(id: string) {
  return apiClient<{ message: string }>(`/tenants/${id}`, {
    auth: true,
    method: 'DELETE',
  });
}
