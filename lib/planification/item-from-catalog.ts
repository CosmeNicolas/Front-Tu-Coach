import {
  EjercicioCatalogo,
  esIsometrico,
  nombreVisible,
} from '@/lib/ejercicios/catalogo';
import { defaultItem } from '@/components/planificaciones/asistente/card-ejercicio-defaults';
import {
  PlanificationItemSingle,
  TipoItem,
} from '@/types/planification';

/**
 * Aplica un ejercicio del catálogo sobre un ítem existente (sustitución desde sesión N).
 * Conserva id, diaBase y metadata de ajuste; reinicia params según tipo detectado.
 */
export function applyCatalogToItemDraft(
  current: PlanificationItemSingle,
  catalog: EjercicioCatalogo,
): PlanificationItemSingle {
  const nombre = nombreVisible(catalog);
  const tipo = esIsometrico(nombre) ? TipoItem.ISOMETRICO : TipoItem.FUERZA;
  const base = defaultItem(tipo, current.diaBase);

  return {
    ...current,
    ejercicio: nombre,
    gif: catalog.gif ?? null,
    tipoItem: base.tipoItem,
    unidadTrabajo: base.unidadTrabajo,
    parametros: { ...base.parametros },
    progresion: base.progresion ? { ...base.progresion } : undefined,
  };
}
