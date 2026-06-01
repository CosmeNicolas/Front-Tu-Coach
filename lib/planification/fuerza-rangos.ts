import { ParametrosItem } from '@/types/planification';
import { PLANIFICATION_LIMITS } from '@/types/planification-limits';

const f = PLANIFICATION_LIMITS.fuerza;

/** Rangos por defecto estilo CEMD: series+1, reps+4. */
export function rangosProgresionDefecto(series: number, reps: number): Pick<ParametrosItem, 'seriesMax' | 'repsMax'> {
  return {
    seriesMax: Math.min(series + 1, f.series.max),
    repsMax: Math.min(reps + 4, f.reps.max),
  };
}

/** Tras cambiar series o reps iniciales, asegura que los topes no queden por debajo. */
export function ajustarRangosTrasCambioMin(
  parametros: ParametrosItem,
  campo: 'series' | 'reps',
  valor: number,
): ParametrosItem {
  const next = { ...parametros, [campo]: valor };
  const defecto = rangosProgresionDefecto(
    next.series ?? f.series.min,
    next.reps ?? f.reps.min,
  );
  const seriesMax = next.seriesMax ?? defecto.seriesMax!;
  const repsMax = next.repsMax ?? defecto.repsMax!;
  return {
    ...next,
    seriesMax: Math.max(seriesMax, next.series ?? f.series.min),
    repsMax: Math.max(repsMax, next.reps ?? f.reps.min),
  };
}

export function topeReps(parametros: ParametrosItem): number {
  return parametros.repsMax ?? f.reps.max;
}

export function topeSeries(parametros: ParametrosItem): number {
  return parametros.seriesMax ?? f.series.max;
}
