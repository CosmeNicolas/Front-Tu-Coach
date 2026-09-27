import { apiClient, ApiError } from '@/lib/api/client';
import { API_BASE_URL } from '@/lib/auth/constants';
import { getAccessToken } from '@/lib/auth/token-store';

export type ProfessorPublicProfile = {
  id: string;
  slug: string;
  displayName: string;
  fotoUrl: string | null;
  bio: string;
  especialidades: string[];
  deportes: string[];
  modalidadOnline: boolean;
  modalidadPresencial: boolean;
  ubicacion: string | null;
  redes: { instagram: string | null; website: string | null };
  visibleEnCatalogo: boolean;
  catalogHiddenByAdmin: boolean;
  publishedAt: string | null;
  canPublish: boolean;
  planEfectivo: string;
};

export type UpdateProfessorPublicProfilePayload = {
  bio?: string;
  fotoUrl?: string | null;
  especialidades?: string[];
  deportes?: string[];
  modalidadOnline?: boolean;
  modalidadPresencial?: boolean;
  ubicacion?: string | null;
  redes?: { instagram?: string | null; website?: string | null };
  slug?: string;
};

export function fetchMyPublicProfile() {
  return apiClient<ProfessorPublicProfile>('/profesor/perfil-publico', {
    auth: true,
  });
}

export function updateMyPublicProfile(
  payload: UpdateProfessorPublicProfilePayload,
) {
  return apiClient<ProfessorPublicProfile>('/profesor/perfil-publico', {
    method: 'PATCH',
    auth: true,
    body: payload,
  });
}

export async function uploadProfessorFoto(
  file: File,
): Promise<ProfessorPublicProfile> {
  const form = new FormData();
  form.append('media', file);
  const token = getAccessToken();
  const headers: HeadersInit = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(
    `${API_BASE_URL}/profesor/perfil-publico/upload-foto`,
    {
      method: 'POST',
      headers,
      body: form,
    },
  );

  if (!response.ok) {
    let message = 'Error al subir la foto';
    try {
      const body = await response.json();
      const raw = body.message;
      message = Array.isArray(raw) ? raw.join(', ') : (raw ?? message);
    } catch {
      // ignore
    }
    throw new ApiError(message, response.status);
  }

  return response.json() as Promise<ProfessorPublicProfile>;
}

export function publishMyPublicProfile() {
  return apiClient<ProfessorPublicProfile>(
    '/profesor/perfil-publico/publish',
    { method: 'POST', auth: true },
  );
}

export function unpublishMyPublicProfile() {
  return apiClient<ProfessorPublicProfile>(
    '/profesor/perfil-publico/unpublish',
    { method: 'POST', auth: true },
  );
}

export function adminHideProfessorCatalog(userId: string) {
  return apiClient(`/admin/professor-catalog/profesores/${userId}/hide`, {
    method: 'POST',
    auth: true,
  });
}

export function adminUnhideProfessorCatalog(userId: string) {
  return apiClient(`/admin/professor-catalog/profesores/${userId}/unhide`, {
    method: 'POST',
    auth: true,
  });
}

export function adminBackfillProfessorCatalog() {
  return apiClient<{ created: number; skipped: number; total: number }>(
    '/admin/professor-catalog/backfill',
    { method: 'POST', auth: true },
  );
}

/** Catálogo público (Etapa 7). Sin auth. */
export type PublicProfessor = {
  id: string;
  slug: string;
  displayName: string;
  fotoUrl: string | null;
  bio: string;
  especialidades: string[];
  deportes: string[];
  modalidadOnline: boolean;
  modalidadPresencial: boolean;
  ubicacion: string | null;
  redes: { instagram: string | null; website: string | null };
  publishedAt: string | null;
};

export type PublicProfessorsList = {
  items: PublicProfessor[];
  total: number;
};

export function fetchPublicProfessors() {
  return apiClient<PublicProfessorsList>('/profesores', { auth: false });
}

export function fetchPublicProfessor(slug: string) {
  return apiClient<PublicProfessor>(
    `/profesores/${encodeURIComponent(slug)}`,
    { auth: false },
  );
}

export const PROFESSOR_FALLBACK_PHOTO = '/branding/zorroDer.png';

export function professorPhotoSrc(fotoUrl?: string | null) {
  return fotoUrl?.trim() || PROFESSOR_FALLBACK_PHOTO;
}
