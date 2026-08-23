'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { useCountdown } from '@/hooks/useCountdown';
import { useStopwatch } from '@/hooks/useStopwatch';
import { formatDuration } from '@/lib/alumno/format-time';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type TimerMode = 'work' | 'rest';

interface Props {
  descansoSeg: number;
  savedWorkSeconds: number;
  savedRestSeconds: number;
  readOnly: boolean;
  isRestBlocked: boolean;
  isRestActive: boolean;
  onWorkTimeChange: (seconds: number) => void;
  onRestTimeChange: (seconds: number) => void;
  onRestStart: () => void;
  onRestEnd: () => void;
}

export function AlumnoExerciseTimer({
  descansoSeg,
  savedWorkSeconds,
  savedRestSeconds,
  readOnly,
  isRestBlocked,
  isRestActive,
  onWorkTimeChange,
  onRestTimeChange,
  onRestStart,
  onRestEnd,
}: Props) {
  const showRest = descansoSeg > 0;
  const restDefault = showRest ? descansoSeg : 60;
  const [mode, setMode] = useState<TimerMode>('work');
  const work = useStopwatch({
    elapsedSeconds: savedWorkSeconds,
    isRunning: false,
  });
  const rest = useCountdown(restDefault);
  const onWorkTimeChangeRef = useRef(onWorkTimeChange);
  const onRestTimeChangeRef = useRef(onRestTimeChange);

  onWorkTimeChangeRef.current = onWorkTimeChange;
  onRestTimeChangeRef.current = onRestTimeChange;

  useEffect(() => {
    onWorkTimeChangeRef.current(work.elapsedSeconds);
  }, [work.elapsedSeconds]);

  function syncRestTime() {
    onRestTimeChangeRef.current(
      savedRestSeconds + rest.getAccumulatedRestSeconds(),
    );
  }

  function handleRestStart() {
    if (isRestBlocked && !isRestActive) return;
    onRestStart();
    rest.start(() => {
      onRestEnd();
      syncRestTime();
    });
  }

  function handleRestPause() {
    rest.pause();
    onRestEnd();
    syncRestTime();
  }

  if (readOnly) {
    const hasTimes = savedWorkSeconds > 0 || savedRestSeconds > 0;
    if (!hasTimes) return null;
    return (
      <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
        {savedWorkSeconds > 0 ? (
          <span className="rounded-md bg-muted px-2 py-1">
            Trabajo: {formatDuration(savedWorkSeconds)}
          </span>
        ) : null}
        {savedRestSeconds > 0 ? (
          <span className="rounded-md bg-muted px-2 py-1">
            Descanso: {formatDuration(savedRestSeconds)}
          </span>
        ) : null}
      </div>
    );
  }

  const isWork = mode === 'work';
  const display = isWork
    ? formatDuration(work.elapsedSeconds)
    : formatDuration(rest.remaining);
  const isRunning = isWork ? work.isRunning : rest.isRunning;
  const disabled = !isWork && isRestBlocked && !isRestActive;
  const canReset = isWork
    ? work.elapsedSeconds > 0
    : rest.remaining !== restDefault || rest.isRunning;

  function handleStart() {
    if (isWork) {
      work.start();
    } else {
      handleRestStart();
    }
  }

  function handlePause() {
    if (isWork) {
      work.pause();
      onWorkTimeChangeRef.current(work.getSnapshot().elapsedSeconds);
    } else {
      handleRestPause();
    }
  }

  function handleReset() {
    if (isWork) {
      work.reset();
      onWorkTimeChangeRef.current(0);
    } else {
      rest.reset();
      onRestEnd();
    }
  }

  return (
    <div className="mt-3 rounded-lg border border-border/70 bg-muted/20 px-2 py-2">
      <div
        className={cn(
          'flex items-center gap-1.5 sm:gap-2',
          disabled && 'opacity-50',
        )}
      >
        <SegmentedMode
          mode={mode}
          showRest={showRest}
          restDefault={restDefault}
          onWork={() => setMode('work')}
          onRest={() => setMode('rest')}
        />

        <p
          className="min-w-[3.5rem] flex-1 text-center font-mono text-base font-bold tabular-nums leading-none text-foreground"
          aria-live="polite"
          aria-label={`Tiempo: ${display}`}
        >
          {display}
        </p>

        {isRunning ? (
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="h-8 shrink-0 px-2.5 text-xs"
            onClick={handlePause}
          >
            <Pause className="size-3.5" />
            <span className="hidden min-[380px]:inline">Pausar</span>
          </Button>
        ) : (
          <Button
            type="button"
            size="sm"
            className="h-8 shrink-0 px-2.5 text-xs"
            onClick={handleStart}
            disabled={disabled}
          >
            <Play className="size-3.5" />
            Iniciar
          </Button>
        )}

        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="h-8 w-8 shrink-0 p-0"
          onClick={handleReset}
          disabled={!canReset}
          aria-label="Reiniciar cronómetro"
        >
          <RotateCcw className="size-3.5" />
        </Button>
      </div>

      {disabled ? (
        <p className="mt-1 text-center text-[10px] text-amber-600 dark:text-amber-400">
          Hay otro descanso en curso
        </p>
      ) : null}
    </div>
  );
}

function SegmentedMode({
  mode,
  showRest,
  restDefault,
  onWork,
  onRest,
}: {
  mode: TimerMode;
  showRest: boolean;
  restDefault: number;
  onWork: () => void;
  onRest: () => void;
}) {
  return (
    <div className="flex shrink-0 overflow-hidden rounded-md border border-border text-[10px] font-semibold leading-none">
      <button
        type="button"
        onClick={onWork}
        className={cn(
          'px-2 py-2 transition',
          mode === 'work'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted/40 text-muted-foreground hover:text-foreground',
        )}
      >
        Cronó
      </button>
      {showRest ? (
        <button
          type="button"
          onClick={onRest}
          className={cn(
            'border-l border-border px-2 py-2 transition',
            mode === 'rest'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted/40 text-muted-foreground hover:text-foreground',
          )}
        >
          Desc {restDefault}s
        </button>
      ) : null}
    </div>
  );
}
