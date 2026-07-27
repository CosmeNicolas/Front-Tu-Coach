'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  completeStudentSession,
  fetchMiPerfil,
  fetchMiPlanificacion,
  fetchMisPlanificaciones,
  fetchStudentMaterialized,
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
