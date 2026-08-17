'use client';

import Link from 'next/link';
import { UltimaSesionFeedback } from '@/lib/planification/exercise-progress-context';
import { Button } from '@/components/ui/button';
import {
  AlumnoFeedbackResumen,
} from '@/components/planificaciones/shared/AlumnoFeedbackResumen';

interface Props {
  feedback: UltimaSesionFeedback;
  planificationId: string;
}

export function AsistenteUltimaSesionBanner({
  feedback,
  planificationId,
}: Props) {
  const title = `Última sesión del alumno · #${feedback.sessionNum}${feedback.fechaLabel ? ` · ${feedback.fechaLabel}` : ''}${feedback.rpe !== null ? ` · RPE ${feedback.rpe}` : ''}`;

  return (
    <div className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-2.5 text-sm text-sky-950 dark:border-sky-900/50 dark:bg-sky-950/40 dark:text-sky-100">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <AlumnoFeedbackResumen feedback={feedback} title={title} />
          {feedback.exerciseNotesCount > 0 ? (
            <p className="mt-1.5 text-xs text-muted-foreground">
              {feedback.exerciseNotesCount} nota
              {feedback.exerciseNotesCount === 1 ? '' : 's'} en ejercicios
              (visible en cada card ↓)
            </p>
          ) : null}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 border-sky-300 bg-background/80 hover:bg-background dark:border-sky-800"
          asChild
        >
          <Link href={`/profesor/planificaciones/${planificationId}`}>
            Ver todo
          </Link>
        </Button>
      </div>
    </div>
  );
}
