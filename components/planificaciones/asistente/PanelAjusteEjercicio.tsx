'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api/client';
import { OPCIONES_CARDIO } from '@/lib/ejercicios/catalogo-cardio';
import { resolveGifUrl } from '@/lib/ejercicios/gif-url';
import {
  PlanificationConfig,
  PlanificationItemSingle,
  PlanificationProgress,
  TipoItem,
  TipoSeccion,
} from '@/types/planification';
import { PLANIFICATION_LIMITS } from '@/types/planification-limits';
import {
  filtrarSesionesAjuste,
  minFromSessionParaAjuste,
  ultimaSesionCompletadaAlumno,
} from '@/lib/planification/alumno-progress-guard';
import {
  getLastExerciseAlumnoContext,
  getSesionFeedback,
} from '@/lib/planification/exercise-progress-context';
import { ajustarRangosTrasCambioMin } from '@/lib/planification/fuerza-rangos';
import { useCreateItemAdjustment, useMaterializedPlanification } from '@/hooks/usePlanifications';
import { applyCatalogToItemDraft } from '@/lib/planification/item-from-catalog';
import { Button } from '@/components/ui/button';
import { CardEjercicioEdicion } from './CardEjercicioEdicion';
import { AjusteAntesDespues } from './AjusteAntesDespues';
import { SustitucionEjercicioCatalogo } from './SustitucionEjercicioCatalogo';
import { computeItemProgressionPreview } from '@/lib/planification/preview-progression';
import { ExerciseAlumnoContextBlock } from '@/components/planificaciones/shared/ExerciseAlumnoContextBlock';
import {
  AlumnoFeedbackResumen,
  hasAlumnoFeedbackContent,
} from '@/components/planificaciones/shared/AlumnoFeedbackResumen';
import { CEMD, OPCIONES_INCREMENTO_MIN, OPCIONES_MINUTOS } from './constants';
import { EjercicioAvatar } from './EjercicioAvatar';

interface Props {
  planificationId: string;
  contentVersion: number;
  catalogTabId: string;
  progresoAlumno?: PlanificationProgress;
  item: PlanificationItemSingle;
  config: PlanificationConfig;
  /** Entrada en calor / vuelta a la calma: grilla de cardio en el panel. */
  cardioTipoSeccion?: TipoSeccion.CALENTAMIENTO | TipoSeccion.VUELTA_CALMA;
  onClose: () => void;
  onApplied: (planification: import('@/types/planification').Planification) => void;
}

