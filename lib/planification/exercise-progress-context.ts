import {
  MaterializedItem,
  MaterializedPlanification,
  MaterializedSession,
  PlanificationProgress,
} from '@/types/planification';
import { formatProgressDate } from '@/lib/planification/progress-stats';

export interface ExerciseAlumnoContext {
  sessionNum: number;
  fechaLabel: string | null;
  valor: string | null;
  completed: boolean;
  alumnoNote: string | null;
  sessionRpe: number | null;
}

function normName(value: string): string {
  return value.trim().toLowerCase();
}

function flattenMaterializedItems(session: MaterializedSession): MaterializedItem[] {
  const out: MaterializedItem[] = [];
  for (const sec of session.secciones) {
    for (const entry of sec.items) {
      if ('kind' in entry && entry.kind === 'group') {
        out.push(...entry.items);
      } else {
        out.push(entry as MaterializedItem);
      }
    }
  }
  return out;
}

function findMaterializedItem(
  materialized: MaterializedPlanification,
  sessionNum: number,
  itemId: string,
  itemName: string,
): MaterializedItem | null {
  const session = materialized.sesiones.find((s) => s.numero === sessionNum);
  if (!session) return null;

  const items = flattenMaterializedItems(session);
  return (
    items.find((i) => i.itemId === itemId) ??
    items.find((i) => normName(i.ejercicio) === normName(itemName)) ??
    null
  );
}

export function getLastExerciseAlumnoContext(
  progress: PlanificationProgress | undefined,
  materialized: MaterializedPlanification | undefined,
  item: { id: string; ejercicio: string },
  options?: { beforeSession?: number },
): ExerciseAlumnoContext | null {
  if (!progress?.completadas?.length) return null;

  const detalle = progress.detallePorSesion ?? {};
  const fechas = progress.fechas ?? [];
  const beforeSession = options?.beforeSession;

  const sorted = [...progress.completadas]
    .filter((n) => (beforeSession ? n < beforeSession : true))
    .sort((a, b) => b - a);

  for (const sessionNum of sorted) {
    const det = detalle[String(sessionNum)];
    if (!det?.exercises?.length) continue;

    const logEx =
      det.exercises.find((e) => e.exerciseId === item.id) ??
      det.exercises.find((e) => normName(e.name) === normName(item.ejercicio));

    if (!logEx) continue;

    const matItem = materialized
      ? findMaterializedItem(materialized, sessionNum, item.id, item.ejercicio)
      : null;

    const rpeRaw = det.rpe?.value ?? progress.rpePorSesion?.[String(sessionNum)];
    const sessionRpe =
      typeof rpeRaw === 'number' && rpeRaw >= 1 && rpeRaw <= 10 ? rpeRaw : null;

    const fechaRaw = fechas[sessionNum - 1]?.trim() || null;

    return {
      sessionNum,
      fechaLabel: fechaRaw ? formatProgressDate(fechaRaw) : null,
      valor: matItem?.valor ?? null,
      completed: logEx.completed,
      alumnoNote: logEx.note?.trim() || null,
      sessionRpe,
    };
  }

  return null;
}

export function sessionHasExerciseNotes(
  progress: PlanificationProgress | undefined,
  sessionNum: number,
): boolean {
  const det = progress?.detallePorSesion?.[String(sessionNum)];
  return Boolean(det?.exercises?.some((e) => e.note?.trim()));
}
