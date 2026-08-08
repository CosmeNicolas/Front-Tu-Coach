'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  archivePlanification,
  createPlanification,
  createItemAdjustment,
  deletePlanification,
  fetchMaterialized,
  fetchPlanification,
  fetchPlanificationAdjustments,
  fetchPlanifications,
  resolveRevisionRequest,
  setCalentamiento,
  setVueltaCalma,
  updatePlanification,
  upsertSecciones,
} from '@/lib/api/planifications';
import {
  CreateItemAdjustmentPayload,
  CreatePlanificationPayload,
  SetCalentamientoPayload,
  SetVueltaCalmaPayload,
  UpdatePlanificationPayload,
  UpsertSeccionesPayload,
} from '@/types/planification';

export function usePlanifications(alumnoId?: string) {
  return useQuery({
    queryKey: ['planifications', alumnoId ?? 'all'],
    queryFn: () => fetchPlanifications({ alumnoId, limit: 50 }),
  });
}

export function usePlanification(id: string) {
  return useQuery({
    queryKey: ['planifications', 'detail', id],
    queryFn: () => fetchPlanification(id),
    enabled: Boolean(id),
  });
}

export function useCreatePlanification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePlanificationPayload) =>
      createPlanification(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['planifications'] }),
  });
}

export function useUpdatePlanification(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdatePlanificationPayload) =>
      updatePlanification(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['planifications'] });
      qc.invalidateQueries({ queryKey: ['planifications', 'detail', id] });
      qc.invalidateQueries({ queryKey: ['planifications', 'materialized', id] });
    },
  });
}

export function useArchivePlanification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => archivePlanification(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['planifications'] }),
  });
}

export function useResolveRevisionRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => resolveRevisionRequest(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ['planifications'] });
      qc.invalidateQueries({ queryKey: ['planifications', 'detail', id] });
      qc.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useDeletePlanification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePlanification(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['planifications'] }),
  });
}

function invalidatePlanificationCaches(qc: ReturnType<typeof useQueryClient>, id: string) {
  qc.invalidateQueries({ queryKey: ['planifications'] });
  qc.invalidateQueries({ queryKey: ['planifications', 'detail', id] });
  qc.invalidateQueries({ queryKey: ['planifications', 'materialized', id] });
}

export function useUpsertSecciones(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpsertSeccionesPayload) =>
      upsertSecciones(id, payload),
    onSuccess: async (data) => {
      invalidatePlanificationCaches(qc, id);
      qc.setQueryData(['planifications', 'detail', id], data);
      await qc.refetchQueries({
        queryKey: ['planifications', 'materialized', id],
      });
    },
  });
}

export function useSetCalentamiento(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: SetCalentamientoPayload) =>
      setCalentamiento(id, payload),
    onSuccess: () => invalidatePlanificationCaches(qc, id),
  });
}

export function useSetVueltaCalma(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: SetVueltaCalmaPayload) => setVueltaCalma(id, payload),
    onSuccess: () => invalidatePlanificationCaches(qc, id),
  });
}

export function useMaterializedPlanification(id: string) {
  return useQuery({
    queryKey: ['planifications', 'materialized', id],
    queryFn: () => fetchMaterialized(id),
    enabled: Boolean(id),
  });
}

export function usePlanificationAdjustments(planificationId: string) {
  return useQuery({
    queryKey: ['planifications', 'adjustments', planificationId],
    queryFn: () => fetchPlanificationAdjustments(planificationId),
    enabled: Boolean(planificationId),
  });
}

export function useCreateItemAdjustment(planificationId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      itemId,
      payload,
    }: {
      itemId: string;
      payload: CreateItemAdjustmentPayload;
    }) => createItemAdjustment(planificationId, itemId, payload),
    onSuccess: async (data) => {
      invalidatePlanificationCaches(qc, planificationId);
      qc.setQueryData(['planifications', 'detail', planificationId], data.planification);
      qc.invalidateQueries({
        queryKey: ['planifications', 'adjustments', planificationId],
      });
      await qc.refetchQueries({
        queryKey: ['planifications', 'materialized', planificationId],
      });
    },
  });
}
