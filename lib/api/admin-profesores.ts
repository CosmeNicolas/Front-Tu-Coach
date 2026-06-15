import { apiClient } from '@/lib/api/client';
import {
  CreateProfesorPayload,
  ProfesorAdmin,
  ProfesoresAdminList,
  QueryProfesoresParams,
  UpdateProfesorPayload,
} from '@/types/admin';

export function fetchAdminProfesores(params?: QueryProfesoresParams) {
  const qs = new URLSearchParams();
  if (params?.tenantId) qs.set('tenantId', params.tenantId);
  if (params?.search?.trim()) qs.set('search', params.search.trim());
  if (params?.limit) qs.set('limit', String(params.limit));
  const query = qs.toString();
  return apiClient<ProfesoresAdminList>(
    `/admin/profesores${query ? `?${query}` : ''}`,
    { auth: true },
  );
}

export function fetchAdminProfesor(id: string) {
  return apiClient<ProfesorAdmin>(`/admin/profesores/${id}`, { auth: true });
}

export function createAdminProfesor(payload: CreateProfesorPayload) {
  return apiClient<ProfesorAdmin>('/admin/profesores', {
    auth: true,
    method: 'POST',
    body: payload,
  });
}

export function updateAdminProfesor(id: string, payload: UpdateProfesorPayload) {
  return apiClient<ProfesorAdmin>(`/admin/profesores/${id}`, {
    auth: true,
    method: 'PATCH',
    body: payload,
  });
}
