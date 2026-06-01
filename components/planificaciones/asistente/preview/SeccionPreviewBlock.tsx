'use client';

import {
  MaterializedSectionEntry,
  MaterializedSectionGroup,
  TipoSeccion,
} from '@/types/planification';
import { ItemPreviewRow } from './ItemPreviewRow';
import { GrupoPreviewBlock } from './GrupoPreviewBlock';
import { iconoSeccion } from './preview-format';
import { CEMD } from '../constants';

interface Props {
  grupo: MaterializedSectionGroup;
  sessionNum: number;
  compact?: boolean;
}

function PreviewEntry({
  entry,
  sessionNum,
}: {
  entry: MaterializedSectionEntry;
  sessionNum: number;
}) {
  if ('kind' in entry && entry.kind === 'group') {
    return <GrupoPreviewBlock group={entry} sessionNum={sessionNum} />;
  }
  return <ItemPreviewRow item={entry} sessionNum={sessionNum} />;
}

export function SeccionPreviewBlock({ grupo, sessionNum, compact }: Props) {
  if (grupo.items.length === 0) return null;

  const esFija =
    grupo.tipoSeccion === TipoSeccion.CALENTAMIENTO ||
    grupo.tipoSeccion === TipoSeccion.VUELTA_CALMA;

  return (
    <div className="space-y-2">
      <h4
        className={`text-xs font-bold uppercase tracking-wide ${CEMD.primaryClass}`}
      >
        {iconoSeccion(grupo.tipoSeccion)} {grupo.titulo}
        {esFija ? (
          <span className="ml-1 font-normal normal-case text-zinc-500">
            (todas las sesiones)
          </span>
        ) : null}
      </h4>
      <div className={`space-y-3 ${compact ? '' : ''}`}>
        {grupo.items.map((entry, j) => (
          <PreviewEntry key={j} entry={entry} sessionNum={sessionNum} />
        ))}
      </div>
    </div>
  );
}
