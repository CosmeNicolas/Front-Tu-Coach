'use client';

import { Flame } from 'lucide-react';
import { streakLabel, type TrainingActivitySnapshot } from '@/lib/alumno/training-streak';
import { cn } from '@/lib/utils/cn';

interface Props {
  actividad: TrainingActivitySnapshot;
  compact?: boolean;
  className?: string;
}

export function TrainingStreakBadge({
  actividad,
  compact = false,
  className,
}: Props) {
  const hasStreak = actividad.rachaSesiones > 0;
  const alert = actividad.necesitaRecordatorio;

  return (
    <div
      className={cn(
        'rounded-xl border px-4 py-3',
        alert
          ? 'border-amber-500/30 bg-amber-500/10'
          : hasStreak
            ? 'border-orange-500/30 bg-orange-500/10'
            : 'border-border bg-muted/30',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-full',
            hasStreak ? 'bg-orange-500/15 text-orange-600' : 'bg-muted text-muted-foreground',
          )}
        >
          <Flame className="size-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Racha de entrenamiento
          </p>
          <p className="mt-0.5 text-lg font-bold text-foreground">
            {streakLabel(actividad)}
          </p>
          {!compact ? (
            <div className="mt-1 space-y-0.5 text-sm text-muted-foreground">
              {actividad.rachaMaxima > actividad.rachaSesiones ? (
                <p>Mejor racha: {actividad.rachaMaxima} sesiones</p>
              ) : null}
              <p>
                Esta semana: {actividad.sesionesSemanaActual}/
                {actividad.sesionesEsperadasSemana} sesiones
              </p>
              {actividad.recordatorioLabel ? (
                <p className="font-medium text-amber-700 dark:text-amber-300">
                  {actividad.recordatorioLabel}
                </p>
              ) : actividad.diasDesdeUltimaSesion === 0 ? (
                <p>Entrenaste hoy — seguí sumando.</p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
