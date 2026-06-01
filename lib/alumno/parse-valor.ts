import { TipoItem, UnidadTrabajo } from '@/types/planification';
import { formatValorDisplay } from '@/components/planificaciones/asistente/preview/preview-format';
import { ParsedExerciseParams } from '@/types/alumno-session';

/** Ejercicios que se prescriben en segundos (no repeticiones). */
export function exerciseUsesSeconds(
  tipoItem: TipoItem,
  unidadTrabajo: UnidadTrabajo,
): boolean {
  if (tipoItem === TipoItem.ISOMETRICO) return true;
  if (tipoItem === TipoItem.FUERZA) return false;
  return unidadTrabajo === UnidadTrabajo.SEG;
}

function parseSegundosValor(
  valor: string,
  parametros?: {
    peso?: number;
    series?: number;
    reps?: number;
    minutos?: number;
    segundos?: number;
  },
): ParsedExerciseParams | null {
  const v = valor.trim();
  const display = formatValorDisplay(valor, TipoItem.ISOMETRICO, UnidadTrabajo.SEG);

  const seriesSeg = v.match(/^(\d+)\s*x\s*(\d+)\s*(?:''|"|s|seg)?/i);
  if (seriesSeg) {
    return {
      pesoKg: null,
      series: seriesSeg[1],
      reps: null,
      minutos: null,
      segundos: seriesSeg[2],
      display,
    };
  }

  const soloSeg = v.match(/^(\d+)\s*(?:''|"|s|seg)\s*$/i);
  if (soloSeg) {
    return {
      pesoKg: null,
      series: parametros?.series != null ? String(parametros.series) : null,
      reps: null,
      minutos: null,
      segundos: soloSeg[1],
      display,
    };
  }

  if (parametros?.segundos != null) {
    return {
      pesoKg: null,
      series: parametros.series != null ? String(parametros.series) : null,
      reps: null,
      minutos: null,
      segundos: String(parametros.segundos),
      display,
    };
  }

  return null;
}

export function parseExerciseParams(
  valor: string,
  tipoItem: TipoItem,
  unidadTrabajo: UnidadTrabajo,
  parametros?: {
    peso?: number;
    series?: number;
    reps?: number;
    minutos?: number;
    segundos?: number;
  },
): ParsedExerciseParams {
  const v = valor.trim();
  const display = formatValorDisplay(valor, tipoItem, unidadTrabajo);

  if (exerciseUsesSeconds(tipoItem, unidadTrabajo)) {
    const segundos = parseSegundosValor(v, parametros);
    if (segundos) return segundos;
  }

  const aerobico = v.match(/^(\d+(?:\.\d+)?)\s*min/i);
  if (aerobico) {
    return {
      pesoKg: null,
      series: null,
      reps: null,
      minutos: aerobico[1],
      segundos: null,
      display,
    };
  }

  const fuerza = v.match(/(?:(\d+(?:\.\d+)?)\s*kg\s*)?(\d+)\s*x\s*(\d+)/i);
  if (fuerza && !exerciseUsesSeconds(tipoItem, unidadTrabajo)) {
    return {
      pesoKg: fuerza[1] ?? (parametros?.peso != null ? String(parametros.peso) : null),
      series: fuerza[2],
      reps: fuerza[3],
      minutos: null,
      segundos: null,
      display,
    };
  }

  return {
    pesoKg: parametros?.peso != null ? String(parametros.peso) : null,
    series: parametros?.series != null ? String(parametros.series) : null,
    reps: exerciseUsesSeconds(tipoItem, unidadTrabajo)
      ? null
      : parametros?.reps != null
        ? String(parametros.reps)
        : null,
    minutos: parametros?.minutos != null ? String(parametros.minutos) : null,
    segundos: parametros?.segundos != null ? String(parametros.segundos) : null,
    display,
  };
}
