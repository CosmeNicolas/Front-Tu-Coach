'use client';

import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  completeStudentSession,
  fetchMiPerfil,
  fetchMiPlanificacion,
  fetchMisPlanificaciones,
  fetchStudentMaterialized,
  solicitarNuevaPlanificacion,
} from '@/lib/api/student-portal';
import { CompleteSessionPayloadV2 } from '@/types/alumno-session';

export function useMiPerfil() {
  return useQuery({
    queryKey: ['alumno', 'mi-perfil'],
    queryFn: fetchMiPerfil,
  });
}

export function useMiPlanificacion() {
  return useQuery({
    queryKey: ['alumno', 'mi-planificacion'],
    queryFn: fetchMiPlanificacion,
    retry: false,
  });
}

export function useMisPlanificaciones() {
  return useQuery({
    queryKey: ['alumno', 'mis-planificaciones'],
    queryFn: fetchMisPlanificaciones,
  });
}

export function useStudentMaterialized(planificationId: string) {
  return useQuery({
    queryKey: ['alumno', 'materialized', planificationId],
    queryFn: () => fetchStudentMaterialized(planificationId),
    enabled: Boolean(planificationId),
  });
}

export function useStudentMaterializedBatch(
  planificationIds: string[],
  enabled = true,
) {
  const queries = useQueries({
    queries: planificationIds.map((id) => ({
      queryKey: ['alumno', 'materialized', id],
      queryFn: () => fetchStudentMaterialized(id),
      enabled: enabled && Boolean(id),
    })),
  });

  const isLoading = queries.some((q) => q.isLoading);
  const isFetching = queries.some((q) => q.isFetching);
  const data = queries
    .map((q, index) =>
      q.data
        ? { id: planificationIds[index]!, materialized: q.data }
        : null,
    )
    .filter(
      (item): item is { id: string; materialized: Awaited<ReturnType<typeof fetchStudentMaterialized>> } =>
        item !== null,
    );

  return { data, isLoading, isFetching, queries };
}

export function useCompleteSession(planificationId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      sessionNum,
      payload,
    }: {
      sessionNum: number;
      payload: CompleteSessionPayloadV2;
    }) => completeStudentSession(planificationId, sessionNum, payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['alumno', 'mi-planificacion'] });
      await qc.invalidateQueries({ queryKey: ['alumno', 'mis-planificaciones'] });
      await qc.invalidateQueries({
        queryKey: ['alumno', 'materialized', planificationId],
      });
      qc.invalidateQueries({ queryKey: ['planifications'] });
    },
  });
}

export function useSolicitarNuevaPlanificacion(planificationId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (mensaje?: string) =>
      solicitarNuevaPlanificacion(planificationId, mensaje),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['alumno', 'mi-planificacion'] });
      await qc.invalidateQueries({ queryKey: ['alumno', 'mis-planificaciones'] });
    },
  });
}
