'use client';

import Link from 'next/link';
import { CheckCircle2, ChevronRight, Circle, PlayCircle } from 'lucide-react';
import {
  isSessionCompleted,
  sessionRpe,
  StudentMaterializedPlanification,
} from '@/lib/api/student-portal';
import { countSessionExercises } from '@/lib/alumno/flatten-materialized';
import { formatSessionClock } from '@/lib/alumno/format-time';
import { cn } from '@/lib/utils/cn';

interface Props {
  planificationId: string;
  materialized: StudentMaterializedPlanification;
  highlightSession?: number;
}

export function AlumnoPlanificacionVertical({
  materialized,
  highlightSession,
}: Props) {
  const { progreso, totalSesiones, sesiones } = materialized;

  return (
    <ul className="flex flex-col gap-3">
      {Array.from({ length: totalSesiones }, (_, i) => i + 1).map((n) => {
        const done = isSessionCompleted(progreso, n);
        const rpe = sessionRpe(progreso, n);
        const active = highlightSession === n;
        const sesion = sesiones.find((s) => s.numero === n);
        const ejercicios = sesion ? countSessionExercises(sesion) : 0;
        const det = progreso.detallePorSesion[String(n)];
        const hechos = det?.exercises?.filter((e) => e.completed).length ?? 0;
        const duracion = det?.sessionDurationSeconds ?? 0;

        return (
          <li key={n}>
            <Link
              href={`/alumno/sesiones/${n}`}
              className={cn(
                'flex min-h-[4.5rem] items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition active:scale-[0.99]',
                'hover:border-primary/40 hover:bg-accent/20',
                active && 'border-primary ring-2 ring-primary/30',
                done && !active && 'border-border',
              )}
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted">
                {done ? (
                  <CheckCircle2
                    className="size-6 text-foreground"
                    aria-hidden
                  />
                ) : active ? (
                  <PlayCircle className="size-6 text-primary" aria-hidden />
                ) : (
                  <Circle className="size-6 text-muted-foreground" aria-hidden />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-base font-semibold text-foreground">
                  Sesión {n}
                </span>
                <span className="mt-0.5 block text-sm text-muted-foreground">
                  {ejercicios > 0
                    ? `${hechos}/${ejercicios} ejercicios`
                    : 'Sin ejercicios'}
                  {done && rpe ? ` · RPE ${rpe}` : ''}
                  {done && duracion > 0
                    ? ` · ${formatSessionClock(duracion)}`
                    : ''}
                </span>
              </span>
              <span className="flex shrink-0 flex-col items-end gap-1">
                <span
                  className={cn(
                    'rounded-full px-2.5 py-1 text-xs font-medium',
                    done
                      ? 'bg-muted text-foreground'
                      : active
                        ? 'bg-primary/15 text-primary'
                        : 'bg-muted text-muted-foreground',
                  )}
                >
                  {done ? 'Completada' : active ? 'Siguiente' : 'Pendiente'}
                </span>
                <ChevronRight
                  className="size-5 text-muted-foreground"
                  aria-hidden
                />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
