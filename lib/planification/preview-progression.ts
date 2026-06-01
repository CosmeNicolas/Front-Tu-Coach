import {
  PlanificationConfig,
  PlanificationItem,
  ProgressionMode,
  TipoItem,
} from '@/types/planification';
import {
  cantidadDeBloques,
  cicloProgresionBloque,
} from '@/lib/planification/session-layout';
import { topeReps, topeSeries } from '@/lib/planification/fuerza-rangos';
import { PLANIFICATION_LIMITS } from '@/types/planification-limits';

/**
 * Vista previa client-side de progresión por ítem (solo UI del asistente).
 * El read-model autoritativo sigue siendo GET /materialized del backend.
 */
export function computeItemProgressionPreview(
  item: PlanificationItem,
  config: PlanificationConfig,
): string[] {
  const total = config.totalSesiones;
  const bloques = cantidadDeBloques(config.modoProgresion);
  const esBloque = bloques !== null;
  const ciclos = esBloque ? Math.ceil(total / bloques) : total;

  const linea = computeLinea(item, ciclos);
  const out = Array<string>(total).fill('');

  if (!esBloque) {
    for (let i = 0; i < total; i++) out[i] = linea[i] ?? '';
    return out;
  }

  for (let i = 0; i < total; i++) {
    const nroSesion = i + 1;
    const diaBase = ((nroSesion - 1) % bloques) + 1;
    const ciclo = cicloProgresionBloque(nroSesion, bloques);
    if (item.diaBase === diaBase) out[i] = linea[ciclo] ?? '';
  }
  return out;
}

function computeLinea(item: PlanificationItem, ciclos: number): string[] {
  switch (item.tipoItem) {
    case TipoItem.FUERZA:
      return fuerzaLinea(item, ciclos);
    case TipoItem.ISOMETRICO:
      return isometricoLinea(item, ciclos);
    case TipoItem.AEROBICO:
      return aerobicoLinea(item, ciclos);
    default:
      return Array(ciclos).fill('');
  }
}

function fuerzaLinea(item: PlanificationItem, ciclos: number): string[] {
  const limits = PLANIFICATION_LIMITS.fuerza;
  let series = item.parametros.series ?? 3;
  let reps = item.parametros.reps ?? 6;
  let peso = item.parametros.peso ?? 0;
  const incReps = item.progresion?.incrementoReps ?? 2;
  const incPeso = item.progresion?.incrementoPeso ?? 2.5;
  const minReps = item.parametros.reps ?? limits.reps.min;
  const minSeries = item.parametros.series ?? limits.series.min;
  const maxReps = topeReps(item.parametros);
  const maxSeries = topeSeries(item.parametros);
  const out: string[] = [];

  for (let i = 0; i < ciclos; i++) {
    out.push(`${peso}kg ${series}x${reps}`);
    if (reps < maxReps && incReps > 0) {
      reps = Math.min(reps + incReps, maxReps);
    } else if (series < maxSeries) {
      series += 1;
      reps = minReps;
    } else {
      series = minSeries;
      reps = minReps;
      peso = Math.min(peso + incPeso, limits.peso.max);
    }
  }
  return out;
}

function isometricoLinea(item: PlanificationItem, ciclos: number): string[] {
  const limits = PLANIFICATION_LIMITS.isometrico;
  const series = item.parametros.series ?? 3;
  let seg = item.parametros.segundos ?? 30;
  const inc = item.progresion?.incrementoSegundos ?? 5;
  const out: string[] = [];
  for (let i = 0; i < ciclos; i++) {
    out.push(`${series}x${seg}''`);
    seg = Math.min(seg + inc, limits.topeSegundos);
  }
  return out;
}

function aerobicoLinea(item: PlanificationItem, ciclos: number): string[] {
  let min = item.parametros.minutos ?? 5;
  const inc = item.progresion?.incrementoMinutos ?? 0;
  const tope = 60;
  const out: string[] = [];
  for (let i = 0; i < ciclos; i++) {
    out.push(`${min} min`);
    min = Math.min(min + inc, tope);
  }
  return out;
}

export function etiquetaDia(
  modo: ProgressionMode,
  dia: number,
): string {
  if (modo === ProgressionMode.BLOQUE_X2) {
    return dia === 1 ? 'MS · Día 1' : 'MI · Día 2';
  }
  return `Día ${dia}`;
}
