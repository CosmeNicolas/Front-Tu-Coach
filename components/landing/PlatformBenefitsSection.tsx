import { Check } from 'lucide-react';
import {
  ALUMNO_BENEFITS,
  PROFESOR_BENEFITS,
  type PlatformBenefit,
} from '@/lib/landing/benefits';
import { LANDING_CONTAINER } from '@/lib/landing/constants';
import { ScrollReveal, StaggerGrid, StaggerItem } from '@/components/landing/ScrollReveal';

function BenefitColumn({
  label,
  title,
  items,
}: {
  label: string;
  title: string;
  items: PlatformBenefit[];
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#101010] p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#737373]">
        {label}
      </p>
      <h3 className="mt-2 font-display text-2xl tracking-wide text-white">{title}</h3>
      <ul className="mt-6 space-y-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.title} className="flex gap-3">
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#141414]">
                <Icon className="size-4 text-white" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-medium text-white">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-[#A3A3A3]">
                  {item.description}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function PlatformBenefitsSection() {
  return (
    <section
      id="beneficios"
      className="border-t border-white/[0.06] bg-[#050505] py-20 sm:py-28"
    >
      <div className={LANDING_CONTAINER}>
        <ScrollReveal className="mb-12 text-center sm:mb-14">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#737373]">
            Beneficios de la plataforma
          </p>
          <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-tight tracking-wide text-white">
            Pensado para profes y alumnos
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#A3A3A3]">
            TuCoach conecta a quien entrena con quien acompaña: herramientas de
            gestión para el profe y una experiencia clara para seguir el plan día a
            día.
          </p>
        </ScrollReveal>

        <StaggerGrid className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <StaggerItem>
            <BenefitColumn
              label="Para profesores"
              title="Gestioná mejor, entrená mejor"
              items={PROFESOR_BENEFITS}
            />
          </StaggerItem>
          <StaggerItem>
            <BenefitColumn
              label="Para alumnos"
              title="Entrená con orden y seguimiento"
              items={ALUMNO_BENEFITS}
            />
          </StaggerItem>
        </StaggerGrid>

        <ScrollReveal className="mt-8">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[#737373]">
            <li className="flex items-center gap-2">
              <Check className="size-4 text-white" aria-hidden />
              Portal alumno incluido
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-4 text-white" aria-hidden />
              Chat y métricas integrados
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-4 text-white" aria-hidden />
              Descuentos en locales adheridos
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-4 text-white" aria-hidden />
              Funciona en mobile y desktop
            </li>
          </ul>
        </ScrollReveal>
      </div>
    </section>
  );
}
