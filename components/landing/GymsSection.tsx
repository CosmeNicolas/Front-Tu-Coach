import Image from 'next/image';
import { Check } from 'lucide-react';
import { contactUrl } from '@/lib/landing/contact';
import { LANDING_CONTAINER } from '@/lib/landing/constants';
import { LandingButton } from '@/components/landing/LandingButton';
import { ScrollReveal } from '@/components/landing/ScrollReveal';

const GYM_BENEFITS = [
  'Gestión centralizada de profesores',
  'Visibilidad de alumnos por sede',
  'Planes institucionales flexibles',
  'Reportes generales del centro',
  'Roles y permisos por equipo',
  'Escalable según tu operación',
] as const;

export function GymsSection() {
  return (
    <section id="gimnasios" className="py-20 sm:py-28">
      <div className={LANDING_CONTAINER}>
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#101010]">
          <div className="grid lg:grid-cols-2">
            <ScrollReveal className="p-8 sm:p-10 lg:p-12">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#737373]">
                Para gimnasios y centros
              </p>
              <h2 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] leading-tight tracking-wide text-white">
                Tu centro, tus profesores, un solo sistema
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#A3A3A3]">
                Coordiná equipos de entrenamiento, estandarizá procesos y obtené una
                visión clara del trabajo de cada profesor con sus alumnos.{' '}
               
              </p>
              <ul className="mt-8 space-y-3">
                {GYM_BENEFITS.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[#A3A3A3]">
                    <Check className="mt-0.5 size-4 shrink-0 text-white" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <LandingButton href={contactUrl('gimnasio')} variant="primary">
                  Escribirnos para gimnasios
                </LandingButton>
              </div>
            </ScrollReveal>

            <ScrollReveal
              delay={0.1}
              className="relative flex flex-col justify-center border-t border-white/10 bg-[#0A0A0A] p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.06),transparent_50%)]"
              />
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#101010] shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
                <Image
                  src="/landing/SeguimientoDashboard.png"
                  alt="Dashboard de seguimiento del centro con clientes activos, franjas etarias y reportes generales"
                  width={1593}
                  height={764}
                  className="h-auto w-full object-cover object-top"
                  unoptimized
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
