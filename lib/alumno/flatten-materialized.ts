import {
  MaterializedItem,
  MaterializedSectionEntry,
  MaterializedSession,
} from '@/types/planification';
import {
  FlatExerciseRow,
  SessionSectionBlock,
} from '@/types/alumno-session';

function slug(s: string): string {
  return s.toLowerCase().replace(/\s+/g, '-').slice(0, 40);
}

function rowFromItem(
  item: MaterializedItem,
  ctx: {
    sessionNum: number;
    section: { tipoSeccion: FlatExerciseRow['sectionType']; titulo: string };
    index: number;
    grupoLabel?: string;
  },
): FlatExerciseRow {
  const exerciseId =
    item.itemId ??
    `${ctx.sessionNum}-${ctx.section.tipoSeccion}-${ctx.index}-${slug(item.ejercicio)}`;

  return {
    exerciseId,
    name: item.ejercicio,
    valor: item.valor,
    gif: item.gif,
    notas: item.notas,
    tipoItem: item.tipoItem,
    unidadTrabajo: item.unidadTrabajo,
    parametros: item.parametros,
    sectionType: ctx.section.tipoSeccion,
    sectionTitle: ctx.section.titulo,
    grupoLabel: ctx.grupoLabel,
  };
}

function flattenEntry(
  entry: MaterializedSectionEntry,
  ctx: {
    sessionNum: number;
    section: { tipoSeccion: FlatExerciseRow['sectionType']; titulo: string };
    startIndex: number;
  },
): FlatExerciseRow[] {
  if ('kind' in entry && entry.kind === 'group') {
    const label = entry.tipoGrupo === 'biserie' ? 'Biserie' : 'Triserie';
    return entry.items.map((sub, i) =>
      rowFromItem(sub, {
        sessionNum: ctx.sessionNum,
        section: ctx.section,
        index: ctx.startIndex + i,
        grupoLabel: label,
      }),
    );
  }
  return [
    rowFromItem(entry, {
      sessionNum: ctx.sessionNum,
      section: ctx.section,
      index: ctx.startIndex,
    }),
  ];
}

export function flattenSessionToBlocks(
  sesion: MaterializedSession,
): SessionSectionBlock[] {
  const blocks: SessionSectionBlock[] = [];
  let globalIndex = 0;

  for (const grupo of sesion.secciones) {
    const exercises: FlatExerciseRow[] = [];
    for (const entry of grupo.items) {
      const rows = flattenEntry(entry, {
        sessionNum: sesion.numero,
        section: {
          tipoSeccion: grupo.tipoSeccion,
          titulo: grupo.titulo,
        },
        startIndex: globalIndex,
      });
      exercises.push(...rows);
      globalIndex += rows.length;
    }
    if (exercises.length > 0) {
      blocks.push({
        tipoSeccion: grupo.tipoSeccion,
        titulo: grupo.titulo,
        exercises,
      });
    }
  }

  return blocks;
}

export function countSessionExercises(sesion: MaterializedSession): number {
  return flattenSessionToBlocks(sesion).reduce(
    (acc, b) => acc + b.exercises.length,
    0,
  );
}
