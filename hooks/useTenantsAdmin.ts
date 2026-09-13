'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  archiveTenant,
  createTenant,
  fetchTenantSecuritySummary,
  markTenantSuspicious,
  reactivateTenant,
  suspendTenant,
  unmarkTenantSuspicious,
  updateTenant,
} from '@/lib/api/tenants';
import {
  CreateTenantPayload,
  UpdateTenantPayload,
} from '@/types/admin';

export function useCreateTenant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTenantPayload) => createTenant(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tenants'] }),
  });
}

export function useUpdateTenant(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateTenantPayload) => updateTenant(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenants'] });
      qc.invalidateQueries({ queryKey: ['tenants', id] });
      qc.invalidateQueries({ queryKey: ['gym-admin'] });
      qc.invalidateQueries({ queryKey: ['gym-admin', 'platform-overview'] });
    },
  });
}

export function useSuspendTenant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, motivo }: { id: string; motivo?: string }) =>
      suspendTenant(id, motivo),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenants'] });
      qc.invalidateQueries({ queryKey: ['gym-admin'] });
    },
  });
}

export function useReactivateTenant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reactivateTenant(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenants'] });
      qc.invalidateQueries({ queryKey: ['gym-admin'] });
    },
  });
}

export function useMarkTenantSuspicious() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, motivo }: { id: string; motivo?: string }) =>
      markTenantSuspicious(id, motivo),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tenants'] }),
  });
}

export function useUnmarkTenantSuspicious() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => unmarkTenantSuspicious(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tenants'] }),
  });
}

export function useArchiveTenant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => archiveTenant(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tenants'] });
      qc.invalidateQueries({ queryKey: ['gym-admin'] });
    },
  });
}

export function useTenantSecuritySummary(id: string, enabled: boolean) {
  return useQuery({
    queryKey: ['tenants', id, 'security-summary'],
    queryFn: () => fetchTenantSecuritySummary(id),
    enabled,
  });
}
