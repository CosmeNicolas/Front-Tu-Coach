import { parseExerciseParams } from '@/lib/alumno/parse-valor';
import { FlatExerciseRow } from '@/types/alumno-session';

/** Volumen = peso × series × reps (solo ejercicios de fuerza completados). */
export function calcExerciseVolumeKg(
  exercise: FlatExerciseRow,
  completed: boolean,
  pesoUsadoKg?: number | null,
): number {
  if (!completed) return 0;
  const parsed = parseExerciseParams(
    exercise.valor,
    exercise.tipoItem,
    exercise.unidadTrabajo,
    exercise.parametros,
  );
  const prescrito = parsed.pesoKg ? parseFloat(parsed.pesoKg) : 0;
  const usado =
    pesoUsadoKg != null && Number.isFinite(pesoUsadoKg) ? pesoUsadoKg : null;
  const peso = usado != null && usado > 0 ? usado : prescrito;
  const series = parsed.series ? parseInt(parsed.series, 10) : 0;
  const reps = parsed.reps ? parseInt(parsed.reps, 10) : 0;
  if (!Number.isFinite(peso) || !Number.isFinite(series) || !Number.isFinite(reps)) {
    return 0;
  }
  if (peso <= 0 || series <= 0 || reps <= 0) return 0;
  return Math.round(peso * series * reps * 10) / 10;
}

export function calcSessionVolumeKg(
  exercises: FlatExerciseRow[],
  completedById: Map<string, boolean>,
  pesoUsadoById?: Map<string, number | null>,
): number {
  let total = 0;
  for (const ex of exercises) {
    total += calcExerciseVolumeKg(
      ex,
      completedById.get(ex.exerciseId) ?? false,
      pesoUsadoById?.get(ex.exerciseId),
    );
  }
  return Math.round(total * 10) / 10;
}
