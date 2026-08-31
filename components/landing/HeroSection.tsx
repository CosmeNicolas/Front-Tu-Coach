'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Play } from 'lucide-react';
import Image from 'next/image';
import { LANDING_CONTAINER, REGISTRO_ROUTE, TRIAL_DAYS } from '@/lib/landing/constants';
import { LandingButton } from '@/components/landing/LandingButton';
import { ScrollReveal } from '@/components/landing/ScrollReveal';

const HERO_PROFESORES = [
  { src: '/profesoresimg/Alexis.png', alt: 'Alexis, entrenador en TuCoach' },
  { src: '/profesoresimg/SOFI.png', alt: 'Sofi, entrenadora en TuCoach' },
] as const;

function HeroMockups() {
  const reduced = useReducedMotion();

  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      {/* Brillo de fondo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-8 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_65%)] blur-2xl"
      />

      {/* Mockup principal — captura real del portal alumno */}
      <motion.div
        className="relative z-10 mx-auto w-[58%] max-w-[220px] sm:max-w-[240px]"
        animate={reduced ? undefined : { y: [0, -6, 0] }}
        transition={reduced ? undefined : { duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="overflow-hidden rounded-[1.35rem] border border-white/15 bg-[#101010] shadow-[0_24px_80px_rgba(0,0,0,0.6)] ring-1 ring-white/10 aspect-[9/19]">
          <Image
            src="/landing/alumno-inicio.png"
            alt="Vista del portal alumno en TuCoach"
            width={390}
            height={844}
            className="h-full w-full object-cover object-top"
            priority
          />
        </div>
      </motion.div>

      {/* Mockup secundario — seguimiento del plan / detalle */}
      <motion.div
        className="absolute -right-2 top-8 z-20 w-[42%] max-w-[170px] sm:-right-4 sm:top-10"
        animate={reduced ? undefined : { y: [0, 8, 0] }}
        transition={reduced ? undefined : { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      >
        <div className="overflow-hidden rounded-[1.25rem] border border-white/15 bg-[#101010] shadow-[0_16px_48px_rgba(0,0,0,0.5)] ring-1 ring-white/15 aspect-[9/19]">
          <Image
            src="/landing/alumno-seguimiento.png"
            alt="Vista de seguimiento del alumno en TuCoach"
            width={390}
            height={844}
            className="h-full w-full object-cover object-top"
          />
        </div>
      </motion.div>

      {/* Tarjeta flotante — asistente */}
      <motion.div
        className="absolute -left-2 bottom-16 z-30 w-[56%] max-w-[220px] sm:-left-6 sm:bottom-20"
        animate={reduced ? undefined : { y: [0, -5, 0] }}
        transition={reduced ? undefined : { duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        <div className="overflow-hidden rounded-xl border border-white/15 bg-[#141414] shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
          <p className="border-b border-white/10 px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-wider text-[#737373]">
            Asistente
          </p>
          <div className="relative aspect-[16/11]">
            <Image
              src="/landing/asistente-ejercicios-crop.png"
              alt="Asistente de planificación de TuCoach"
              fill
              className="object-cover object-top"
              sizes="220px"
            />
          </div>
        </div>
      </motion.div>

      {/* Tarjeta flotante — métricas */}
      <motion.div
        className="absolute -right-1 bottom-4 z-30 w-[52%] max-w-[200px] sm:-right-4 sm:bottom-6"
        animate={reduced ? undefined : { y: [0, 6, 0] }}
        transition={reduced ? undefined : { duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
      >
        <div className="overflow-hidden rounded-xl border border-white/15 bg-[#141414] shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
          <p className="border-b border-white/10 px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-wider text-[#737373]">
            Métricas
          </p>
          <div className="relative aspect-[16/10]">
            <Image
              src="/landing/metrica-detalles2.png"
              alt="Métricas de RPE por sesión en TuCoach"
              fill
              className="object-cover object-center"
              sizes="200px"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section
      id="inicio"
      className="landing-hero relative overflow-hidden pb-20 pt-28 sm:pb-28 sm:pt-32 lg:pb-32 lg:pt-36"
    >
      {/* Fondo */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(255,255,255,0.07),transparent_55%)]" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        <div className="absolute left-1/4 top-1/3 size-96 rounded-full bg-white/[0.03] blur-3xl" />
        <div className="absolute bottom-0 right-1/4 size-80 rounded-full bg-white/[0.02] blur-3xl" />
      </div>

      <div className={LANDING_CONTAINER}>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <ScrollReveal>
            <p className="mb-4 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A3A3A3]">
            Plataforma para profesionales del entrenamiento, gimnasios y usuarios
            </p>

            <h1 className="font-display text-[clamp(2.25rem,5.5vw,3.75rem)] leading-[1.05] tracking-wide text-white">
              Entrená mejor.
              <br />
              <span className="relative inline-block text-white">
                Progresá con datos.
                <span
                  aria-hidden
                  className="absolute -bottom-1 left-0 h-px w-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
                />
              </span>
              <br />
              <span className="text-[#737373]">Todo en TuCoach.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#A3A3A3] sm:text-lg">
              Creá planificaciones personalizadas, compartí ejercicios, acompañá a tus
              alumnos y analizá su progreso desde una sola plataforma.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <LandingButton href={REGISTRO_ROUTE} variant="primary" className="w-full sm:w-auto">
                {`Probar ${TRIAL_DAYS} días`}
              </LandingButton>
              <LandingButton
                href="#funciones"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                <span className="inline-flex size-7 items-center justify-center rounded-full border border-white/20 bg-white/5">
                  <Play className="size-3 fill-white text-white" aria-hidden />
                </span>
                Ver cómo funciona
              </LandingButton>
            </div>

            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-2">
                {HERO_PROFESORES.map((profesor) => (
                  <div
                    key={profesor.src}
                    className="relative size-9 overflow-hidden rounded-full border-2 border-[#050505] bg-[#141414] ring-1 ring-white/10"
                  >
                    <Image
                      src={profesor.src}
                      alt={profesor.alt}
                      fill
                      className="object-cover object-top"
                      sizes="36px"
                    />
                  </div>
                ))}
              </div>
              <p className="text-sm text-[#737373]">
                Entrenadores y alumnos ya entrenan con TuCoach
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15} className="relative lg:pl-4">
            <HeroMockups />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
