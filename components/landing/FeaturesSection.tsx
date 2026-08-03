import { LANDING_FEATURES } from '@/lib/landing/features';
import { LANDING_CONTAINER } from '@/lib/landing/constants';
import { SectionHeader } from '@/components/landing/SectionHeader';
import { ScrollReveal, StaggerGrid, StaggerItem } from '@/components/landing/ScrollReveal';

export function FeaturesSection() {
  return (
    <section id="funciones" className="py-20 sm:py-28">
      <div className={LANDING_CONTAINER}>
        <ScrollReveal className="mb-14 sm:mb-16">
          <SectionHeader
            label="TODO LO QUE NECESITÁS"
            title="Una plataforma, infinitas formas de entrenar"
            description="Herramientas pensadas para que entrenadores, alumnos y gimnasios trabajen de manera más simple y conectada."
          />
        </ScrollReveal>

        <StaggerGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {LANDING_FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <StaggerItem key={feature.title}>
                <article className="group h-full rounded-2xl border border-white/10 bg-[#101010] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
                  <div className="mb-4 inline-flex size-11 items-center justify-center rounded-xl border border-white/10 bg-[#141414]">
                    <Icon className="size-5 text-white" aria-hidden />
                  </div>
                  <h3 className="font-display text-xl tracking-wide text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#A3A3A3]">
                    {feature.description}
                  </p>
                </article>
              </StaggerItem>
            );
          })}
        </StaggerGrid>
      </div>
    </section>
  );
}