export function PanelAjusteEjercicio({
  planificationId,
  contentVersion,
  catalogTabId,
  progresoAlumno,
  item,
  config,
  cardioTipoSeccion,
  onClose,
  onApplied,
}: Props) {
  const mutation = useCreateItemAdjustment(planificationId);
  const alumnoConProgreso = (progresoAlumno?.completadas?.length ?? 0) > 0;
  const { data: materialized } = useMaterializedPlanification(
    alumnoConProgreso ? planificationId : '',
  );
  const cortePrevio = item.ajuste?.desdeSesion;
  const minFromSession = minFromSessionParaAjuste(progresoAlumno, cortePrevio);
  const avanceDeCorte =
    cortePrevio !== undefined &&
    minFromSession > cortePrevio;

  const [fromSession, setFromSession] = useState(minFromSession);

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
    const ocurrencias = base
      .map((v, i) => ({ v, n: i + 1 }))
      .filter(({ v }) => v.trim() !== '')
      .map(({ n }) => n);
    return filtrarSesionesAjuste(ocurrencias, progresoAlumno, cortePrevio);
  }, [item, config, progresoAlumno, cortePrevio]);

  useEffect(() => {
    if (sesionesValidas.length === 0) return;
    if (sesionesValidas.includes(fromSession)) return;
    setFromSession(sesionesValidas[0]!);
  }, [sesionesValidas, fromSession]);

  const exerciseContext = useMemo(
    () =>
      alumnoConProgreso
        ? getLastExerciseAlumnoContext(progresoAlumno, materialized, item, {
          beforeSession: fromSession,
        })
        : null,
    [alumnoConProgreso, progresoAlumno, materialized, item, fromSession],
  );

  const sesionPreCorte = fromSession > 1 ? fromSession - 1 : null;
  const preCorteFeedback = useMemo(
    () =>
      sesionPreCorte && progresoAlumno
        ? getSesionFeedback(progresoAlumno, sesionPreCorte)
        : null,
    [sesionPreCorte, progresoAlumno],
  );

  const showPreCorteSession = Boolean(
    preCorteFeedback &&
    hasAlumnoFeedbackContent(preCorteFeedback) &&
    exerciseContext?.sessionNum !== sesionPreCorte,
  );

  const showFeedbackPanel = Boolean(exerciseContext || showPreCorteSession);

  const cardioLimits = cardioTipoSeccion
    ? cardioTipoSeccion === TipoSeccion.CALENTAMIENTO
      ? PLANIFICATION_LIMITS.calentamiento
      : PLANIFICATION_LIMITS.vueltaCalma
    : null;

  function pickCardio(id: string) {
    const op = OPCIONES_CARDIO.find((o) => o.id === id);
    if (!op) return;
    setDraft((d) => ({
      ...d,
      ejercicio: op.nombre,
      gif: op.imagen ? resolveGifUrl(op.imagen) : null,
    }));
  }

  const cardioSelId =
    draft.tipoItem === TipoItem.AEROBICO
      ? OPCIONES_CARDIO.find((o) => o.nombre === draft.ejercicio)?.id ?? ''
      : '';

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
    if (!sesionesValidas.length) {
      toast.error(
        'No hay sesiones disponibles para ajustar después del progreso del alumno',
      );
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
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-card shadow-xl"
      >
        <header className="sticky top-0 z-10 border-b border-border bg-card px-4 py-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 id="panel-ajuste-title" className={`font-bold ${CEMD.primaryClass}`}>
                Ajuste desde sesión "X"
              </h3>
              <p className="text-xs text-muted-foreground">
                Las sesiones anteriores no se recalculan. El progreso del alumno no
                cambia.
                {ultimaSesionCompletadaAlumno(progresoAlumno) > 0 ? (
                  <>
                    {' '}
                    Última sesión completada: #
                    {ultimaSesionCompletadaAlumno(progresoAlumno)}.
                  </>
                ) : null}
              </p>
              {cortePrevio !== undefined ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  Corte anterior: sesión {cortePrevio}.
                  {avanceDeCorte
                    ? ` Elegí sesión ${minFromSession} o posterior para modificar lo que viene sin tocar lo ya hecho.`
                    : ' Podés re-ajustar desde la misma sesión de corte.'}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded p-1 text-muted-foreground hover:bg-muted"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>
        </header>

        <div className="space-y-4 p-4">
          <label className="block text-sm">
            <span className="font-medium">Desde sesión</span>
            {sesionesValidas.length === 0 ? (
              <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                El alumno completó todas las ocurrencias de este ejercicio o no quedan
                sesiones futuras para ajustar.
              </p>
            ) : (
              <select
                value={fromSession}
                onChange={(e) => setFromSession(Number(e.target.value))}
                className="mt-1 w-full rounded border border-input px-2 py-1.5 text-sm"
              >
                {sesionesValidas.map((n) => (
                  <option key={n} value={n}>
                    Sesión {n}
                    {n === cortePrevio && !avanceDeCorte ? ' (corte actual)' : ''}
                    {n === minFromSession && avanceDeCorte ? ' (nuevo corte sugerido)' : ''}
                  </option>
                ))}
              </select>
            )}
          </label>

          {showFeedbackPanel ? (
            <div className="space-y-2 rounded-lg border border-sky-200 bg-sky-50/80 px-3 py-2.5 dark:border-sky-900/50 dark:bg-sky-950/30">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Feedback del alumno (antes del corte)
              </p>
              {exerciseContext ? (
                <ExerciseAlumnoContextBlock context={exerciseContext} compact />
              ) : null}
              {showPreCorteSession && preCorteFeedback ? (
                <AlumnoFeedbackResumen
                  feedback={preCorteFeedback}
                  title={`Sesión ${sesionPreCorte} · inmediata anterior al corte`}
                  compact
                  showExerciseNotesHint
                />
              ) : null}
            </div>
          ) : alumnoConProgreso ? (
            <p className="rounded-lg border border-dashed border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
              El alumno no dejó comentarios sobre este ejercicio en sesiones
              anteriores a la {fromSession}.
            </p>
          ) : null}

          <AjusteAntesDespues
            antes={item}
            despues={draft}
            fromSession={fromSession}
          />

          {draft.tipoItem !== TipoItem.AEROBICO ? (
            <SustitucionEjercicioCatalogo
              catalogTabId={catalogTabId}
              onSeleccionar={(ej) =>
                setDraft((d) => applyCatalogToItemDraft(d, ej))
              }
            />
          ) : null}

          {draft.tipoItem !== TipoItem.AEROBICO ? (
            <CardEjercicioEdicion
              draft={draft}
              setParam={setParam}
              setProg={setProg}
              setParametros={(parametros) => setDraft((d) => ({ ...d, parametros }))}
              setNotas={(n) => setDraft((d) => ({ ...d, notas: n || null }))}
            />
          ) : cardioTipoSeccion && cardioLimits ? (
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">
                Nuevo ejercicio aeróbico (desde sesión {fromSession})
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <label className="text-sm">
                  <span className="mb-1 block font-medium">Minutos iniciales</span>
                  <select
                    value={draft.parametros.minutos ?? 10}
                    onChange={(e) => setParam('minutos', Number(e.target.value))}
                    className="mt-1 w-full rounded border border-input px-2 py-1.5"
                  >
                    {OPCIONES_MINUTOS.filter(
                      (m) => m <= cardioLimits.minutosIniciales.max,
                    ).map((m) => (
                      <option key={m} value={m}>
                        {m} min
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm">
                  <span className="mb-1 block font-medium">Incremento (min)</span>
                  <select
                    value={draft.progresion?.incrementoMinutos ?? 0}
                    onChange={(e) => setProg('incrementoMinutos', Number(e.target.value))}
                    className="mt-1 w-full rounded border border-input px-2 py-1.5"
                  >
                    {OPCIONES_INCREMENTO_MIN.map((m) => (
                      <option key={m} value={m}>
                        {m === 0 ? 'Sin incremento' : `+${m} min`}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {OPCIONES_CARDIO.map((op) => (
                  <button
                    key={op.id}
                    type="button"
                    onClick={() => pickCardio(op.id)}
                    className={
                      cardioSelId === op.id
                        ? 'flex flex-col items-center rounded-lg border-2 border-primary bg-primary/10 p-3'
                        : 'flex flex-col items-center rounded-lg border border-input bg-card p-3 hover:border-primary'
                    }
                  >
                    <EjercicioAvatar
                      gif={op.imagen}
                      nombre={op.nombre}
                      size="md"
                      roundedFull
                    />
                    <span className="mt-1 text-center text-xs font-medium">{op.nombre}</span>
                  </button>
                ))}
              </div>
              <label className="block text-sm">
                <span className="font-medium">Comentario para el alumno</span>
                <textarea
                  value={draft.notas ?? ''}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, notas: e.target.value || null }))
                  }
                  className="mt-1 min-h-[72px] w-full resize-none rounded border border-input px-2 py-1.5 text-sm"
                  maxLength={220}
                />
              </label>
            </div>
          ) : (
            <label className="block text-sm">
              <span className="font-medium">Ejercicio</span>
              <input
                type="text"
                value={draft.ejercicio}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, ejercicio: e.target.value }))
                }
                className="mt-1 w-full rounded border border-input px-2 py-1.5"
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
              className="mt-1 w-full rounded border border-input px-2 py-1.5 text-sm"
            />
          </label>

          <div className="rounded-lg border border-border bg-muted p-2 text-xs text-muted-foreground">
            <p>
              Vista previa sesión {fromSession}:{' '}
              <strong>{preview[fromSession - 1] || '—'}</strong>
            </p>
            {fromSession > 1 ? (
              <p className="mt-1">
                Sesión {fromSession - 1} (sin cambios):{' '}
                <strong>{preview[fromSession - 2] || '—'}</strong>
              </p>
            ) : null}
          </div>
        </div>

        <footer className="sticky bottom-0 flex justify-end gap-2 border-t border-border bg-card px-4 py-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={mutation.isPending || sesionesValidas.length === 0}
          >
            {mutation.isPending ? 'Aplicando…' : 'Aplicar ajuste'}
          </Button>
        </footer>
      </div>
    </div>
  );
}
