'use client';

import { PlanificationItemSingle } from '@/types/planification';
import { EjercicioAvatar } from './EjercicioAvatar';
import { labelAntes, labelDesde } from '@/lib/planification/adjustment-preview';
import { CEMD } from './constants';

interface Props {
  antes: PlanificationItemSingle;
  despues: PlanificationItemSingle;
  fromSession: number;
}

export function AjusteAntesDespues({ antes, despues, fromSession }: Props) {
  const cortePrevio = antes.ajuste?.desdeSesion;
  const esAvanceDeCorte =
    cortePrevio !== undefined && fromSession > cortePrevio;

  const nombreAntes = esAvanceDeCorte
    ? antes.ejercicio
    : (antes.ajuste?.ejercicioAnterior ?? antes.ejercicio);
  const gifAntes = esAvanceDeCorte
    ? antes.gif
    : (antes.ajuste?.gifAnterior ?? antes.gif);

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Antes (sesiones 1–{fromSession - 1})
        </p>
        <div className="mt-2 flex items-center gap-2">
          <EjercicioAvatar gif={gifAntes} nombre={nombreAntes} size="sm" />
          <span className="text-sm font-medium text-zinc-800">{nombreAntes}</span>
        </div>
      </div>
      <div
        className={`rounded-lg border-2 ${CEMD.borderClass} bg-primary/5 p-3`}
      >
        <p className={`text-xs font-semibold uppercase tracking-wide ${CEMD.primaryClass}`}>
          Desde sesión {fromSession}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <EjercicioAvatar gif={despues.gif} nombre={despues.ejercicio} size="sm" />
          <span className="text-sm font-medium text-zinc-800">
            {labelDesde(despues)}
          </span>
        </div>
      </div>
    </div>
  );
}

export function AjusteBadge({ item }: { item: PlanificationItemSingle }) {
  if (!item.ajuste) return null;
  return (
    <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-foreground">
      Ajuste desde sesión {item.ajuste.desdeSesion} · {labelAntes(item)} →{' '}
      {labelDesde(item)}
    </span>
  );
}
