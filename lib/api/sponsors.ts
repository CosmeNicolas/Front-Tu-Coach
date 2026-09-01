import { apiClient, ApiError } from '@/lib/api/client';
import { API_BASE_URL } from '@/lib/auth/constants';
import { getAccessToken } from '@/lib/auth/token-store';
import {
  CreateSponsorPayload,
  Sponsor,
  SponsorList,
  UpdateSponsorPayload,
} from '@/types/sponsor';

export function fetchPublicSponsors() {
  return apiClient<SponsorList>('/sponsors', { auth: true });
}

export function fetchAdminSponsors() {
  return apiClient<SponsorList>('/sponsors/admin', { auth: true });
}

export function createSponsor(payload: CreateSponsorPayload) {
  return apiClient<Sponsor>('/sponsors', {
    method: 'POST',
    body: payload,
    auth: true,
  });
}

export function updateSponsor(id: string, payload: UpdateSponsorPayload) {
  return apiClient<Sponsor>(`/sponsors/${id}`, {
    method: 'PATCH',
    body: payload,
    auth: true,
  });
}

export function deleteSponsor(id: string) {
  return apiClient<{ message: string }>(`/sponsors/${id}`, {
    method: 'DELETE',
    auth: true,
  });
}

export async function uploadSponsorImage(file: File): Promise<{ url: string }> {
  const form = new FormData();
  form.append('media', file);
  const token = getAccessToken();
  const headers: HeadersInit = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}/sponsors/upload`, {
    method: 'POST',
    headers,
    body: form,
  });

  if (!response.ok) {
    let message = 'Error al subir la imagen';
    try {
      const body = await response.json();
      const raw = body.message;
      message = Array.isArray(raw) ? raw.join(', ') : (raw ?? message);
    } catch {
      // ignore
    }
    throw new ApiError(message, response.status);
  }

  return response.json() as Promise<{ url: string }>;
}
