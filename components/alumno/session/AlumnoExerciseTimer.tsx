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
  const restDefault = descansoSeg > 0 ? descansoSeg : 60;
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

  // Sincroniza tiempo de trabajo al padre solo cuando cambian los segundos
  // (evita loop: no depender del callback inline del padre).
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

  return (
    <div className="mt-3 rounded-lg border border-border/70 bg-muted/20 p-2.5">
      <div className="mb-2 flex flex-wrap gap-1">
        <ModeTab
          active={mode === 'work'}
          label="Cronómetro"
          onClick={() => setMode('work')}
        />
        <ModeTab
          active={mode === 'rest'}
          label={`Descanso (${restDefault}s)`}
          onClick={() => setMode('rest')}
        />
      </div>

      {mode === 'work' ? (
        <TimerPanel
          label="Tiempo en ejercicio"
          display={formatDuration(work.elapsedSeconds)}
          isRunning={work.isRunning}
          onStart={work.start}
          onPause={() => {
            work.pause();
            onWorkTimeChangeRef.current(work.getSnapshot().elapsedSeconds);
          }}
          onReset={() => {
            work.reset();
            onWorkTimeChangeRef.current(0);
          }}
          canReset={work.elapsedSeconds > 0}
        />
      ) : (
        <TimerPanel
          label="Temporizador de descanso"
          display={formatDuration(rest.remaining)}
          isRunning={rest.isRunning}
          onStart={handleRestStart}
          onPause={handleRestPause}
          onReset={() => {
            rest.reset();
            onRestEnd();
          }}
          canReset={rest.remaining !== restDefault || rest.isRunning}
          disabled={isRestBlocked && !isRestActive}
          hint={
            isRestBlocked && !isRestActive
              ? 'Hay otro descanso en curso'
              : undefined
          }
        />
      )}
    </div>
  );
}

function ModeTab({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-wide transition',
        active
          ? 'bg-primary text-primary-foreground'
          : 'bg-muted text-muted-foreground hover:text-foreground',
      )}
    >
      {label}
    </button>
  );
}

function TimerPanel({
  label,
  display,
  isRunning,
  onStart,
  onPause,
  onReset,
  canReset,
  disabled,
  hint,
}: {
  label: string;
  display: string;
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  canReset: boolean;
  disabled?: boolean;
  hint?: string;
}) {
  return (
    <div className={cn(disabled && 'opacity-50')}>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="font-mono text-xl font-bold tabular-nums text-foreground">
        {display}
      </p>
      {hint ? (
        <p className="text-[10px] text-amber-600 dark:text-amber-400">{hint}</p>
      ) : null}
      <div className="mt-2 flex gap-1">
        {isRunning ? (
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="h-7 px-2"
            onClick={onPause}
          >
            <Pause className="size-3" />
            Pausar
          </Button>
        ) : (
          <Button
            type="button"
            size="sm"
            className="h-7 px-2"
            onClick={onStart}
            disabled={disabled}
          >
            <Play className="size-3" />
            Iniciar
          </Button>
        )}
        {canReset ? (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            onClick={onReset}
          >
            <RotateCcw className="size-3" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}
