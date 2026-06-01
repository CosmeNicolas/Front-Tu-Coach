'use client';

import { useMemo } from 'react';
import {
  BLOQUE_MODE_FREQUENCY,
  PlanificationConfig,
  PlanificationItem,
} from '@/types/planification';
import { computeAjusteProgressionPreview } from '@/lib/planification/adjustment-preview';
import {
  computeItemProgressionPreview,
  etiquetaDia,
} from '@/lib/planification/preview-progression';
import { CEMD } from './constants';

interface Props {
  item: PlanificationItem;
  config: PlanificationConfig;
}

function cellClass(idx: number, corteIdx: number): string {
  const base = 'p-1 text-center font-medium';
  if (corteIdx >= 0 && idx === corteIdx) {
    return `${base} border-l-2 border-foreground bg-muted text-foreground`;
  }
  if (corteIdx >= 0 && idx < corteIdx) {
    return `${base} text-zinc-600`;
  }
  return `${base} text-zinc-800`;
}

function headClass(idx: number, corteIdx: number): string {
  const base = `p-1 text-center font-medium ${CEMD.primaryClass}`;
  if (corteIdx >= 0 && idx === corteIdx) {
    return `${base} border-l-2 border-foreground bg-muted text-muted-foreground`;
  }
  return base;
}

export function MiniTablaProgresion({ item, config }: Props) {
  const progresion = useMemo(
    () =>
      item.ajuste
        ? computeAjusteProgressionPreview(item, config)
        : computeItemProgressionPreview(item, config),
    [item, config],
  );

  const corteIdx = item.ajuste ? item.ajuste.desdeSesion - 1 : -1;
  const bloqueFreq = BLOQUE_MODE_FREQUENCY[config.modoProgresion];
  const esBloque = bloqueFreq !== undefined;

  const indicesVisibles = useMemo(() => {
    if (!esBloque) {
      return progresion.map((_, i) => i);
    }
    return progresion
      .map((v, i) => ({ v, i }))
      .filter(({ v }) => v && v.trim() !== '')
      .map(({ i }) => i);
  }, [progresion, esBloque]);

  const diaLabel =
    esBloque && item.diaBase
      ? etiquetaDia(config.modoProgresion, item.diaBase)
      : null;

  if (indicesVisibles.length === 0) return null;

  return (
    <div className={`mt-3 rounded-lg border ${CEMD.borderClass} bg-white p-3`}>
      <p className={`text-xs font-semibold ${CEMD.primaryClass}`}>
        📊 Vista de progresión
        {diaLabel ? (
          <span className="ml-2 font-normal text-zinc-500">({diaLabel})</span>
        ) : null}
        {corteIdx >= 0 ? (
          <span className="ml-2 font-normal text-muted-foreground">
            · corte sesión {corteIdx + 1}
          </span>
        ) : null}
      </p>
      <div className="mt-2 overflow-x-auto">
        <table className="w-full min-w-max text-xs">
          <thead>
            <tr className="border-b border-zinc-200">
              <th className="p-1 text-left font-medium text-zinc-600">Sesión</th>
              {indicesVisibles.map((idx) => (
                <th key={idx} className={headClass(idx, corteIdx)}>
                  {idx + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-1 font-medium text-zinc-600">Valor</td>
              {indicesVisibles.map((idx) => (
                <td key={idx} className={cellClass(idx, corteIdx)}>
                  {progresion[idx] || '—'}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-1 text-[10px] text-zinc-500">
        {indicesVisibles.length} de {config.totalSesiones} sesiones con progresión
      </p>
    </div>
  );
}
