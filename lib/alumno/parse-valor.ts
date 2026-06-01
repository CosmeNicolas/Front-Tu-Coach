import { TipoItem, UnidadTrabajo } from '@/types/planification';
import { formatValorDisplay } from '@/components/planificaciones/asistente/preview/preview-format';
import { ParsedExerciseParams } from '@/types/alumno-session';

export function parseExerciseParams(
  valor: string,
  tipoItem: TipoItem,
  unidadTrabajo: UnidadTrabajo,
  parametros?: { peso?: number; series?: number; reps?: number; minutos?: number; segundos?: number },
): ParsedExerciseParams {
  const v = valor.trim();
  const display = formatValorDisplay(valor, tipoItem, unidadTrabajo);

  const fuerza = v.match(/(?:(\d+(?:\.\d+)?)\s*kg\s*)?(\d+)x(\d+)/i);
  if (fuerza) {
    return {
      pesoKg: fuerza[1] ?? (parametros?.peso != null ? String(parametros.peso) : null),
      series: fuerza[2],
      reps: fuerza[3],
      minutos: null,
      segundos: null,
      display,
    };
  }

  const iso = v.match(/^(\d+)x(\d+)\s*(?:''|"|s|seg)/i);
  if (iso) {
    return {
      pesoKg: null,
      series: iso[1],
      reps: null,
      minutos: null,
      segundos: iso[2],
      display,
    };
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

  return {
    pesoKg: parametros?.peso != null ? String(parametros.peso) : null,
    series: parametros?.series != null ? String(parametros.series) : null,
    reps: parametros?.reps != null ? String(parametros.reps) : null,
    minutos: parametros?.minutos != null ? String(parametros.minutos) : null,
    segundos: parametros?.segundos != null ? String(parametros.segundos) : null,
    display,
  };
}
