'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api/client';
import {
  PlanificationConfig,
  PlanificationItemSingle,
  TipoItem,
} from '@/types/planification';
import { ajustarRangosTrasCambioMin } from '@/lib/planification/fuerza-rangos';
import { useCreateItemAdjustment } from '@/hooks/usePlanifications';
import { Button } from '@/components/ui/button';
import { CardEjercicioEdicion } from './CardEjercicioEdicion';
import { AjusteAntesDespues } from './AjusteAntesDespues';
import { computeItemProgressionPreview } from '@/lib/planification/preview-progression';
import { CEMD } from './constants';

interface Props {
  planificationId: string;
  contentVersion: number;
  item: PlanificationItemSingle;
  config: PlanificationConfig;
  onClose: () => void;
  onApplied: (planification: import('@/types/planification').Planification) => void;
}

export function PanelAjusteEjercicio({
  planificationId,
  contentVersion,
  item,
  config,
  onClose,
  onApplied,
}: Props) {
  const mutation = useCreateItemAdjustment(planificationId);
  const lockedSession = item.ajuste?.desdeSesion;
  const [fromSession, setFromSession] = useState(
    lockedSession ?? Math.max(2, Math.ceil(config.totalSesiones / 2)),
  );
  const [motivo, setMotivo] = useState('');
  const [draft, setDraft] = useState<PlanificationItemSingle>({ ...item });

  useEffect(() => {
    setDraft({ ...item });
  }, [item]);

  const preview = useMemo(
    () => computeItemProgressionPreview(draft, config),
    [draft, config],
  );

  const sesionesValidas = useMemo(() => {
    const base = computeItemProgressionPreview(item, config);
    return base
      .map((v, i) => ({ v, n: i + 1 }))
      .filter(({ v }) => v.trim() !== '')
      .map(({ n }) => n);
  }, [item, config]);

  function setParam<K extends keyof PlanificationItemSingle['parametros']>(
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

  function setProg<K extends keyof NonNullable<PlanificationItemSingle['progresion']>>(
    key: K,
    value: number,
  ) {
    setDraft((d) => ({
      ...d,
      progresion: { ...d.progresion, [key]: value },
    }));
  }

  async function handleSubmit() {
    if (!draft.ejercicio.trim()) {
      toast.error('El nombre del ejercicio es obligatorio');
      return;
    }
    if (!sesionesValidas.includes(fromSession)) {
      toast.error(
        `La sesión ${fromSession} no corresponde a una ocurrencia de este ejercicio`,
      );
      return;
    }

    try {
      const result = await mutation.mutateAsync({
        itemId: item.id,
        payload: {
          fromSession,
          motivo: motivo.trim() || undefined,
          expectedContentVersion: contentVersion,
          cambios: {
            ejercicio: draft.ejercicio,
            gif: draft.gif,
            tipoItem: draft.tipoItem,
            unidadTrabajo: draft.unidadTrabajo,
            parametros: draft.parametros,
            progresion: draft.progresion,
          },
        },
      });
      toast.success(`Ajuste aplicado desde sesión ${fromSession}`);
      onApplied(result.planification);
      onClose();
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        toast.error('Conflicto de versión. Recargá la planificación.');
      } else {
        toast.error(err instanceof Error ? err.message : 'Error al aplicar ajuste');
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div
        role="dialog"
        aria-labelledby="panel-ajuste-title"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-xl"
      >
        <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white px-4 py-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 id="panel-ajuste-title" className={`font-bold ${CEMD.primaryClass}`}>
                Ajuste desde sesión N
              </h3>
              <p className="text-xs text-zinc-500">
                Las sesiones anteriores no se recalculan. El progreso del alumno no
                cambia.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded p-1 text-zinc-500 hover:bg-zinc-100"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>
        </header>

        <div className="space-y-4 p-4">
          <label className="block text-sm">
            <span className="font-medium">Desde sesión</span>
            <select
              value={fromSession}
              disabled={lockedSession !== undefined}
              onChange={(e) => setFromSession(Number(e.target.value))}
              className="mt-1 w-full rounded border border-zinc-300 px-2 py-1.5 text-sm disabled:bg-zinc-100"
            >
              {sesionesValidas.map((n) => (
                <option key={n} value={n}>
                  Sesión {n}
                  {n === lockedSession ? ' (corte fijado)' : ''}
                </option>
              ))}
            </select>
          </label>

          <AjusteAntesDespues
            antes={item}
            despues={draft}
            fromSession={fromSession}
          />

          {draft.tipoItem !== TipoItem.AEROBICO ? (
            <CardEjercicioEdicion
              draft={draft}
              setParam={setParam}
              setProg={setProg}
              setParametros={(parametros) => setDraft((d) => ({ ...d, parametros }))}
              setNotas={(n) => setDraft((d) => ({ ...d, notas: n || null }))}
            />
          ) : (
            <label className="block text-sm">
              <span className="font-medium">Ejercicio</span>
              <input
                type="text"
                value={draft.ejercicio}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, ejercicio: e.target.value }))
                }
                className="mt-1 w-full rounded border border-zinc-300 px-2 py-1.5"
              />
            </label>
          )}

          <label className="block text-sm">
            <span className="font-medium">Motivo (opcional)</span>
            <input
              type="text"
              maxLength={300}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ej.: molestia en hombro"
              className="mt-1 w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
            />
          </label>

          <div className="rounded-lg border border-border bg-muted p-2 text-xs text-muted-foreground">
            Vista previa sesión {fromSession}:{' '}
            <strong>{preview[fromSession - 1] || '—'}</strong>
          </div>
        </div>

        <footer className="sticky bottom-0 flex justify-end gap-2 border-t border-zinc-200 bg-white px-4 py-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={mutation.isPending}>
            {mutation.isPending ? 'Aplicando…' : 'Aplicar ajuste'}
          </Button>
        </footer>
      </div>
    </div>
  );
}
