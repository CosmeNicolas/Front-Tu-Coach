'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createAdminProfesor,
  fetchAdminProfesores,
  updateAdminProfesor,
} from '@/lib/api/admin-profesores';
import {
  CreateProfesorPayload,
  QueryProfesoresParams,
  UpdateProfesorPayload,
} from '@/types/admin';

export function useAdminProfesores(params?: QueryProfesoresParams) {
  const tenantId = params?.tenantId ?? '';
  const search = params?.search ?? '';
  const limit = params?.limit ?? 200;

  return useQuery({
    queryKey: ['admin-profesores', tenantId, search, limit],
    queryFn: () => fetchAdminProfesores({ tenantId: tenantId || undefined, search, limit }),
  });
}

export function useCreateAdminProfesor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProfesorPayload) => createAdminProfesor(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-profesores'] });
      qc.invalidateQueries({ queryKey: ['gym-admin'] });
    },
  });
}

export function useUpdateAdminProfesor(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfesorPayload) =>
      updateAdminProfesor(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-profesores'] });
      qc.invalidateQueries({ queryKey: ['gym-admin'] });
    },
  });
}
