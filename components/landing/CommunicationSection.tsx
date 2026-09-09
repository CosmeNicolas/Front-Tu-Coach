import Image from 'next/image';
import { Check } from 'lucide-react';
import { LANDING_CONTAINER } from '@/lib/landing/constants';
import { ScrollReveal } from '@/components/landing/ScrollReveal';

const COMMUNICATION_POINTS = [
  'Chat integrado entre alumno y profesor',
  'Comentarios al cerrar cada sesión',
  'Registro de cargas y esfuerzo percibido (RPE)',
  'Métricas para ajustar la planificación',
] as const;

const screenshotFrame =
  'overflow-hidden rounded-2xl border border-white/10 bg-[#101010] shadow-[0_16px_48px_rgba(0,0,0,0.45)]';

function CommunicationVisual() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none lg:min-h-[540px]">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-6 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.07),transparent_65%)] blur-2xl"
      />

      {/* Chat — captura principal */}
      <figure
        className={`relative z-10 mx-auto w-[72%] lg:absolute lg:right-0 lg:top-0 lg:mx-0 lg:w-[52%] ${screenshotFrame}`}
      >
        <Image
          src="/landing/chat-integrado.png"
          alt="Chat integrado entre alumno y profesor en TuCoach"
          width={321}
          height={623}
          className="h-auto w-full object-contain object-top"
          unoptimized
        />
      </figure>

      {/* Comentario de sesión */}
      <figure
        className={`relative z-20 mt-4 lg:absolute lg:left-0 lg:top-8 lg:mt-0 lg:w-[54%] ${screenshotFrame} ring-1 ring-[#0A0A0A]`}
      >
        <Image
          src="/landing/comentario-sesion-completa.png"
          alt="Comentario opcional de la sesión del alumno"
          width={285}
          height={158}
          className="h-auto w-full object-contain"
          unoptimized
        />
      </figure>

      {/* Métricas RPE para el profesor */}
      <figure
        className={`relative z-30 mt-4 lg:absolute lg:bottom-0 lg:left-0 lg:mt-0 lg:w-[58%] ${screenshotFrame} ring-1 ring-[#0A0A0A]`}
      >
        <Image
          src="/landing/metrica-detalles2.png"
          alt="Gráfico de RPE por sesión para el profesor"
          width={622}
          height={402}
          className="h-auto w-full object-contain object-top"
          unoptimized
        />
      </figure>
    </div>
  );
}

export function CommunicationSection() {
  return (
    <section className="border-t border-white/[0.06] bg-[#0A0A0A] py-20 sm:py-28">
      <div className={LANDING_CONTAINER}>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <ScrollReveal>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#737373]">
              Comunicación y feedback
            </p>
            <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-tight tracking-wide text-white">
              Más comunicación. Mejor seguimiento.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#A3A3A3] sm:text-lg">
              El alumno registra la sesión, deja comentarios y comparte cómo se sintió.
              Vos recibís esa información en tiempo real para ajustar el entrenamiento
              con precisión.
            </p>
            <ul className="mt-8 space-y-3">
              {COMMUNICATION_POINTS.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-[#A3A3A3]">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-white/15 bg-[#141414]">
                    <Check className="size-3 text-white" aria-hidden />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </ScrollReveal>

          <ScrollReveal delay={0.12}>
            <CommunicationVisual />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
