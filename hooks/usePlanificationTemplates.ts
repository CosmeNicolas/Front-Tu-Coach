'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  cloneTemplateToClient,
  createTemplate,
  CreateTemplatePayload,
  deleteTemplate,
  fetchTemplates,
  savePlanificationAsTemplate,
  seedTemplatePresets,
} from '@/lib/api/planification-templates';
import { TemplateCategory } from '@/lib/plantillas/template-categories';

export function useTemplates(params?: {
  search?: string;
  categoria?: TemplateCategory | '';
}) {
  const search = params?.search;
  const categoria = params?.categoria || undefined;
  return useQuery({
    queryKey: ['planification-templates', search ?? '', categoria ?? ''],
    queryFn: () => fetchTemplates({ search, categoria, limit: 50 }),
  });
}

export function useCreateTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTemplatePayload) => createTemplate(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['planification-templates'] });
    },
  });
}

export function useSeedTemplatePresets() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => seedTemplatePresets(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['planification-templates'] });
    },
  });
}

export function useSaveAsTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      planificationId,
      ...payload
    }: {
      planificationId: string;
      nombrePlantilla: string;
      categoriaPlantilla?: TemplateCategory;
      descripcionPlantilla?: string;
    }) => savePlanificationAsTemplate(planificationId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['planification-templates'] });
    },
  });
}

export function useCloneTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      templateId,
      alumnoId,
      titulo,
    }: {
      templateId: string;
      alumnoId: string;
      titulo?: string;
    }) => cloneTemplateToClient(templateId, { alumnoId, titulo }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['planification-templates'] });
      qc.invalidateQueries({ queryKey: ['planifications'] });
    },
  });
}

export function useDeleteTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTemplate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['planification-templates'] });
    },
  });
}
