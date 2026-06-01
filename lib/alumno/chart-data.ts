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

export function buildWeeklyCompletions(
  fechas: string[],
  completadas: number[],
): ChartPoint[] {
  const buckets = new Map<string, { label: string; value: number; sort: string }>();

  for (const n of completadas) {
    const fecha = fechas[n - 1];
    if (!fecha?.trim()) continue;
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
