'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createGymProfesor,
  fetchGymDashboard,
  fetchPlatformOverview,
  fetchProfesorAlumnos,
  fetchProfesorDetail,
  type CreateGymProfesorPayload,
} from '@/lib/api/gym-admin';
import { fetchTenants } from '@/lib/api/tenants';

export function useTenants() {
  return useQuery({
    queryKey: ['tenants'],
    queryFn: fetchTenants,
  });
}

export function useGymDashboard(tenantId?: string) {
  return useQuery({
    queryKey: ['gym-admin', 'dashboard', tenantId ?? 'own'],
    queryFn: () => fetchGymDashboard(tenantId),
  });
}

export function usePlatformOverview(enabled = true) {
  return useQuery({
    queryKey: ['gym-admin', 'platform-overview'],
    queryFn: fetchPlatformOverview,
    enabled,
  });
}

export function useProfesorDetail(profesorId: string, tenantId?: string) {
  return useQuery({
    queryKey: ['gym-admin', 'profesor', profesorId, tenantId ?? 'own'],
    queryFn: () => fetchProfesorDetail(profesorId, tenantId),
    enabled: Boolean(profesorId),
  });
}

export function useProfesorAlumnos(profesorId: string, tenantId?: string) {
  return useQuery({
    queryKey: ['gym-admin', 'profesor-alumnos', profesorId, tenantId ?? 'own'],
    queryFn: () => fetchProfesorAlumnos(profesorId, tenantId),
    enabled: Boolean(profesorId),
  });
}

export function useCreateGymProfesor(tenantId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateGymProfesorPayload) =>
      createGymProfesor(payload, tenantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gym-admin', 'dashboard'] });
    },
  });
}
