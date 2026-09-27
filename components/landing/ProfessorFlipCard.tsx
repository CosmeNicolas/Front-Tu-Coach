'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AtSign, Globe, MapPin, RotateCcw } from 'lucide-react';
import type { PublicProfessor } from '@/lib/api/professor-catalog';
import {
  PROFESSOR_FALLBACK_PHOTO,
  professorPhotoSrc,
} from '@/lib/api/professor-catalog';
import { cn } from '@/lib/utils';

function splitDisplayName(name: string): { primary: string; secondary: string } {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) {
    return { primary: (parts[0] ?? 'Coach').toUpperCase(), secondary: '' };
  }
  const mid = Math.ceil(parts.length / 2);
  return {
    primary: parts.slice(0, mid).join(' ').toUpperCase(),
    secondary: parts.slice(mid).join(' ').toUpperCase(),
  };
}

function modalityLabel(prof: PublicProfessor) {
  if (prof.modalidadOnline && prof.modalidadPresencial) {
    return 'Online y presencial';
  }
  if (prof.modalidadOnline) return 'Online';
  if (prof.modalidadPresencial) return 'Presencial';
  return 'Profesor';
}

export function ProfessorFlipCard({
  prof,
  className,
}: {
  prof: PublicProfessor;
  className?: string;
}) {
  const [flipped, setFlipped] = useState(false);
  const { primary, secondary } = splitDisplayName(prof.displayName);
  const photo = professorPhotoSrc(prof.fotoUrl);
  const hasCustomPhoto = Boolean(prof.fotoUrl?.trim());
  const tags = [...(prof.especialidades ?? [])].slice(0, 4);

  return (
    <div className={cn('mx-auto w-full max-w-[280px]', className)}>
      <div className="relative w-full" style={{ perspective: '1200px' }}>
        <div
          role="button"
          tabIndex={0}
          aria-pressed={flipped}
          aria-label={
            flipped
              ? `Volver a la foto de ${prof.displayName}`
              : `Ver datos de ${prof.displayName}`
          }
          onClick={() => setFlipped((v) => !v)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setFlipped((v) => !v);
            }
          }}
          className="relative w-full cursor-pointer text-left outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          style={{ aspectRatio: '3 / 4' }}
        >
          <div
            className="relative h-full w-full transition-transform duration-500 ease-out"
            style={{
              transformStyle: 'preserve-3d',
              transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* FRONT — negro / zorro mitad a toda la altura + foto en cuadrado centrado */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl border border-white/15 bg-[#0a0a0a] shadow-lg [backface-visibility:hidden]">
              <div className="pointer-events-none absolute -left-10 -top-8 size-40 rounded-full bg-white/5" />
              <div className="pointer-events-none absolute -right-8 top-10 size-28 rounded-full bg-white/[0.04]" />

              {/* Logo chiquito — esquina superior derecha */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/branding/LGO600PX.png"
                alt=""
                aria-hidden
                className="pointer-events-none absolute right-2.5 top-2.5 z-30 size-8 object-contain opacity-90 sm:size-9"
              />

              <div className="relative flex h-full">
                <div className="relative h-full w-[58%] shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={PROFESSOR_FALLBACK_PHOTO}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 size-full object-cover object-left"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-r from-transparent to-[#0a0a0a]" />
                </div>

                <div className="relative z-10 flex flex-1 flex-col items-end justify-center gap-3 pr-3">
                  <p
                    className="max-h-[72%] overflow-hidden font-display text-[1.55rem] font-bold leading-[0.88] tracking-wide text-white sm:text-[1.75rem]"
                    style={{
                      writingMode: 'vertical-rl',
                      transform: 'rotate(180deg)',
                    }}
                  >
                    {primary}
                  </p>
                  {secondary ? (
                    <p
                      className="max-h-[72%] overflow-hidden font-display text-[1.55rem] font-bold leading-[0.88] tracking-wide text-white sm:text-[1.75rem]"
                      style={{
                        writingMode: 'vertical-rl',
                        transform: 'rotate(180deg)',
                      }}
                    >
                      {secondary}
                    </p>
                  ) : null}
                </div>
              </div>

              {hasCustomPhoto ? (
                <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
                  <div className="size-[38%] overflow-hidden rounded-xl border-2 border-white/80 bg-[#141414] shadow-[0_8px_28px_rgba(0,0,0,0.55)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo}
                      alt=""
                      aria-hidden
                      className="size-full object-cover object-center"
                    />
                  </div>
                </div>
              ) : null}

              <span className="absolute bottom-2 right-2 z-30 inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/90 backdrop-blur-sm">
                <RotateCcw className="size-3" aria-hidden />
                Tocá
              </span>
            </div>

            {/* BACK — gris oscuro / blanco */}
            <div
              className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#141414] p-5 text-white shadow-lg [backface-visibility:hidden]"
              style={{ transform: 'rotateY(180deg)' }}
            >
              <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-white/5" />
              <div className="pointer-events-none absolute -bottom-10 -left-6 size-28 rounded-full bg-white/[0.04]" />

              {/* Logo chiquito — esquina superior derecha */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/branding/LGO600PX.png"
                alt=""
                aria-hidden
                className="pointer-events-none absolute right-2.5 top-2.5 z-20 size-8 object-contain opacity-90 sm:size-9"
              />

              <div className="relative min-h-0 flex-1 space-y-3 overflow-y-auto pr-10">
                <div>
                  <h3 className="font-display text-2xl uppercase tracking-wide text-white">
                    {prof.displayName}
                  </h3>
                  <p className="mt-0.5 text-sm text-[#a3a3a3]">
                    {modalityLabel(prof)}
                  </p>
                </div>

                {prof.bio ? (
                  <p className="line-clamp-4 text-sm leading-relaxed text-[#d4d4d4]">
                    {prof.bio}
                  </p>
                ) : null}

                {tags.length ? (
                  <ul className="flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[11px] text-[#e5e5e5]"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                ) : null}

                <ul className="space-y-2 pt-1 text-sm text-[#d4d4d4]">
                  {prof.ubicacion ? (
                    <li className="flex items-start gap-2">
                      <MapPin className="mt-0.5 size-3.5 shrink-0 text-[#a3a3a3]" aria-hidden />
                      <span>{prof.ubicacion}</span>
                    </li>
                  ) : null}
                  {prof.redes.instagram ? (
                    <li className="flex items-start gap-2">
                      <AtSign
                        className="mt-0.5 size-3.5 shrink-0 text-[#a3a3a3]"
                        aria-hidden
                      />
                      <span className="break-all">{prof.redes.instagram}</span>
                    </li>
                  ) : null}
                  {prof.redes.website ? (
                    <li className="flex items-start gap-2">
                      <Globe className="mt-0.5 size-3.5 shrink-0 text-[#a3a3a3]" aria-hidden />
                      <span className="break-all">{prof.redes.website}</span>
                    </li>
                  ) : null}
                </ul>
              </div>

              <div
                className="relative mt-3"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              >
                <Link
                  href={`/profesores/${prof.slug}`}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-white px-3 py-2.5 text-sm font-semibold text-black transition hover:bg-[#e5e5e5]"
                >
                  Ver perfil completo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
