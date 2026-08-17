'use client';

import { MessageSquareText } from 'lucide-react';
import { UltimaSesionFeedback } from '@/lib/planification/exercise-progress-context';

interface Props {
  feedback: UltimaSesionFeedback;
  title?: string;
  compact?: boolean;
  showExerciseNotesHint?: boolean;
}

export function hasAlumnoFeedbackContent(
  feedback: UltimaSesionFeedback | null | undefined,
): feedback is UltimaSesionFeedback {
  if (!feedback) return false;
  return Boolean(
    feedback.sessionComment ||
      feedback.rpeNote ||
      feedback.rpe !== null ||
      feedback.exerciseNotesCount > 0,
  );
}

export function AlumnoFeedbackResumen({
  feedback,
  title,
  compact,
  showExerciseNotesHint,
}: Props) {
  const {
    sessionNum,
    fechaLabel,
    rpe,
    rpeNote,
    sessionComment,
    exerciseNotesCount,
  } = feedback;

  const heading =
    title ??
    `Sesión ${sessionNum}${fechaLabel ? ` · ${fechaLabel}` : ''}${rpe !== null ? ` · RPE ${rpe}` : ''}`;

  return (
    <div className={compact ? 'space-y-1' : 'space-y-1.5'}>
      <p
        className={`flex items-center gap-2 font-semibold text-foreground ${compact ? 'text-xs' : 'text-sm'}`}
      >
        <MessageSquareText className="size-3.5 shrink-0" />
        {heading}
      </p>
      {sessionComment ? (
        <p
          className={`whitespace-pre-wrap break-words text-muted-foreground ${compact ? 'text-xs' : 'text-sm'}`}
        >
          <span className="font-semibold text-foreground">
            Comentario general:{' '}
          </span>
          {sessionComment}
        </p>
      ) : null}
      {rpeNote ? (
        <p
          className={`whitespace-pre-wrap break-words text-muted-foreground ${compact ? 'text-xs' : 'text-sm'}`}
        >
          <span className="font-semibold text-foreground">Nota RPE: </span>
          {rpeNote}
        </p>
      ) : null}
      {showExerciseNotesHint && exerciseNotesCount > 0 ? (
        <p className="text-xs text-muted-foreground">
          {exerciseNotesCount} nota{exerciseNotesCount === 1 ? '' : 's'} en
          ejercicios
        </p>
      ) : null}
    </div>
  );
}
