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
  profesores: number;
  alumnos: number;
  planificacionesActivas: number;
  ultimaActividad: string;
  ultimaActividadAt: string | null;
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
  sesionesPorDia: DashboardChartPoint[];
  planesPorDia: DashboardChartPoint[];
}
