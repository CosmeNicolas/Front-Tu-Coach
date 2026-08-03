import Image from 'next/image';
import { LOGIN_ROUTE, LANDING_CONTAINER } from '@/lib/landing/constants';
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
                solo lugar.
              </p>
              <div className="mt-8 flex justify-center">
                <LandingButton href={LOGIN_ROUTE} variant="primary" className="px-8">
                  Comenzar gratis ahora
                </LandingButton>
              </div>

              <div className="mt-8 flex items-center justify-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <Image
                      key={i}
                      src="/branding/ZORRO1.png"
                      alt=""
                      width={32}
                      height={32}
                      className="rounded-full border-2 border-[#0A0A0A] opacity-70 grayscale"
                    />
                  ))}
                </div>
                <p className="text-xs text-[#737373]">Plataforma para profes y alumnos</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
