import { apiClient } from '@/lib/api/client';
import {
  CreateTenantPayload,
  UpdateTenantPayload,
} from '@/types/admin';
import {
  TenantSecuritySummary,
  TenantSummary,
} from '@/types/gym-admin';

export function fetchTenants() {
  return apiClient<TenantSummary[]>('/tenants', { auth: true });
}

export function fetchTenant(id: string) {
  return apiClient<TenantSummary>(`/tenants/${id}`, { auth: true });
}

export function fetchTenantSecuritySummary(id: string) {
  return apiClient<TenantSecuritySummary>(`/tenants/${id}/security-summary`, {
    auth: true,
  });
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

export function suspendTenant(id: string, motivo?: string) {
  return apiClient<{ message: string; tenant: TenantSummary }>(
    `/tenants/${id}/suspend`,
    {
      auth: true,
      method: 'PATCH',
      body: motivo ? { motivo } : {},
    },
  );
}

export function reactivateTenant(id: string) {
  return apiClient<{ message: string; tenant: TenantSummary }>(
    `/tenants/${id}/reactivate`,
    {
      auth: true,
      method: 'PATCH',
      body: {},
    },
  );
}

export function markTenantSuspicious(id: string, motivo?: string) {
  return apiClient<{ message: string; tenant: TenantSummary }>(
    `/tenants/${id}/mark-suspicious`,
    {
      auth: true,
      method: 'PATCH',
      body: motivo ? { motivo } : {},
    },
  );
}

export function unmarkTenantSuspicious(id: string) {
  return apiClient<{ message: string; tenant: TenantSummary }>(
    `/tenants/${id}/unmark-suspicious`,
    {
      auth: true,
      method: 'PATCH',
      body: {},
    },
  );
}

export function archiveTenant(id: string) {
  return apiClient<{ message: string; tenant: TenantSummary }>(
    `/tenants/${id}`,
    {
      auth: true,
      method: 'DELETE',
    },
  );
}
