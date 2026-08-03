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
