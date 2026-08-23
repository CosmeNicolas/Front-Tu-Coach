'use client';

import { Pause, Play, RotateCcw, Timer } from 'lucide-react';
import { formatSessionClock } from '@/lib/alumno/format-time';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Props {
  elapsedSeconds: number;
  isRunning: boolean;
  readOnly?: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export function AlumnoSessionStopwatch({
  elapsedSeconds,
  isRunning,
  readOnly = false,
  onStart,
  onPause,
  onReset,
}: Props) {
  return (
    <div
      data-tour="alumno-session-stopwatch"
      className={cn(
        'flex w-full shrink-0 flex-col rounded-xl border border-border bg-muted/30 px-3 py-2 sm:w-auto sm:min-w-[220px]',
        isRunning && 'border-primary/40 bg-primary/5',
      )}
    >
      <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        <Timer className=" text-center size-3.5 shrink-0" aria-hidden />
        Iniciar tiempo de sesión
      </div>

      <div className="flex items-center justify-between gap-3">
        {!readOnly ? (
          <div className="flex shrink-0 items-center gap-1">
            {isRunning ? (
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="h-8 px-2.5"
                onClick={onPause}
                aria-label="Pausar cronómetro de sesión"
              >
                <Pause className="size-3.5" />
                Pausar
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                className="h-8 px-2.5"
                onClick={onStart}
                aria-label="Iniciar cronómetro de sesión"
              >
                <Play className="size-3.5" />
                {elapsedSeconds > 0 ? 'Reanudar' : 'Iniciar'}
              </Button>
            )}
            {elapsedSeconds > 0 ? (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={onReset}
                aria-label="Reiniciar cronómetro de sesión"
              >
                <RotateCcw className="size-3.5" />
              </Button>
            ) : null}
          </div>
        ) : (
          <p className="text-[10px] text-muted-foreground">
            {elapsedSeconds > 0 ? 'Tiempo registrado' : '—'}
          </p>
        )}

        <p
          className="min-w-0 shrink-0 font-mono text-lg font-bold tabular-nums tracking-tight text-foreground sm:text-xl"
          aria-live="polite"
          aria-label={`Tiempo de sesión: ${formatSessionClock(elapsedSeconds)}`}
        >
          {formatSessionClock(elapsedSeconds)}
        </p>
      </div>
    </div>
  );
}
