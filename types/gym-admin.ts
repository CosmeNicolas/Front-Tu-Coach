export interface TenantSummary {
  id: string;
  nombre: string;
  slug: string;
  estado: string;
  planComercialId: string | null;
}

export interface ProfesorSummary {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  estado: string;
  alumnosCount: number;
  planificacionesActivas: number;
}

export interface GymAdminResumen {
  totalProfesores: number;
  totalAlumnos: number;
  totalPlanificacionesActivas: number;
}

export interface GymAdminDashboard {
  tenant: TenantSummary;
  resumen: GymAdminResumen;
  profesores: ProfesorSummary[];
}

export interface ProfesorAlumnosList {
  items: import('@/types/client').Client[];
  total: number;
}
