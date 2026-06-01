'use client';

import {
  Planification,
  PlanificationConfig,
  PlanificationItemGroup,
  PlanificationItemSingle,
} from '@/types/planification';
import { CardEjercicio } from './CardEjercicio';
import { CEMD } from './constants';

interface Props {
  grupo: PlanificationItemGroup;
  config: PlanificationConfig;
  planificationId?: string;
  contentVersion?: number;
  modoSeleccion?: boolean;
  onUpdateSubitem: (subId: string, item: PlanificationItemSingle) => void;
  onRemoveSubitem: (subId: string) => void;
  onDesagrupar: () => void;
  onAdjusted?: (planification: Planification) => void;
}

export function CardGrupoEjercicio({
  grupo,
  config,
  planificationId,
  contentVersion,
  modoSeleccion,
  onUpdateSubitem,
  onRemoveSubitem,
  onDesagrupar,
  onAdjusted,
}: Props) {
  const label = grupo.tipoGrupo === 'biserie' ? 'Biserie' : 'Triserie';

  return (
    <article
      className={`rounded-lg border-2 border-primary bg-primary/5 shadow-sm`}
    >
      <header className="flex items-center justify-between gap-2 border-b border-primary/30 px-4 py-2">
        <div>
          <h4 className={`text-sm font-bold ${CEMD.primaryClass}`}>{label}</h4>
          <p className="text-xs text-zinc-500">
            {grupo.items.length} ejercicios · progresión individual
          </p>
        </div>
        {!modoSeleccion ? (
          <button
            type="button"
            onClick={onDesagrupar}
            className="rounded px-2 py-1 text-xs text-zinc-600 hover:bg-white"
          >
            Desagrupar
          </button>
        ) : null}
      </header>
      <div className="space-y-2 p-3">
        {grupo.items.map((sub, i) => (
          <div key={sub.id}>
            {i > 0 ? (
              <p className="my-1 text-center text-xs font-bold text-primary">+</p>
            ) : null}
            <CardEjercicio
              item={sub}
              config={config}
              compact
              planificationId={planificationId}
              contentVersion={contentVersion}
              onUpdate={(updated) => onUpdateSubitem(sub.id, updated)}
              onRemove={() => onRemoveSubitem(sub.id)}
              onAdjusted={onAdjusted}
            />
          </div>
        ))}
      </div>
    </article>
  );
}
