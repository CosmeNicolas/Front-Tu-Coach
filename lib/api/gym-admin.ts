import { apiClient } from '@/lib/api/client';
import {
  GymAdminDashboard,
  PlatformOverview,
  ProfesorAlumnosList,
  ProfesorSummary,
} from '@/types/gym-admin';

function withTenant(tenantId?: string) {
  return tenantId ? `?tenantId=${encodeURIComponent(tenantId)}` : '';
}

export interface CreateGymProfesorPayload {
  email: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  password?: string;
  tenantId?: string;
}

export interface GymProfesorCreated {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  estado: string;
  alumnosCount: number;
  planificacionesActivas: number;
}

export function fetchGymDashboard(tenantId?: string) {
  return apiClient<GymAdminDashboard>(`/gym-admin/dashboard${withTenant(tenantId)}`, {
    auth: true,
  });
}

/** Solo super_admin — resumen multi-tenant */
export function fetchPlatformOverview() {
  return apiClient<PlatformOverview>('/gym-admin/platform-overview', {
    auth: true,
  });
}

export function fetchProfesorDetail(profesorId: string, tenantId?: string) {
  return apiClient<ProfesorSummary & { createdAt: string }>(
    `/gym-admin/profesores/${profesorId}${withTenant(tenantId)}`,
    { auth: true },
  );
}

export function fetchProfesorAlumnos(profesorId: string, tenantId?: string) {
  return apiClient<ProfesorAlumnosList>(
    `/gym-admin/profesores/${profesorId}/alumnos${withTenant(tenantId)}`,
    { auth: true },
  );
}

export function createGymProfesor(
  payload: CreateGymProfesorPayload,
  tenantId?: string,
) {
  return apiClient<GymProfesorCreated>(
    `/gym-admin/profesores${withTenant(tenantId ?? payload.tenantId)}`,
    {
      method: 'POST',
      auth: true,
      body: JSON.stringify(payload),
    },
  );
}
