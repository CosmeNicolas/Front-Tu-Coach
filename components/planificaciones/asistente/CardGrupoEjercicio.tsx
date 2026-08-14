'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  MaterializedPlanification,
  Planification,
  PlanificationConfig,
  PlanificationItemGroup,
  PlanificationItemSingle,
  PlanificationProgress,
} from '@/types/planification';
import { Button } from '@/components/ui/button';
import { CardEjercicio } from './CardEjercicio';
import { CEMD } from './constants';
import { DragHandle } from './SeccionItemsSortableList';

interface Props {
  grupo: PlanificationItemGroup;
  config: PlanificationConfig;
  catalogTabId?: string;
  planificationId?: string;
  contentVersion?: number;
  progresoAlumno?: PlanificationProgress;
  materialized?: MaterializedPlanification;
  modoSeleccion?: boolean;
  dragHandleProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  onUpdateSubitem: (subId: string, item: PlanificationItemSingle) => void;
  onRemoveSubitem: (subId: string) => void;
  onDesagrupar: () => void;
  onReorderSubitem?: (subId: string, direction: 'up' | 'down') => void;
  onAdjusted?: (planification: Planification) => void;
}

export function CardGrupoEjercicio({
  grupo,
  config,
  catalogTabId = 'principal',
  planificationId,
  contentVersion,
  progresoAlumno,
  materialized,
  modoSeleccion,
  dragHandleProps,
  onUpdateSubitem,
  onRemoveSubitem,
  onDesagrupar,
  onReorderSubitem,
  onAdjusted,
}: Props) {
  const label = grupo.tipoGrupo === 'biserie' ? 'Biserie' : 'Triserie';
  const puedeReordenarSubitems =
    !modoSeleccion && !!onReorderSubitem && grupo.items.length > 1;

  return (
    <article className="rounded-lg border-2 border-primary bg-primary/5 shadow-sm">
      <header className="flex items-center justify-between gap-2 border-b border-primary/30 px-4 py-2">
        <div className="flex min-w-0 items-center gap-2">
          {dragHandleProps ? <DragHandle {...dragHandleProps} /> : null}
          <div className="min-w-0">
            <h4 className={`text-sm font-bold ${CEMD.primaryClass}`}>{label}</h4>
            <p className="text-xs text-muted-foreground">
              {grupo.items.length} ejercicios · progresión individual
            </p>
          </div>
        </div>
        {!modoSeleccion ? (
          <button
            type="button"
            onClick={onDesagrupar}
            className="shrink-0 rounded px-2 py-1 text-xs text-muted-foreground hover:bg-card"
          >
            Desagrupar
          </button>
        ) : null}
      </header>
      <div className="space-y-2 p-3">
        {grupo.items.map((sub, i) => (
          <div key={sub.id} className="flex items-start gap-2">
            {puedeReordenarSubitems ? (
              <div className="flex shrink-0 flex-col gap-0.5 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  disabled={i === 0}
                  aria-label="Subir ejercicio en el grupo"
                  onClick={() => onReorderSubitem!(sub.id, 'up')}
                >
                  <ChevronUp className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  disabled={i === grupo.items.length - 1}
                  aria-label="Bajar ejercicio en el grupo"
                  onClick={() => onReorderSubitem!(sub.id, 'down')}
                >
                  <ChevronDown className="size-4" />
                </Button>
              </div>
            ) : null}
            <div className="min-w-0 flex-1">
              {i > 0 ? (
                <p className="my-1 text-center text-xs font-bold text-primary">+</p>
              ) : null}
              <CardEjercicio
                item={sub}
                config={config}
                compact
                catalogTabId={catalogTabId}
                planificationId={planificationId}
                contentVersion={contentVersion}
                progresoAlumno={progresoAlumno}
                materialized={materialized}
                onUpdate={(updated) => onUpdateSubitem(sub.id, updated)}
                onRemove={() => onRemoveSubitem(sub.id)}
                onAdjusted={onAdjusted}
              />
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
