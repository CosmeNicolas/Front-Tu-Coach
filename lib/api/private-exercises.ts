import { API_BASE_URL } from '@/lib/auth/constants';
import { getAccessToken } from '@/lib/auth/token-store';
import { apiClient, ApiError } from '@/lib/api/client';
import {
  CreatePrivateExercisePayload,
  PaginatedPrivateExercises,
  PrivateExercise,
  UpdatePrivateExercisePayload,
  UploadMediaResponse,
  WizardPrivateCatalogResponse,
} from '@/types/private-exercise';

export interface QueryPrivateExercisesParams {
  search?: string;
  categoria?: string;
  tenantId?: string;
  profesorId?: string;
  page?: number;
  limit?: number;
  includeInactive?: boolean;
}

function buildQuery(params?: QueryPrivateExercisesParams): string {
  if (!params) return '';
  const q = new URLSearchParams();
  if (params.search?.trim()) q.set('search', params.search.trim());
  if (params.categoria?.trim()) q.set('categoria', params.categoria.trim());
  if (params.tenantId) q.set('tenantId', params.tenantId);
  if (params.profesorId) q.set('profesorId', params.profesorId);
  if (params.page) q.set('page', String(params.page));
  if (params.limit) q.set('limit', String(params.limit));
  if (params.includeInactive) q.set('includeInactive', 'true');
  const qs = q.toString();
  return qs ? `?${qs}` : '';
}

export function fetchPrivateExercises(params?: QueryPrivateExercisesParams) {
  return apiClient<PaginatedPrivateExercises>(
    `/private-exercises${buildQuery(params)}`,
    { auth: true },
  );
}

export function fetchPrivateExerciseWizardCatalog() {
  return apiClient<WizardPrivateCatalogResponse>('/private-exercises/wizard', {
    auth: true,
  });
}

export function fetchPrivateExercise(id: string) {
  return apiClient<PrivateExercise>(`/private-exercises/${id}`, { auth: true });
}

export function createPrivateExercise(payload: CreatePrivateExercisePayload) {
  return apiClient<PrivateExercise>('/private-exercises', {
    method: 'POST',
    body: payload,
    auth: true,
  });
}

export function updatePrivateExercise(
  id: string,
  payload: UpdatePrivateExercisePayload,
) {
  return apiClient<PrivateExercise>(`/private-exercises/${id}`, {
    method: 'PATCH',
    body: payload,
    auth: true,
  });
}

export function deletePrivateExercise(id: string) {
  return apiClient<{ message: string }>(`/private-exercises/${id}`, {
    method: 'DELETE',
    auth: true,
  });
}

export async function uploadPrivateExerciseMedia(
  file: File,
  ejercicioId?: string,
): Promise<UploadMediaResponse> {
  const form = new FormData();
  form.append('media', file);
  if (ejercicioId) form.append('ejercicioId', ejercicioId);

  const token = getAccessToken();
  const headers: HeadersInit = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}/private-exercises/upload`, {
    method: 'POST',
    headers,
    body: form,
  });

  if (!response.ok) {
    let message = 'Error al subir media';
    try {
      const body = await response.json();
      const raw = body.message;
      message = Array.isArray(raw) ? raw.join(', ') : (raw ?? message);
    } catch {
      // ignore
    }
    throw new ApiError(message, response.status);
  }

  return response.json() as Promise<UploadMediaResponse>;
}
