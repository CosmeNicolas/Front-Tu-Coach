'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createTenant,
  suspendTenant,
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
    },
  });
}

export function useSuspendTenant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => suspendTenant(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tenants'] }),
  });
}
