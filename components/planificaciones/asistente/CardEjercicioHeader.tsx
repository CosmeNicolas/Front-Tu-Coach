'use client';

import { PlanificationItem } from '@/types/planification';
import { CEMD } from './constants';
import { lineaProgresion } from './card-ejercicio-defaults';

interface Props {
  item: PlanificationItem;
  editing: boolean;
}

export function CardEjercicioHeader({ item, editing }: Props) {
  const linea = lineaProgresion(item);

  return (
    <div className="min-w-0">
      <h4
        className={`truncate font-semibold ${CEMD.primaryClass}`}
        title={item.ejercicio}
      >
        {item.ejercicio}
      </h4>
      {!editing ? (
        <p className="mt-0.5 text-sm text-zinc-600">{linea}</p>
      ) : null}
      {item.notas && !editing ? (
        <p className="mt-1 text-xs text-zinc-500">📝 {item.notas}</p>
      ) : null}
    </div>
  );
}
