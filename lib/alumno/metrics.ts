import { Planification, PlanificationProgress } from '@/types/planification';
import { StudentProgressSummary } from '@/lib/api/student-portal';
import {
  ExerciseExecutionState,
  FlatExerciseRow,
  SessionExecutionLog,
  StudentProgressExtended,
} from '@/types/alumno-session';

export interface AlumnoDashboardMetrics {
  completadas: number;
  total: number;
  pendientes: number;
  adherenciaPct: number;
  rpePromedio: number | null;
  ultimoRpe: number | null;
  ultimaSesion: number | null;
  ultimaFecha: string | null;
  ejerciciosCompletadosTotal: number;
  streakSimple: number;
}

function asExtended(
  progress: PlanificationProgress | StudentProgressExtended,
): StudentProgressExtended {
  return {
    completadas: progress.completadas ?? [],
    fechas: progress.fechas ?? [],
    rpePorSesion: progress.rpePorSesion ?? {},
    comentarios: progress.comentarios ?? [],
    detallePorSesion:
      'detallePorSesion' in progress && progress.detallePorSesion
        ? progress.detallePorSesion
        : {},
  };
}

export function buildAlumnoMetrics(
  plan: {
    config: Pick<Planification['config'], 'totalSesiones'>;
    progresoAlumno: Planification['progresoAlumno'] | StudentProgressExtended;
  },
  resumen?: StudentProgressSummary,
): AlumnoDashboardMetrics {
  const progress = asExtended(plan.progresoAlumno);
  const total = plan.config.totalSesiones;
  const completadas = resumen?.completadas ?? progress.completadas.length;
  const adherenciaPct =
    resumen?.porcentaje ??
    (total > 0 ? Math.round((completadas / total) * 100) : 0);

  const rpeValues = Object.values(progress.rpePorSesion).filter(
    (v) => typeof v === 'number' && v >= 1 && v <= 10,
  ) as number[];

  let ultimaSesion: number | null = null;
  let ultimaFecha: string | null = null;
  for (const n of [...progress.completadas].sort((a, b) => b - a)) {
    const fecha = progress.fechas[n - 1];
    if (fecha?.trim()) {
      ultimaSesion = n;
      ultimaFecha = fecha;
      break;
    }
  }

  let ejerciciosCompletadosTotal = 0;
  for (const det of Object.values(progress.detallePorSesion)) {
    ejerciciosCompletadosTotal += (det.exercises ?? []).filter(
      (e) => e.completed,
    ).length;
  }

  let streakSimple = 0;
  for (let n = 1; n <= total; n += 1) {
    if (progress.completadas.includes(n)) streakSimple += 1;
    else break;
  }

  return {
    completadas,
    total,
    pendientes: total - completadas,
    adherenciaPct,
    rpePromedio:
      rpeValues.length > 0
        ? Math.round(
            (rpeValues.reduce((a, b) => a + b, 0) / rpeValues.length) * 10,
          ) / 10
        : null,
    ultimoRpe: ultimaSesion
      ? progress.rpePorSesion[String(ultimaSesion)] ?? null
      : null,
    ultimaSesion,
    ultimaFecha,
    ejerciciosCompletadosTotal,
    streakSimple,
  };
}

export function getSessionLog(
  progress: StudentProgressExtended,
  sessionNum: number,
): SessionExecutionLog | undefined {
  return progress.detallePorSesion[String(sessionNum)];
}

export function initExerciseStateFromLog(
  exercises: FlatExerciseRow[],
  log?: SessionExecutionLog,
): ExerciseExecutionState[] {
  const byId = new Map(
    (log?.exercises ?? []).map((e) => [e.exerciseId, e]),
  );
  return exercises.map((ex) => {
    const saved = byId.get(ex.exerciseId);
    return {
      exerciseId: ex.exerciseId,
      name: ex.name,
      completed: saved?.completed ?? false,
      note: saved?.note ?? '',
    };
  });
}
