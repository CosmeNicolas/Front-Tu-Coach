import { apiClient } from '@/lib/api/client';
import { TemplateCategory } from '@/lib/plantillas/template-categories';
import { Planification, PlanificationConfig } from '@/types/planification';

export interface TemplateListResponse {
  items: Planification[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateTemplatePayload {
  nombrePlantilla: string;
  categoriaPlantilla: TemplateCategory;
  descripcionPlantilla?: string;
  config?: PlanificationConfig;
}

export function fetchTemplates(params?: {
  search?: string;
  categoria?: TemplateCategory;
  limit?: number;
}) {
  const qs = new URLSearchParams();
  if (params?.search) qs.set('search', params.search);
  if (params?.categoria) qs.set('categoria', params.categoria);
  if (params?.limit) qs.set('limit', String(params.limit));
  const query = qs.toString();
  return apiClient<TemplateListResponse>(
    `/templates${query ? `?${query}` : ''}`,
    { auth: true },
  );
}

export function fetchTemplate(id: string) {
  return apiClient<Planification>(`/templates/${id}`, {
    auth: true,
  });
}

export function createTemplate(payload: CreateTemplatePayload) {
  return apiClient<Planification>('/templates', {
    method: 'POST',
    body: payload,
    auth: true,
  });
}

export function seedTemplatePresets() {
  return apiClient<{ created: number; skipped: number }>(
    '/templates/seed-presets',
    { method: 'POST', auth: true },
  );
}

export function savePlanificationAsTemplate(
  planificationId: string,
  payload: {
    nombrePlantilla: string;
    categoriaPlantilla?: TemplateCategory;
    descripcionPlantilla?: string;
  },
) {
  return apiClient<Planification>(
    `/templates/from-planification/${planificationId}`,
    {
      method: 'POST',
      body: payload,
      auth: true,
    },
  );
}

export function cloneTemplateToClient(
  templateId: string,
  payload: { alumnoId: string; titulo?: string },
) {
  return apiClient<Planification>(
    `/templates/${templateId}/clone`,
    {
      method: 'POST',
      body: payload,
      auth: true,
    },
  );
}

export function deleteTemplate(id: string) {
  return apiClient<{ message: string }>(`/templates/${id}`, {
    method: 'DELETE',
    auth: true,
  });
}
