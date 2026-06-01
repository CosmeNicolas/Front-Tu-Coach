'use client';

import { MaterializedItemGroup } from '@/types/planification';
import { ItemPreviewRow } from './ItemPreviewRow';
import { labelGrupo } from './preview-format';
import { CEMD } from '../constants';

interface Props {
  group: MaterializedItemGroup;
  sessionNum: number;
}

export function GrupoPreviewBlock({ group, sessionNum }: Props) {
  return (
    <div
      className={`rounded-lg border-2 border-primary/40 bg-primary/5 p-3`}
    >
      <p className={`text-xs font-bold uppercase tracking-wide ${CEMD.primaryClass}`}>
        {labelGrupo(group.tipoGrupo)}
      </p>
      <div className="mt-2 space-y-3">
        {group.items.map((sub, i) => (
          <div key={sub.itemId ?? `${group.grupoId}-${i}`}>
            {i > 0 ? (
              <p className="my-1 text-center text-xs font-bold text-primary">
                +
              </p>
            ) : null}
            <ItemPreviewRow
              item={sub}
              sessionNum={sessionNum}
              esParteDeGrupo
            />
          </div>
        ))}
      </div>
    </div>
  );
}
