import { LANDING_STEPS } from '@/lib/landing/steps';
import { LANDING_CONTAINER } from '@/lib/landing/constants';
import { SectionHeader } from '@/components/landing/SectionHeader';
import { ScrollReveal, StaggerGrid, StaggerItem } from '@/components/landing/ScrollReveal';

export function HowItWorksSection() {
  return (
    <section className="border-t border-white/[0.06] bg-[#0A0A0A] py-20 sm:py-28">
      <div className={LANDING_CONTAINER}>
        <ScrollReveal className="mb-14 sm:mb-16">
          <SectionHeader
            label="SIMPLE, RÁPIDO Y EFECTIVO"
            title="Así de fácil es empezar"
          />
        </ScrollReveal>

        <StaggerGrid className="relative grid gap-10 md:grid-cols-3 md:gap-6">
          {/* Línea conectora — desktop */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-[16.67%] right-[16.67%] top-8 hidden h-px bg-white/10 md:block"
          />

          {LANDING_STEPS.map((step) => (
            <StaggerItem key={step.number}>
              <article className="relative text-center md:text-left">
                <div className="relative z-10 mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl border border-white/15 bg-[#141414] font-display text-2xl text-white md:mx-0">
                  {step.number}
                </div>
                <h3 className="font-display text-xl tracking-wide text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#A3A3A3]">
                  {step.description}
                </p>
              </article>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
