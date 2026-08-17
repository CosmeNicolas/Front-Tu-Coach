'use client';

import { ExerciseAlumnoContext } from '@/lib/planification/exercise-progress-context';

interface Props {
  context: ExerciseAlumnoContext | null;
  compact?: boolean;
}

export function ExerciseAlumnoContextBlock({ context, compact }: Props) {
  if (!context) return null;

  const hasLoad = Boolean(context.valor?.trim());
  const hasNote = Boolean(context.alumnoNote);
  const hasSessionComment = Boolean(context.sessionComment);
  const hasRpeNote = Boolean(context.rpeNote);
  if (
    !hasLoad &&
    !hasNote &&
    !hasSessionComment &&
    !hasRpeNote &&
    context.sessionRpe === null
  ) {
    return null;
  }

  const padding = compact ? 'px-2 py-1.5' : 'px-2.5 py-2';

  return (
    <div
      className={`mt-2 space-y-1 rounded-md border border-border bg-muted/40 text-xs ${padding}`}
    >
      {hasLoad ? (
        <p className="text-muted-foreground">
          <span className="font-semibold text-foreground">Última carga</span>
          {context.fechaLabel ? ` · ${context.fechaLabel}` : ''}
          {' · '}
          Sesión {context.sessionNum}
          {' · '}
          <span className="font-medium text-foreground">{context.valor}</span>
          {context.sessionRpe !== null ? ` · RPE ${context.sessionRpe}` : ''}
          {!context.completed ? ' · no marcado hecho' : ''}
        </p>
      ) : (
        <p className="text-muted-foreground">
          <span className="font-semibold text-foreground">Última sesión</span>
          {' · '}
          #{context.sessionNum}
          {context.fechaLabel ? ` · ${context.fechaLabel}` : ''}
          {context.sessionRpe !== null ? ` · RPE ${context.sessionRpe}` : ''}
        </p>
      )}
      {hasSessionComment ? (
        <p className="whitespace-pre-wrap break-words text-muted-foreground">
          <span className="font-semibold text-foreground">
            Comentario general:{' '}
          </span>
          {context.sessionComment}
        </p>
      ) : null}
      {hasRpeNote ? (
        <p className="whitespace-pre-wrap break-words text-muted-foreground">
          <span className="font-semibold text-foreground">Nota RPE: </span>
          {context.rpeNote}
        </p>
      ) : null}
      {hasNote ? (
        <p className="whitespace-pre-wrap break-words text-muted-foreground">
          <span className="font-semibold text-foreground">
            Nota del ejercicio:{' '}
          </span>
          {context.alumnoNote}
        </p>
      ) : null}
    </div>
  );
}
