'use client';

import { forwardRef } from 'react';
import type { SessionShareStats } from '@/lib/alumno/session-share';
import {
  formatShareDuration,
  formatShareVolume,
  splitShareName,
} from '@/lib/alumno/session-share';
import { PROFESSOR_FALLBACK_PHOTO } from '@/lib/api/professor-catalog';

type Props = {
  stats: SessionShareStats;
};

/** Card visual 3:4 para capturar y compartir (Stories / WhatsApp). */
export const AlumnoSessionShareCard = forwardRef<HTMLDivElement, Props>(
  function AlumnoSessionShareCard({ stats }, ref) {
    const { primary, secondary } = splitShareName(stats.displayName);

    return (
      <div
        ref={ref}
        className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#0a0a0a] text-white shadow-lg"
        style={{ width: 360, height: 480 }}
      >
        <div className="pointer-events-none absolute -right-10 top-8 size-32 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-12 -left-8 size-36 rounded-full bg-white/[0.04]" />

        <div className="relative flex h-full">
          <div className="relative h-full w-[52%] shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PROFESSOR_FALLBACK_PHOTO}
              alt=""
              className="absolute inset-0 size-full object-cover object-left"
              crossOrigin="anonymous"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-r from-transparent to-[#0a0a0a]" />
          </div>

          <div className="relative z-10 flex min-w-0 flex-1 flex-col justify-between py-4 pr-3 pl-1">
            <div className="flex flex-col items-end gap-2">
              <p
                className="font-display text-[1.45rem] font-bold leading-[0.88] tracking-wide text-white"
                style={{
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                }}
              >
                {primary}
              </p>
              {secondary ? (
                <p
                  className="font-display text-[1.45rem] font-bold leading-[0.88] tracking-wide text-white"
                  style={{
                    writingMode: 'vertical-rl',
                    transform: 'rotate(180deg)',
                  }}
                >
                  {secondary}
                </p>
              ) : null}
            </div>

            <div className="space-y-2 text-right">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a3a3a3]">
                ¡Felicidades!
              </p>
              <p className="font-display text-lg leading-tight tracking-wide text-white">
                Sesión {stats.sessionNum}
                <span className="text-[#a3a3a3]">
                  /{stats.totalSesiones}
                </span>
              </p>
              <ul className="space-y-1 text-xs text-[#d4d4d4]">
                <li>
                  Tiempo{' '}
                  <span className="font-semibold text-white">
                    {formatShareDuration(stats.durationSeconds)}
                  </span>
                </li>
                <li>
                  Volumen{' '}
                  <span className="font-semibold text-white">
                    {formatShareVolume(stats.totalVolumeKg)}
                  </span>
                </li>
                {stats.rpe != null ? (
                  <li>
                    RPE{' '}
                    <span className="font-semibold text-white">
                      {stats.rpe}/10
                    </span>
                  </li>
                ) : null}
              </ul>
              <p className="pt-1 text-[10px] uppercase tracking-[0.2em] text-[#737373]">
                TuCoach
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
