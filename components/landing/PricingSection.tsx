import { Check } from 'lucide-react';
import { LANDING_PLANS } from '@/lib/landing/pricing';
import { LANDING_CONTAINER, TRIAL_DAYS } from '@/lib/landing/constants';
import { SectionHeader } from '@/components/landing/SectionHeader';
import { LandingButton } from '@/components/landing/LandingButton';
import { ScrollReveal, StaggerGrid, StaggerItem } from '@/components/landing/ScrollReveal';
import { cn } from '@/lib/utils';

export function PricingSection() {
  return (
    <section id="planes" className="border-t border-white/[0.06] bg-[#0A0A0A] py-20 sm:py-28">
      <div className={LANDING_CONTAINER}>
        <ScrollReveal className="mb-14 sm:mb-16">
          <SectionHeader
            label="ELEGÍ TU PLAN"
            title="El plan indicado para cada etapa"
            description={`El registro de profesor empieza con ${TRIAL_DAYS} días Premium. Si no pagás, quedás en Free: 2 alumnos y 1 planificación activa. Premium y Pro se coordinan por mail: todavía no hay cobro automático.`}
          />
        </ScrollReveal>

        <StaggerGrid className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {LANDING_PLANS.map((plan) => (
            <StaggerItem key={plan.id}>
              <article
                className={cn(
                  'relative flex h-full flex-col rounded-2xl border p-6 transition-all duration-300',
                  plan.highlighted
                    ? 'border-white/25 bg-[#141414] shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_20px_60px_rgba(0,0,0,0.4)]'
                    : 'border-white/10 bg-[#101010] hover:border-white/18',
                )}
              >
                {plan.badge ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-white/20 bg-white px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#050505]">
                    {plan.badge}
                  </span>
                ) : null}

                <div className="mb-6">
                  <h3 className="font-display text-2xl tracking-wide text-white">
                    {plan.name}
                  </h3>
                  <p className="mt-1 text-sm text-[#737373]">{plan.subtitle}</p>
                  <p className="mt-4 font-display text-3xl text-white">{plan.price}</p>
                </div>

                <ul className="mb-8 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm text-[#A3A3A3]"
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-white" aria-hidden />
                      {feature}
                    </li>
                  ))}
                </ul>

                <LandingButton
                  href={plan.href}
                  variant={plan.highlighted ? 'primary' : 'secondary'}
                  className="w-full"
                >
                  {plan.cta}
                </LandingButton>
              </article>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
