import { apiClient } from '@/lib/api/client';
import type {
  CreateStandardPlanPayload,
  StandardPlanTemplate,
  StandardPlanTemplatesList,
  StandardPlanTemplateStatus,
  UpdateStandardPlanPayload,
} from '@/types/standard-plan';
import type { PlanificationSection } from '@/types/planification';

export function fetchAdminStandardPlans(params?: {
  status?: StandardPlanTemplateStatus;
  search?: string;
  limit?: number;
}) {
  const qs = new URLSearchParams();
  if (params?.status) qs.set('status', params.status);
  if (params?.search?.trim()) qs.set('search', params.search.trim());
  if (params?.limit) qs.set('limit', String(params.limit));
  const query = qs.toString();
  return apiClient<StandardPlanTemplatesList>(
    `/admin/standard-plans${query ? `?${query}` : ''}`,
    { auth: true },
  );
}

export function fetchAdminStandardPlan(id: string) {
  return apiClient<StandardPlanTemplate>(`/admin/standard-plans/${id}`, {
    auth: true,
  });
}

export function createAdminStandardPlan(payload: CreateStandardPlanPayload) {
  return apiClient<StandardPlanTemplate>('/admin/standard-plans', {
    auth: true,
    method: 'POST',
    body: payload,
  });
}

export function updateAdminStandardPlan(
  id: string,
  payload: UpdateStandardPlanPayload,
) {
  return apiClient<StandardPlanTemplate>(`/admin/standard-plans/${id}`, {
    auth: true,
    method: 'PATCH',
    body: payload,
  });
}

export function upsertAdminStandardPlanSecciones(
  id: string,
  payload: {
    secciones: PlanificationSection[];
    expectedContentVersion?: number;
  },
) {
  return apiClient<StandardPlanTemplate>(
    `/admin/standard-plans/${id}/secciones`,
    {
      auth: true,
      method: 'PUT',
      body: payload,
    },
  );
}

export function publishAdminStandardPlan(id: string) {
  return apiClient<StandardPlanTemplate>(
    `/admin/standard-plans/${id}/publish`,
    { auth: true, method: 'POST' },
  );
}

export function archiveAdminStandardPlan(id: string) {
  return apiClient<StandardPlanTemplate>(
    `/admin/standard-plans/${id}/archive`,
    { auth: true, method: 'POST' },
  );
}

export function unarchiveAdminStandardPlan(id: string) {
  return apiClient<StandardPlanTemplate>(
    `/admin/standard-plans/${id}/unarchive`,
    { auth: true, method: 'POST' },
  );
}

export function seedFullbodyBeginnerStandardPlan(precioArs?: number) {
  return apiClient<{ created: boolean; template: StandardPlanTemplate }>(
    '/admin/standard-plans/seed-fullbody-beginner',
    {
      auth: true,
      method: 'POST',
      body: precioArs != null ? { precioArs } : {},
    },
  );
}

/** Catálogo público (Etapa 3). Sin auth. */
export type PublicStandardPlan = {
  id: string;
  slug: string;
  nombre: string;
  descripcion: string;
  imagenUrl?: string | null;
  objetivo: string;
  nivel: string;
  precioArs: number;
  config: {
    semanasDelPlan: number;
    frecuenciaSemanal: number;
    totalSesiones: number;
    modoProgresion: string;
  };
  publishedAt?: string | null;
};

export function fetchPublicStandardPlans() {
  return apiClient<{ items: PublicStandardPlan[]; total: number }>(
    '/standard-plans',
    { auth: false },
  );
}

export function fetchPublicStandardPlan(slug: string) {
  return apiClient<PublicStandardPlan>(`/standard-plans/${slug}`, {
    auth: false,
  });
}

export type PublicPlanSessionPreview = {
  numero: number;
  diaBase: number;
  semanaDelPlan: number;
  dayIndexInWeek: number;
  secciones?: Array<{
    tipoSeccion: string;
    titulo: string;
    items: Array<
      | {
          kind?: 'single';
          ejercicio: string;
          valor: string;
          gif?: string | null;
          tipoItem?: string;
          unidadTrabajo?: string;
        }
      | {
          kind: 'group';
          tipoGrupo: 'biserie' | 'triserie';
          items: Array<{
            ejercicio: string;
            valor: string;
            gif?: string | null;
            tipoItem?: string;
            unidadTrabajo?: string;
          }>;
        }
    >;
  }>;
};

export type PublicStandardPlanPreview = {
  slug: string;
  nombre: string;
  sessionPreview: PublicPlanSessionPreview | null;
};

export function fetchPublicStandardPlanPreview(slug: string) {
  return apiClient<PublicStandardPlanPreview>(
    `/standard-plans/${slug}/preview`,
    { auth: false },
  );
}
