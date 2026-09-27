'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  archiveAdminStandardPlan,
  createAdminStandardPlan,
  fetchAdminStandardPlan,
  fetchAdminStandardPlans,
  fetchPublicStandardPlan,
  fetchPublicStandardPlanPreview,
  fetchPublicStandardPlans,
  publishAdminStandardPlan,
  seedFullbodyBeginnerStandardPlan,
  unarchiveAdminStandardPlan,
  updateAdminStandardPlan,
  upsertAdminStandardPlanSecciones,
} from '@/lib/api/standard-plans';
import type {
  CreateStandardPlanPayload,
  StandardPlanTemplateStatus,
  UpdateStandardPlanPayload,
} from '@/types/standard-plan';
import type { PlanificationSection } from '@/types/planification';

const KEY = ['admin-standard-plans'] as const;

export function useAdminStandardPlans(params?: {
  status?: StandardPlanTemplateStatus;
  search?: string;
}) {
  return useQuery({
    queryKey: [...KEY, params ?? {}],
    queryFn: () => fetchAdminStandardPlans(params),
  });
}

export function useAdminStandardPlan(id: string) {
  return useQuery({
    queryKey: [...KEY, id],
    queryFn: () => fetchAdminStandardPlan(id),
    enabled: Boolean(id),
  });
}

export function useCreateStandardPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateStandardPlanPayload) =>
      createAdminStandardPlan(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateStandardPlan(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateStandardPlanPayload) =>
      updateAdminStandardPlan(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.invalidateQueries({ queryKey: [...KEY, id] });
    },
  });
}

export function useUpsertStandardPlanSecciones(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      secciones: PlanificationSection[];
      expectedContentVersion?: number;
    }) => upsertAdminStandardPlanSecciones(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.invalidateQueries({ queryKey: [...KEY, id] });
    },
  });
}

export function usePublishStandardPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => publishAdminStandardPlan(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useArchiveStandardPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => archiveAdminStandardPlan(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUnarchiveStandardPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => unarchiveAdminStandardPlan(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useSeedFullbodyBeginner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (precioArs?: number) =>
      seedFullbodyBeginnerStandardPlan(precioArs),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function usePublicStandardPlans(enabled = true) {
  return useQuery({
    queryKey: ['public-standard-plans'],
    queryFn: () => fetchPublicStandardPlans(),
    enabled,
    retry: false,
  });
}

export function usePublicStandardPlan(slug: string) {
  return useQuery({
    queryKey: ['public-standard-plans', slug],
    queryFn: () => fetchPublicStandardPlan(slug),
    enabled: Boolean(slug),
    retry: false,
  });
}

export function usePublicStandardPlanPreview(slug: string) {
  return useQuery({
    queryKey: ['public-standard-plans', slug, 'preview'],
    queryFn: () => fetchPublicStandardPlanPreview(slug),
    enabled: Boolean(slug),
    retry: false,
  });
}
