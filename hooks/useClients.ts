'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createClient,
  deleteClient,
  fetchClient,
  fetchClientPortalAccess,
  fetchClients,
  updateClient,
  upsertClientPortalAccess,
} from '@/lib/api/clients';
import { UpsertClientPortalPayload } from '@/types/client-portal';
import { CreateClientPayload, UpdateClientPayload } from '@/types/client';

export function useClients(params?: { search?: string; limit?: number }) {
  const search = params?.search;
  const limit = params?.limit ?? 50;
  return useQuery({
    queryKey: ['clients', search ?? '', limit],
    queryFn: () => fetchClients({ search, limit }),
  });
}

export function useClient(id: string) {
  return useQuery({
    queryKey: ['clients', id],
    queryFn: () => fetchClient(id),
    enabled: Boolean(id),
  });
}

export function useCreateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateClientPayload) => createClient(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  });
}

export function useUpdateClient(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateClientPayload) => updateClient(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clients'] });
      qc.invalidateQueries({ queryKey: ['clients', id] });
    },
  });
}

export function useDeleteClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteClient(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  });
}

export function useClientPortalAccess(clientId: string) {
  return useQuery({
    queryKey: ['clients', clientId, 'portal-access'],
    queryFn: () => fetchClientPortalAccess(clientId),
    enabled: Boolean(clientId),
  });
}

export function useUpsertClientPortalAccess(clientId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpsertClientPortalPayload) =>
      upsertClientPortalAccess(clientId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clients', clientId, 'portal-access'] });
      qc.invalidateQueries({ queryKey: ['clients', clientId] });
      qc.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}
