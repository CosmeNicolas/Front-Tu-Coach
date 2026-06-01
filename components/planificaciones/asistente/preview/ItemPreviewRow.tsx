'use client';

import { MaterializedItem } from '@/types/planification';
import { EjercicioAvatar } from '../EjercicioAvatar';
import { formatValorDisplay } from './preview-format';
import { AjustePreviewBadge, AjustePreviewHint } from './AjustePreviewBadge';
import { CEMD } from '../constants';

interface Props {
  item: MaterializedItem;
  sessionNum: number;
  esParteDeGrupo?: boolean;
}

export function ItemPreviewRow({
  item,
  sessionNum,
  esParteDeGrupo = false,
}: Props) {
  const valorLabel = formatValorDisplay(
    item.valor,
    item.tipoItem,
    item.unidadTrabajo,
  );

  return (
    <div
      className={`border-b border-zinc-200 pb-3 last:border-0 last:pb-0 ${
        esParteDeGrupo ? 'border-l-2 border-primary/30 pl-3' : ''
      } ${item.esPreAjuste ? 'opacity-95' : ''}`}
    >
      <div className="flex items-start gap-3">
        <EjercicioAvatar gif={item.gif} nombre={item.ejercicio} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-semibold text-zinc-900">
              {item.ejercicio}
            </h4>
            <AjustePreviewBadge item={item} sessionNum={sessionNum} />
          </div>
          <p className={`mt-1 text-sm font-medium ${CEMD.primaryClass}`}>
            {valorLabel}
          </p>
          <AjustePreviewHint item={item} />
          {item.notas?.trim() ? (
            <div className="mt-2 rounded-md border border-border bg-muted px-2 py-1 text-xs text-muted-foreground">
              {item.notas}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
