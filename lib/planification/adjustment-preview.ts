import {
  BLOQUE_MODE_FREQUENCY,
  PlanificationConfig,
  PlanificationItemSingle,
  ProgressionMode,
} from '@/types/planification';
import { computeItemProgressionPreview } from '@/lib/planification/preview-progression';

export function buildBaselineItem(
  item: PlanificationItemSingle,
): PlanificationItemSingle {
  const ajuste = item.ajuste!;
  return {
    ...item,
    ejercicio: ajuste.ejercicioAnterior,
    gif: ajuste.gifAnterior ?? null,
    tipoItem: ajuste.tipoItemAnterior ?? item.tipoItem,
    unidadTrabajo: ajuste.unidadTrabajoAnterior ?? item.unidadTrabajo,
    parametros: { ...ajuste.parametrosAnteriores },
    progresion: ajuste.progresionAnterior
      ? { ...ajuste.progresionAnterior }
      : item.progresion,
    ajuste: undefined,
  };
}

/** Progresión con overlay (aprox. client-side; materialized es autoritativo). */
export function computeAjusteProgressionPreview(
  item: PlanificationItemSingle,
  config: PlanificationConfig,
): string[] {
  if (!item.ajuste || item.ajuste.desdeSesion <= 1) {
    return computeItemProgressionPreview(item, config);
  }

  const baseline = computeItemProgressionPreview(
    buildBaselineItem(item),
    config,
  );
  const corte = item.ajuste.desdeSesion - 1;
  const stripped = { ...item, ajuste: undefined };
  const bloqueFreq = BLOQUE_MODE_FREQUENCY[config.modoProgresion];

  if (!bloqueFreq) {
    const afterLine = computeItemProgressionPreview(stripped, {
      ...config,
      modoProgresion: ProgressionMode.LINEAL,
    });
    return baseline.map((v, i) => (i < corte ? v : afterLine[i - corte] ?? ''));
  }

  const ciclos = Math.ceil(config.totalSesiones / bloqueFreq);
  const afterLine = computeItemProgressionPreview(stripped, {
    ...config,
    modoProgresion: ProgressionMode.LINEAL,
    totalSesiones: ciclos,
    frecuenciaSemanal: ciclos,
    semanasDelPlan: 1,
  });

  return baseline.map((v, i) => {
    if (i < corte || !v.trim()) return v;
    const ciclo = Math.floor(i / bloqueFreq);
    const cicloDesde = Math.floor(corte / bloqueFreq);
    return afterLine[ciclo - cicloDesde] ?? v;
  });
}

export function labelAntes(item: PlanificationItemSingle): string {
  return item.ajuste?.ejercicioAnterior ?? item.ejercicio;
}

export function labelDesde(item: PlanificationItemSingle): string {
  return item.ejercicio;
}
