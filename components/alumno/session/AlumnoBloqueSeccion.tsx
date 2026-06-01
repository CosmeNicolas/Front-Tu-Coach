'use client';

import { useState } from 'react';
import { iconoSeccion } from '@/components/planificaciones/asistente/preview/preview-format';
import { AlumnoEjercicioCard } from './AlumnoEjercicioCard';
import { SessionSectionBlock } from '@/types/alumno-session';
import { ExerciseExecutionState } from '@/types/alumno-session';
import { TipoSeccion } from '@/types/planification';

interface Props {
  block: SessionSectionBlock;
  exerciseStates: ExerciseExecutionState[];
  readOnly: boolean;
  defaultOpen?: boolean;
  onToggle: (exerciseId: string, completed: boolean) => void;
  onNote: (exerciseId: string, note: string) => void;
}

const SECTION_LABEL: Record<TipoSeccion, string> = {
  [TipoSeccion.CALENTAMIENTO]: 'Entrada en calor',
  [TipoSeccion.PRINCIPAL]: 'Principal',
  [TipoSeccion.VUELTA_CALMA]: 'Vuelta a la calma',
};

export function AlumnoBloqueSeccion({
  block,
  exerciseStates,
  readOnly,
  defaultOpen = true,
  onToggle,
  onNote,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const done = exerciseStates.filter((e) => e.completed).length;
  const total = exerciseStates.length;
  const label = SECTION_LABEL[block.tipoSeccion] ?? block.titulo;

  return (
    <details
      open={open}
      onToggle={(e) => setOpen(e.currentTarget.open)}
      className="group rounded-xl border border-border bg-card shadow-sm"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {iconoSeccion(block.tipoSeccion)} {label}
          </p>
          <p className="truncate text-sm text-muted-foreground">{block.titulo}</p>
        </div>
        <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
          {done}/{total}
        </span>
      </summary>

      <div className="space-y-3 border-t border-border px-3 py-3">
        {block.exercises.map((ex) => {
          const state = exerciseStates.find((s) => s.exerciseId === ex.exerciseId);
          if (!state) return null;
          return (
            <AlumnoEjercicioCard
              key={ex.exerciseId}
              exercise={ex}
              state={state}
              readOnly={readOnly}
              onToggle={(c) => onToggle(ex.exerciseId, c)}
              onNote={(n) => onNote(ex.exerciseId, n)}
            />
          );
        })}
      </div>
    </details>
  );
}
