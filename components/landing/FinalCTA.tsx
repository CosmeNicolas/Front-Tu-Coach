import Image from 'next/image';
import { LANDING_CONTAINER, REGISTRO_ROUTE, TRIAL_DAYS } from '@/lib/landing/constants';
import { LandingButton } from '@/components/landing/LandingButton';
import { ScrollReveal } from '@/components/landing/ScrollReveal';

export function FinalCTA() {
  return (
    <section className="pb-20 sm:pb-28">
      <div className={LANDING_CONTAINER}>
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-[#141414] via-[#0A0A0A] to-[#050505] px-6 py-14 text-center sm:px-12 sm:py-16">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.08),transparent_55%)]"
            />

            <div className="relative mx-auto max-w-2xl">
              <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-tight tracking-wide text-white">
                Entrená. Acompañá. Evolucioná.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#A3A3A3] sm:text-lg">
                Sumate a TuCoach y llevá tus planificaciones, alumnos y resultados a un
                solo lugar. {TRIAL_DAYS} días Premium; si no pagás, quedás en Free.
              </p>
              <div className="mt-8 flex justify-center">
                <LandingButton href={REGISTRO_ROUTE} variant="primary" className="px-8">
                  {`Probar ${TRIAL_DAYS} días`}
                </LandingButton>
              </div>

              <div className="mt-10 flex flex-col items-center justify-center gap-5">
                <Image
                  src="/branding/LGO600PX.png"
                  alt="TuCoach"
                  width={96}
                  height={96}
                  className="size-16 opacity-90 grayscale sm:size-20"
                />
                <p className="font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-tight tracking-wide text-white">
                  NO DEJES DE MOVERTE
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
