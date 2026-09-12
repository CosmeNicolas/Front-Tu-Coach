import type { LimitesOverride, PlanCodigo } from '@/types/admin';

export interface TenantLimits {
  alumnos: number;
  planesActivos: number;
}

export interface TenantCupos {
  planCodigo: PlanCodigo;
  planEfectivo: PlanCodigo;
  limites: TenantLimits;
  uso: TenantLimits;
  disponibles: TenantLimits;
  limitesOverride: LimitesOverride | null;
}

export interface TenantSummary {
  id: string;
  nombre: string;
  slug: string;
  estado: string;
  tipo?: string;
  planCodigo?: PlanCodigo;
  trialEndsAt?: string | null;
  planVenceAt?: string | null;
  planComercialId: string | null;
  limitesOverride?: LimitesOverride | null;
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

export interface DashboardChartPoint {
  key: string;
  label: string;
  value: number;
}

export interface GymAlumnoActivity {
  id: string;
  nombre: string;
  apellido: string;
  email: string | null;
  estado: string;
  profesorId: string;
  profesorNombre: string;
  planActivoTitulo: string | null;
  sesionesCompletadas: number;
  ultimaActividadAt: string | null;
  ultimaActividadLabel: string;
}

export interface GymAdminResumen {
  totalProfesores: number;
  totalAlumnos: number;
  totalPlanificacionesActivas: number;
  alumnosActivos?: number;
  sesionesCompletadas?: number;
  ultimaActividad?: string;
}

export interface GymAdminDashboard {
  tenant: TenantSummary;
  cupos?: TenantCupos;
  resumen: GymAdminResumen;
  profesores: ProfesorSummary[];
  alumnos?: GymAlumnoActivity[];
  sesionesPorDia?: DashboardChartPoint[];
  planesPorDia?: DashboardChartPoint[];
}

export interface ProfesorAlumnosList {
  items: import('@/types/client').Client[];
  total: number;
}

export interface PlatformTenantRow {
  id: string;
  nombre: string;
  slug: string;
  estado: string;
  planCodigo?: PlanCodigo;
  planEfectivo?: PlanCodigo;
  trialEndsAt?: string | null;
  planVenceAt?: string | null;
  diasRestantes?: number | null;
  venceLabel?: string;
  cupos?: TenantCupos;
  limitesOverride: LimitesOverride | null;
  profesores: number;
  alumnos: number;
  planificacionesActivas: number;
  ultimaActividad: string;
  ultimaActividadAt: string | null;
}

export interface PlatformProfesorPlanRow {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  tenantId: string;
  tenantNombre: string | null;
  alumnos: number;
  planCodigo: PlanCodigo;
  planEfectivo: PlanCodigo;
  diasRestantes: number | null;
  venceLabel: string;
}

export interface PlatformOverview {
  resumen: {
    totalGimnasios: number;
    totalProfesores: number;
    totalAlumnos: number;
    totalPlanificacionesActivas: number;
    sesionesCompletadas: number;
    alumnosConActividad: number;
    ultimaActividad: string;
  };
  gimnasios: PlatformTenantRow[];
  profesores: PlatformProfesorPlanRow[];
  sesionesPorDia: DashboardChartPoint[];
  planesPorDia: DashboardChartPoint[];
}
