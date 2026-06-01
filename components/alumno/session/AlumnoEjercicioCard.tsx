'use client';

import { Check } from 'lucide-react';
import { EjercicioCatalogoImage } from '@/components/ejercicios/EjercicioCatalogoImage';
import {
  exerciseUsesSeconds,
  parseExerciseParams,
} from '@/lib/alumno/parse-valor';
import { cn } from '@/lib/utils';
import { FlatExerciseRow, ExerciseExecutionState } from '@/types/alumno-session';

interface Props {
  exercise: FlatExerciseRow;
  state: ExerciseExecutionState;
  readOnly: boolean;
  onToggle: (completed: boolean) => void;
  onNote: (note: string) => void;
}

export function AlumnoEjercicioCard({
  exercise,
  state,
  readOnly,
  onToggle,
  onNote,
}: Props) {
  const parsed = parseExerciseParams(
    exercise.valor,
    exercise.tipoItem,
    exercise.unidadTrabajo,
    exercise.parametros,
  );
  const inSeconds = exerciseUsesSeconds(
    exercise.tipoItem,
    exercise.unidadTrabajo,
  );

  return (
    <article
      className={cn(
        'overflow-hidden rounded-xl border bg-card transition',
        state.completed ? 'border-primary/40 bg-primary/5' : 'border-border',
        readOnly && 'opacity-95',
      )}
    >
      <div className="flex flex-col sm:flex-row sm:gap-4">
        <div className="relative w-full shrink-0 sm:w-32 md:w-36">
          <div
            className={cn(
              'ejercicio-gif-fondo relative w-full overflow-hidden',
              'min-h-[200px] sm:min-h-0 sm:aspect-square',
              'rounded-t-xl sm:rounded-xl sm:border sm:border-border',
            )}
          >
            <EjercicioCatalogoImage
              src={exercise.gif}
              alt={exercise.name}
              containerClassName="h-full min-h-[200px] sm:min-h-[128px]"
              className="h-full min-h-[200px] w-full object-contain object-center p-1 sm:min-h-[128px]"
            />

            {!readOnly ? (
              <label className="absolute left-3 top-3 z-10 cursor-pointer">
                <input
                  type="checkbox"
                  checked={state.completed}
                  onChange={(e) => onToggle(e.target.checked)}
                  className="peer sr-only"
                  aria-label={`Marcar ${exercise.name} como realizado`}
                />
                <span
                  className={cn(
                    'flex size-10 items-center justify-center rounded-lg border-2 shadow-md backdrop-blur-sm transition',
                    'border-background/80 bg-background/90',
                    'peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground',
                    'peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2',
                  )}
                >
                  <Check
                    className={cn(
                      'size-5 ',
                      state.completed ? 'opacity-100' : 'opacity-0',
                    )}
                    aria-hidden
                  />
                </span>
              </label>
            ) : (
              <span
                className={cn(
                  'absolute left-3 top-3 z-10 flex size-10 items-center justify-center rounded-lg border-2 text-sm font-bold shadow-md backdrop-blur-sm',
                  state.completed
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background/90 text-muted-foreground',
                )}
                aria-hidden
              >
                {state.completed ? '✓' : '·'}
              </span>
            )}
          </div>
        </div>

        <div className="min-w-0 flex-1 p-4 sm:py-4 sm:pr-4 sm:pl-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold leading-tight text-foreground">
              {exercise.name}
            </h3>
            {exercise.grupoLabel ? (
              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                {exercise.grupoLabel}
              </span>
            ) : null}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {parsed.pesoKg ? (
              <MetricChip label="Peso" value={`${parsed.pesoKg} kg`} />
            ) : null}
            {parsed.series ? (
              <MetricChip label="Series" value={parsed.series} />
            ) : null}
            {!inSeconds && parsed.reps ? (
              <MetricChip label="Reps" value={parsed.reps} />
            ) : null}
            {parsed.minutos ? (
              <MetricChip label="Min" value={parsed.minutos} />
            ) : null}
            {parsed.segundos ? (
              <MetricChip
                label={inSeconds ? 'Segundos' : 'Seg'}
                value={parsed.segundos}
              />
            ) : null}
            {!parsed.pesoKg &&
            !parsed.series &&
            !parsed.reps &&
            !parsed.minutos &&
            !parsed.segundos ? (
              <MetricChip label="Trabajo" value={parsed.display} />
            ) : null}
          </div>

          {exercise.notas?.trim() ? (
            <p className="mt-3 rounded-md border border-border bg-muted px-2 py-1.5 text-xs text-muted-foreground">
              <span className="font-semibold">Coach: </span>
              {exercise.notas}
            </p>
          ) : null}

          {!readOnly ? (
            <label className="mt-3 block">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Tu nota (opcional)
              </span>
              <input
                type="text"
                value={state.note}
                onChange={(e) => onNote(e.target.value)}
                maxLength={300}
                placeholder="Ej: subí peso, me costó…"
                className="mt-1 w-full rounded-lg border border-input bg-background px-2.5 py-1.5 text-sm"
              />
            </label>
          ) : state.note ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Tu nota: {state.note}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function MetricChip({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex flex-col rounded-lg bg-muted px-2.5 py-1 text-center">
      <span className="text-[9px] font-semibold uppercase text-muted-foreground">
        {label}
      </span>
      <span className="text-sm font-bold text-foreground">{value}</span>
    </span>
  );
}
