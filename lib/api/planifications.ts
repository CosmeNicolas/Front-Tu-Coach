import { apiClient } from '@/lib/api/client';
import {
  CreateItemAdjustmentPayload,
  CreateItemAdjustmentResult,
  CreatePlanificationPayload,
  MaterializedPlanification,
  PaginatedPlanifications,
  Planification,
  PlanificationAdjustmentRecord,
  SetCalentamientoPayload,
  SetVueltaCalmaPayload,
  UpdatePlanificationPayload,
  UpsertSeccionesPayload,
} from '@/types/planification';

export function fetchPlanifications(params?: {
  alumnoId?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const query = new URLSearchParams();
  if (params?.alumnoId) query.set('alumnoId', params.alumnoId);
  if (params?.search) query.set('search', params.search);
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  const qs = query.toString();
  return apiClient<PaginatedPlanifications>(
    `/planifications${qs ? `?${qs}` : ''}`,
    { auth: true },
  );
}

export function fetchPlanification(id: string) {
  return apiClient<Planification>(`/planifications/${id}`, { auth: true });
}

export function createPlanification(payload: CreatePlanificationPayload) {
  return apiClient<Planification>('/planifications', {
    method: 'POST',
    body: payload,
    auth: true,
  });
}

export function updatePlanification(
  id: string,
  payload: UpdatePlanificationPayload,
) {
  return apiClient<Planification>(`/planifications/${id}`, {
    method: 'PATCH',
    body: payload,
    auth: true,
  });
}

export function archivePlanification(id: string) {
  return apiClient<Planification>(`/planifications/${id}/archivar`, {
    method: 'PATCH',
    auth: true,
  });
}

export function deletePlanification(id: string) {
  return apiClient<{ message: string }>(`/planifications/${id}`, {
    method: 'DELETE',
    auth: true,
  });
}

export function upsertSecciones(id: string, payload: UpsertSeccionesPayload) {
  return apiClient<Planification>(`/planifications/${id}/secciones`, {
    method: 'PUT',
    body: payload,
    auth: true,
  });
}

export function setCalentamiento(id: string, payload: SetCalentamientoPayload) {
  return apiClient<Planification>(
    `/planifications/${id}/secciones/calentamiento`,
    {
      method: 'POST',
      body: payload,
      auth: true,
    },
  );
}

export function setVueltaCalma(id: string, payload: SetVueltaCalmaPayload) {
  return apiClient<Planification>(
    `/planifications/${id}/secciones/vuelta-calma`,
    {
      method: 'POST',
      body: payload,
      auth: true,
    },
  );
}

export function fetchMaterialized(id: string) {
  return apiClient<MaterializedPlanification>(
    `/planifications/${id}/materialized`,
    { auth: true },
  );
}

export function createItemAdjustment(
  planificationId: string,
  itemId: string,
  payload: CreateItemAdjustmentPayload,
) {
  return apiClient<CreateItemAdjustmentResult>(
    `/planifications/${planificationId}/items/${itemId}/adjustments`,
    { method: 'POST', body: payload, auth: true },
  );
}

export function fetchPlanificationAdjustments(planificationId: string) {
  return apiClient<{ items: PlanificationAdjustmentRecord[] }>(
    `/planifications/${planificationId}/adjustments`,
    { auth: true },
  );
}
