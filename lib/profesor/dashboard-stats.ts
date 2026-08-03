import { Client, ClientStatus } from '@/types/client';
import {
  Planification,
  PlanificationStatus,
} from '@/types/planification';

export interface DashboardChartPoint {
  label: string;
  value: number;
  key: string;
}

export interface ProfesorDashboardStats {
  totalAlumnos: number;
  alumnosActivos: number;
  alumnosInactivos: number;
  totalPlanes: number;
  planesActivos: number;
  alumnosConPlan: number;
  alumnosSinPlan: number;
  sesionesCompletadas: number;
  promedioEdad: string;
  ultimaActividad: string;
  sesionesPorDia: DashboardChartPoint[];
  planesPorDia: DashboardChartPoint[];
}

function dayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDayLabel(key: string): string {
  const [y, m, d] = key.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('es-AR', { day: '2-digit', month: 'numeric' });
}

function lastNDayKeys(n: number): string[] {
  const keys: string[] = [];
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    keys.push(dayKey(d));
  }
  return keys;
}

function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function buildSeries(
  keys: string[],
  counts: Map<string, number>,
): DashboardChartPoint[] {
  return keys.map((key) => ({
    key,
    label: formatDayLabel(key),
    value: counts.get(key) ?? 0,
  }));
}

export function buildProfesorDashboardStats(
  clients: Client[],
  planifications: Planification[],
  days = 14,
): ProfesorDashboardStats {
  const alumnosActivos = clients.filter((c) => c.estado === ClientStatus.ACTIVE).length;
  const alumnosInactivos = clients.length - alumnosActivos;

  const planes = planifications.filter((p) => !p.esPlantilla);
  const planesActivos = planes.filter(
    (p) => p.estado === PlanificationStatus.ACTIVE,
  ).length;

  const alumnosConPlanIds = new Set(
    planes
      .filter((p) => p.estado === PlanificationStatus.ACTIVE && p.alumnoId)
      .map((p) => p.alumnoId as string),
  );
  const alumnosConPlan = clients.filter((c) => alumnosConPlanIds.has(c.id)).length;
  const alumnosSinPlan = Math.max(0, clients.length - alumnosConPlan);

  const edades = clients
    .map((c) => c.datos?.edad)
    .filter((e): e is number => typeof e === 'number' && e > 0);
  const promedioEdad =
    edades.length > 0
      ? (edades.reduce((a, b) => a + b, 0) / edades.length).toFixed(1)
      : '—';

  let sesionesCompletadas = 0;
  for (const p of planes) {
    sesionesCompletadas += p.progresoAlumno?.completadas?.length ?? 0;
  }

  const dates: Date[] = [];
  for (const c of clients) {
    const d = parseDate(c.updatedAt);
    if (d) dates.push(d);
  }
  for (const p of planes) {
    const d = parseDate(p.updatedAt);
    if (d) dates.push(d);
  }
  const ultimaActividad =
    dates.length > 0
      ? new Date(Math.max(...dates.map((d) => d.getTime()))).toLocaleString(
          'es-AR',
          {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          },
        )
      : '—';

  const dayKeys = lastNDayKeys(days);
  const sesionesCounts = new Map<string, number>();
  const planesCounts = new Map<string, number>();

  for (const p of planes) {
    const fechas = p.progresoAlumno?.fechas ?? [];
    for (const f of fechas) {
      const d = parseDate(f);
      if (!d) continue;
      const key = dayKey(d);
      sesionesCounts.set(key, (sesionesCounts.get(key) ?? 0) + 1);
    }

    const created = parseDate(p.createdAt);
    if (created) {
      const key = dayKey(created);
      planesCounts.set(key, (planesCounts.get(key) ?? 0) + 1);
    }
  }

  return {
    totalAlumnos: clients.length,
    alumnosActivos,
    alumnosInactivos,
    totalPlanes: planes.length,
    planesActivos,
    alumnosConPlan,
    alumnosSinPlan,
    sesionesCompletadas,
    promedioEdad,
    ultimaActividad,
    sesionesPorDia: buildSeries(dayKeys, sesionesCounts),
    planesPorDia: buildSeries(dayKeys, planesCounts),
  };
}

export interface AlumnoDashboardRow {
  id: string;
  nombre: string;
  apellido: string;
  email: string | null;
  estado: ClientStatus;
  planActivoTitulo: string | null;
  sesionesCompletadas: number;
  /** ISO date of last completed session in the portal, if any */
  ultimaActividadAt: string | null;
  ultimaActividadLabel: string;
}

function formatDateTime(iso: string): string {
  const d = parseDate(iso);
  if (!d) return '—';
  return d.toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function lastActivityFromPlans(plansForAlumno: Planification[]): {
  at: string | null;
  sesiones: number;
  planActivoTitulo: string | null;
} {
  let latestMs = -1;
  let latestIso: string | null = null;
  let sesiones = 0;
  let planActivoTitulo: string | null = null;

  for (const p of plansForAlumno) {
    if (p.estado === PlanificationStatus.ACTIVE && !planActivoTitulo) {
      planActivoTitulo = p.titulo;
    }
    const fechas = p.progresoAlumno?.fechas ?? [];
    sesiones += p.progresoAlumno?.completadas?.length ?? 0;
    for (const f of fechas) {
      if (!f?.trim()) continue;
      const d = parseDate(f);
      if (!d) continue;
      const ms = d.getTime();
      if (ms > latestMs) {
        latestMs = ms;
        latestIso = d.toISOString();
      }
    }
  }

  return { at: latestIso, sesiones, planActivoTitulo };
}

export function buildAlumnoDashboardRows(
  clients: Client[],
  planifications: Planification[],
): AlumnoDashboardRow[] {
  const planes = planifications.filter((p) => !p.esPlantilla);
  const byAlumno = new Map<string, Planification[]>();

  for (const p of planes) {
    if (!p.alumnoId) continue;
    const list = byAlumno.get(p.alumnoId) ?? [];
    list.push(p);
    byAlumno.set(p.alumnoId, list);
  }

  const rows = clients.map((c) => {
    const activity = lastActivityFromPlans(byAlumno.get(c.id) ?? []);
    return {
      id: c.id,
      nombre: c.nombre,
      apellido: c.apellido,
      email: c.email,
      estado: c.estado,
      planActivoTitulo: activity.planActivoTitulo,
      sesionesCompletadas: activity.sesiones,
      ultimaActividadAt: activity.at,
      ultimaActividadLabel: activity.at
        ? formatDateTime(activity.at)
        : 'Sin actividad',
    };
  });

  return rows.sort((a, b) => {
    const aMs = a.ultimaActividadAt
      ? new Date(a.ultimaActividadAt).getTime()
      : -1;
    const bMs = b.ultimaActividadAt
      ? new Date(b.ultimaActividadAt).getTime()
      : -1;
    return bMs - aMs;
  });
}
