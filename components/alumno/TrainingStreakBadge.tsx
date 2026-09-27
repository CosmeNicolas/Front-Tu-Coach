'use client';

import { streakLabel, type TrainingActivitySnapshot } from '@/lib/alumno/training-streak';
import { StreakHeart } from '@/components/alumno/StreakHeart';
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

  return (
    <div
      className={cn(
        'rounded-xl border border-[#547A95] bg-[#2C3947] px-4 py-3 text-[#E8EDF2]',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#E8EDF2]">
          <StreakHeart beat={hasStreak} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#E8EDF2]/70">
            Racha de entrenamiento
          </p>
          <p className="mt-0.5 text-lg font-bold text-[#E8EDF2]">
            {streakLabel(actividad)}
          </p>
          {!compact ? (
            <div className="mt-1 space-y-0.5 text-sm text-[#E8EDF2]/80">
              {actividad.rachaMaxima > actividad.rachaSesiones ? (
                <p>Mejor racha: {actividad.rachaMaxima} sesiones</p>
              ) : null}
              <p>
                Esta semana: {actividad.sesionesSemanaActual}/
                {actividad.sesionesEsperadasSemana} sesiones
              </p>
              {actividad.recordatorioLabel ? (
                <p className="font-medium text-[#547A95]">
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
