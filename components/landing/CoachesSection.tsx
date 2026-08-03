import { Check } from 'lucide-react';
import { LANDING_CONTAINER } from '@/lib/landing/constants';
import { LandingButton } from '@/components/landing/LandingButton';
import { ScrollReveal } from '@/components/landing/ScrollReveal';
import { DashboardPlaceholder } from '@/components/landing/DashboardPlaceholder';

const COACH_BENEFITS = [
  'Todos tus alumnos en un solo lugar',
  'Historial de planificaciones',
  'Registro de cargas y sesiones',
  'Comentarios del alumno',
  'Comunicación integrada',
  'Seguimiento individual',
] as const;

export function CoachesSection() {
  return (
    <section
      id="entrenadores"
      className="border-t border-white/[0.06] bg-[#0A0A0A] py-20 sm:py-28"
    >
      <div className={LANDING_CONTAINER}>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <ScrollReveal>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#737373]">
              Para profesores y entrenadores
            </p>
            <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-tight tracking-wide text-white">
              Llevá tu entrenamiento al siguiente nivel
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#A3A3A3] sm:text-lg">
              Gestioná tus alumnos, creá planificaciones, compartí contenido propio y
              tomá decisiones basadas en datos reales.
            </p>
            <ul className="mt-8 space-y-3">
              {COACH_BENEFITS.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-[#A3A3A3]">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-white/15 bg-[#141414]">
                    <Check className="size-3 text-white" aria-hidden />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <LandingButton href="#funciones" variant="secondary">
                Conocer herramientas
              </LandingButton>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.12}>
            {/* Reemplazar DashboardPlaceholder con /public/landing/profesor-dashboard.png */}
            <DashboardPlaceholder />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
