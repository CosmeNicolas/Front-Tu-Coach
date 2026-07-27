import { countSessionExercises } from '@/lib/alumno/flatten-materialized';
import { StudentMaterializedPlanification } from '@/lib/api/student-portal';
import { StudentProgressExtended } from '@/types/alumno-session';

export interface ChartPoint {
  label: string;
  value: number;
}

function mondayKey(d: Date): string {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  const day = copy.getDay();
  const diff = copy.getDate() - day + (day === 0 ? -6 : 1);
  copy.setDate(diff);
  return copy.toISOString().slice(0, 10);
}

function formatWeekLabel(isoMonday: string): string {
  const d = new Date(isoMonday);
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' });
}

function formatMonthLabel(yearMonth: string): string {
  const [year, month] = yearMonth.split('-');
  const d = new Date(Number(year), Number(month) - 1, 1);
  return d.toLocaleDateString('es-AR', { month: 'short', year: '2-digit' });
}

function monthKey(isoDate: string): string | null {
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

function bucketDatesByMonth(fechas: string[]): ChartPoint[] {
  const buckets = new Map<string, { label: string; value: number; sort: string }>();

  for (const fecha of fechas) {
    if (!fecha?.trim()) continue;
    const key = monthKey(fecha);
    if (!key) continue;
    const existing = buckets.get(key);
    if (existing) {
      existing.value += 1;
    } else {
      buckets.set(key, {
        label: formatMonthLabel(key),
        value: 1,
        sort: key,
      });
    }
  }

  return [...buckets.values()]
    .sort((a, b) => a.sort.localeCompare(b.sort))
    .slice(-12)
    .map(({ label, value }) => ({ label, value }));
}

export function buildWeeklyCompletions(
  fechas: string[],
  completadas: number[],
): ChartPoint[] {
  const dates = completadas
    .map((n) => fechas[n - 1])
    .filter((f): f is string => Boolean(f?.trim()));
  return bucketDatesByWeek(dates);
}

function bucketDatesByWeek(fechas: string[]): ChartPoint[] {
  const buckets = new Map<string, { label: string; value: number; sort: string }>();

  for (const fecha of fechas) {
    const d = new Date(fecha);
    if (Number.isNaN(d.getTime())) continue;
    const key = mondayKey(d);
    const existing = buckets.get(key);
    if (existing) {
      existing.value += 1;
    } else {
      buckets.set(key, {
        label: formatWeekLabel(key),
        value: 1,
        sort: key,
      });
    }
  }

  return [...buckets.values()]
    .sort((a, b) => a.sort.localeCompare(b.sort))
    .slice(-8)
    .map(({ label, value }) => ({ label, value }));
}

export function buildMonthlyCompletions(
  fechas: string[],
  completadas: number[],
): ChartPoint[] {
  const dates = completadas
    .map((n) => fechas[n - 1])
    .filter((f): f is string => Boolean(f?.trim()));
  return bucketDatesByMonth(dates);
}

export function buildAggregateMonthlyCompletions(
  items: Array<{ fechasCompletadas: string[] }>,
): ChartPoint[] {
  const allDates = items.flatMap((item) => item.fechasCompletadas ?? []);
  return bucketDatesByMonth(allDates);
}

export function buildRpePerSession(
  progress: StudentProgressExtended,
  totalSesiones: number,
): ChartPoint[] {
  const points: ChartPoint[] = [];
  for (let n = 1; n <= totalSesiones; n += 1) {
    const key = String(n);
    const det = progress.detallePorSesion[key];
    const raw = det?.rpe?.value ?? progress.rpePorSesion[key];
    if (typeof raw === 'number' && raw >= 1 && raw <= 10) {
      points.push({ label: `S${n}`, value: raw });
    }
  }
  return points;
}

export function buildExercisesPerSession(
  materialized: StudentMaterializedPlanification,
): ChartPoint[] {
  const { progreso, sesiones } = materialized;
  const points: ChartPoint[] = [];

  for (const sesion of sesiones) {
    const n = sesion.numero;
    const assigned = countSessionExercises(sesion);
    if (assigned === 0) continue;
    const det = progreso.detallePorSesion[String(n)];
    const completed =
      det?.exercises?.filter((e) => e.completed).length ??
      (progreso.completadas.includes(n) ? assigned : 0);
    points.push({
      label: `S${n}`,
      value: Math.min(completed, assigned),
    });
  }

  return points;
}

export function countAssignedExercises(
  materialized: StudentMaterializedPlanification,
): number {
  return materialized.sesiones.reduce(
    (acc, s) => acc + countSessionExercises(s),
    0,
  );
}
