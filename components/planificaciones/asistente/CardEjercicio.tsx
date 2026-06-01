'use client';

import { useEffect, useState } from 'react';
import {
  Planification,
  PlanificationConfig,
  PlanificationItem,
  TipoItem,
} from '@/types/planification';
import { ajustarRangosTrasCambioMin } from '@/lib/planification/fuerza-rangos';
import { EjercicioAvatar } from './EjercicioAvatar';
import { MiniTablaProgresion } from './MiniTablaProgresion';
import { CardEjercicioEdicion } from './CardEjercicioEdicion';
import { CardEjercicioHeader } from './CardEjercicioHeader';
import { CardEjercicioToolbar } from './CardEjercicioToolbar';
import { AjusteBadge } from './AjusteAntesDespues';
import { PanelAjusteEjercicio } from './PanelAjusteEjercicio';

export { defaultItem } from './card-ejercicio-defaults';

interface Props {
  item: PlanificationItem;
  config: PlanificationConfig;
  compact?: boolean;
  planificationId?: string;
  contentVersion?: number;
  onUpdate: (item: PlanificationItem) => void;
  onRemove: () => void;
  onAdjusted?: (planification: Planification) => void;
}

export function CardEjercicio({
  item,
  config,
  compact,
  planificationId,
  contentVersion,
  onUpdate,
  onRemove,
  onAdjusted,
}: Props) {
  const [draft, setDraft] = useState(item);
  const [editing, setEditing] = useState(false);
  const [ajusteAbierto, setAjusteAbierto] = useState(false);

  useEffect(() => {
    if (!editing) setDraft(item);
  }, [item, editing]);

  function save() {
    if (!draft.ejercicio.trim()) return;
    onUpdate(draft);
    setEditing(false);
  }

  function cancel() {
    setDraft(item);
    setEditing(false);
  }

  function setParam<K extends keyof PlanificationItem['parametros']>(
    key: K,
    value: number,
  ) {
    setDraft((d) => {
      let parametros = { ...d.parametros, [key]: value };
      if (key === 'series' || key === 'reps') {
        parametros = ajustarRangosTrasCambioMin(parametros, key, value);
      }
      return { ...d, parametros };
    });
  }

  function setProg<K extends keyof NonNullable<PlanificationItem['progresion']>>(
    key: K,
    value: number,
  ) {
    setDraft((d) => ({
      ...d,
      progresion: { ...d.progresion, [key]: value },
    }));
  }

  const display = editing ? draft : item;

  return (
    <article className="rounded-lg border border-zinc-200 bg-white shadow-sm">
      <div className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <EjercicioAvatar
            gif={display.gif}
            nombre={display.ejercicio}
            size="lg"
          />

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1 space-y-1">
                <CardEjercicioHeader item={display} editing={editing} />
                {!editing && item.ajuste ? <AjusteBadge item={item} /> : null}
              </div>
              <CardEjercicioToolbar
                editing={editing}
                onSave={save}
                onCancel={cancel}
                onEdit={() => setEditing(true)}
                onRemove={onRemove}
                onAdjust={
                  planificationId && contentVersion !== undefined && onAdjusted
                    ? () => setAjusteAbierto(true)
                    : undefined
                }
              />
            </div>

            {editing ? (
              <CardEjercicioEdicion
                draft={draft}
                setParam={setParam}
                setProg={setProg}
                setParametros={(parametros) =>
                  setDraft((d) => ({ ...d, parametros }))
                }
                setNotas={(n) => setDraft((d) => ({ ...d, notas: n || null }))}
              />
            ) : null}
          </div>
        </div>

        {!compact && !editing && display.tipoItem !== TipoItem.AEROBICO ? (
          <MiniTablaProgresion item={item} config={config} />
        ) : null}
        {!compact && editing ? (
          <MiniTablaProgresion item={draft} config={config} />
        ) : null}
      </div>

      {ajusteAbierto && planificationId && contentVersion !== undefined && onAdjusted ? (
        <PanelAjusteEjercicio
          planificationId={planificationId}
          contentVersion={contentVersion}
          item={item}
          config={config}
          onClose={() => setAjusteAbierto(false)}
          onApplied={onAdjusted}
        />
      ) : null}
    </article>
  );
}
