'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  MaterializedPlanification,
  Planification,
  PlanificationConfig,
  PlanificationItem,
  PlanificationProgress,
  TipoItem,
} from '@/types/planification';
import { getLastExerciseAlumnoContext } from '@/lib/planification/exercise-progress-context';
import { ExerciseAlumnoContextBlock } from '@/components/planificaciones/shared/ExerciseAlumnoContextBlock';
import {
  canInlineEditPlanItem,
  canRemovePlanItem,
  hasAlumnoSessionProgress,
  ultimaSesionCompletadaAlumno,
} from '@/lib/planification/alumno-progress-guard';
import { ajustarRangosTrasCambioMin } from '@/lib/planification/fuerza-rangos';
import { inferMediaType } from '@/lib/ejercicios/media-type';
import { EjercicioAvatar } from './EjercicioAvatar';
import { MiniTablaProgresion } from './MiniTablaProgresion';
import { CardEjercicioEdicion } from './CardEjercicioEdicion';
import { CardEjercicioHeader } from './CardEjercicioHeader';
import { CardEjercicioToolbar } from './CardEjercicioToolbar';
import { AjusteBadge } from './AjusteAntesDespues';
import { PanelAjusteEjercicio } from './PanelAjusteEjercicio';
import { DragHandle } from './SeccionItemsSortableList';

export { defaultItem } from './card-ejercicio-defaults';

interface Props {
  item: PlanificationItem;
  config: PlanificationConfig;
  compact?: boolean;
  catalogTabId?: string;
  progresoAlumno?: PlanificationProgress;
  materialized?: MaterializedPlanification;
  planificationId?: string;
  contentVersion?: number;
  dragHandleProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  onUpdate: (item: PlanificationItem) => void;
  onRemove: () => void;
  onAdjusted?: (planification: Planification) => void;
}

export function CardEjercicio({
  item,
  config,
  compact,
  catalogTabId = 'principal',
  progresoAlumno,
  materialized,
  planificationId,
  contentVersion,
  dragHandleProps,
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
  const inlineEditBlocked = !canInlineEditPlanItem(progresoAlumno, item, config);
  const removeBlocked = !canRemovePlanItem(progresoAlumno, item, config);
  const alumnoProgreso = hasAlumnoSessionProgress(progresoAlumno);
  const alumnoContext =
    !editing && progresoAlumno
      ? getLastExerciseAlumnoContext(progresoAlumno, materialized, {
        id: item.id,
        ejercicio: item.ejercicio,
      })
      : null;

  function startEdit() {
    if (inlineEditBlocked) {
      toast.error('Este día ya tiene sesiones completadas', {
        description:
          'Usá ⚡ Ajuste desde sesión "X" para cambiar sin alterar lo ya entrenado.',
      });
      return;
    }
    if (item.ajuste) {
      toast.message('Este ejercicio tiene Ajuste desde sesión "X"', {
        description:
          'Usá ⚡ para sustituir sin afectar sesiones pasadas. La edición ✎ aplica a toda la planilla.',
      });
    }
    setEditing(true);
  }

  function handleRemove() {
    if (removeBlocked) {
      toast.error('No podés eliminar este ejercicio', {
        description:
          'El alumno ya registró sesiones de este día. Usá ⚡ Ajuste desde sesión "X".',
      });
      return;
    }
    onRemove();
  }

  return (
    <article className="rounded-lg border border-border bg-card shadow-sm">
      <div className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          {dragHandleProps ? (
            <div className="flex shrink-0 self-start pt-1">
              <DragHandle {...dragHandleProps} />
            </div>
          ) : null}
          <EjercicioAvatar
            gif={display.gif}
            nombre={display.ejercicio}
            mediaType={inferMediaType(display.gif)}
            size="lg"
          />

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1 space-y-1">
                <CardEjercicioHeader item={display} editing={editing} />
                {!editing && item.ajuste ? <AjusteBadge item={item} /> : null}
                {!editing && alumnoProgreso ? (
                  <p className="text-[10px] font-medium text-amber-700">
                    Alumno: {progresoAlumno?.completadas.length ?? 0} sesión(es) completada(s)
                    · última #{ultimaSesionCompletadaAlumno(progresoAlumno)} — usá ⚡
                  </p>
                ) : null}
                {!editing ? (
                  <ExerciseAlumnoContextBlock
                    context={alumnoContext}
                    compact={compact}
                  />
                ) : null}
              </div>
              <CardEjercicioToolbar
                editing={editing}
                inlineEditBlocked={inlineEditBlocked}
                removeBlocked={removeBlocked}
                onSave={save}
                onCancel={cancel}
                onEdit={startEdit}
                onRemove={handleRemove}
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
          catalogTabId={catalogTabId}
          progresoAlumno={progresoAlumno}
          item={item}
          config={config}
          onClose={() => setAjusteAbierto(false)}
          onApplied={onAdjusted}
        />
      ) : null}
    </article>
  );
}
