import {
  rangosProgresionDefecto,
} from '@/lib/planification/fuerza-rangos';
import { generateItemId } from '@/lib/planification/section-items';
import {
  PlanificationItem,
  TipoItem,
  UnidadTrabajo,
} from '@/types/planification';

export function lineaProgresion(it: PlanificationItem): string {
  switch (it.tipoItem) {
    case TipoItem.FUERZA:
      return `${it.parametros.series ?? 0}x${it.parametros.reps ?? 0} - ${it.parametros.peso ?? 0}kg${it.progresion?.incrementoPeso ? ` (+${it.progresion.incrementoPeso}kg)` : ''}`;
    case TipoItem.ISOMETRICO:
      return `${it.parametros.series ?? 0}x${it.parametros.segundos ?? 0}''${it.progresion?.incrementoSegundos ? ` (+${it.progresion.incrementoSegundos} seg)` : ''}`;
    case TipoItem.AEROBICO:
      return `${it.parametros.minutos ?? 0} min${it.progresion?.incrementoMinutos ? ` (+${it.progresion.incrementoMinutos} min)` : ''}`;
    default:
      return '';
  }
}

export function defaultItem(tipo: TipoItem, diaBase?: number): PlanificationItem {
  switch (tipo) {
    case TipoItem.FUERZA: {
      const series = 3;
      const reps = 8;
      return {
        id: generateItemId(),
        kind: 'single',
        ejercicio: '',
        tipoItem: TipoItem.FUERZA,
        unidadTrabajo: UnidadTrabajo.REPS,
        parametros: {
          series,
          reps,
          peso: 20,
          descanso: 90,
          ...rangosProgresionDefecto(series, reps),
        },
        progresion: { incrementoPeso: 2.5, incrementoReps: 2 },
        diaBase,
      };
    }
    case TipoItem.ISOMETRICO:
      return {
        id: generateItemId(),
        kind: 'single',
        ejercicio: '',
        tipoItem: TipoItem.ISOMETRICO,
        unidadTrabajo: UnidadTrabajo.SEG,
        parametros: { series: 3, segundos: 30, descanso: 60 },
        progresion: { incrementoSegundos: 5 },
        diaBase,
      };
    default:
      return {
        id: generateItemId(),
        kind: 'single',
        ejercicio: '',
        tipoItem: TipoItem.MOVILIDAD,
        unidadTrabajo: UnidadTrabajo.SEG,
        parametros: { series: 2, segundos: 30 },
        diaBase,
      };
  }
}
