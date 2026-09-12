import { Building2, Check } from 'lucide-react';
import {
  buildLandingPlansFromPricing,
  LANDING_GYM_PLAN,
  LANDING_SAAS_PLANS,
  type LandingPlan,
} from '@/lib/landing/pricing';
import { contactUrl } from '@/lib/landing/contact';
import { LANDING_CONTAINER, TRIAL_DAYS } from '@/lib/landing/constants';
import type { PublicPlatformPricing } from '@/types/platform-pricing';
import { SectionHeader } from '@/components/landing/SectionHeader';
import { LandingButton } from '@/components/landing/LandingButton';
import { ScrollReveal, StaggerGrid, StaggerItem } from '@/components/landing/ScrollReveal';
import { cn } from '@/lib/utils';

function PlanCard({ plan }: { plan: LandingPlan }) {
  return (
    <article
      className={cn(
        'relative flex h-full flex-col rounded-2xl border p-6 transition-all duration-300',
        plan.highlighted
          ? 'border-white/25 bg-[#141414]'
          : 'border-white/10 bg-[#101010] hover:border-white/18',
      )}
    >
      {plan.badge ? (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-white/20 bg-white px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#050505]">
          {plan.badge}
        </span>
      ) : null}

      <div className="mb-6">
        {plan.eyebrow ? (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#737373]">
            {plan.eyebrow}
          </p>
        ) : null}
        <h3 className="font-display text-2xl tracking-wide text-white">{plan.name}</h3>
        <p className="mt-1 text-sm text-[#737373]">{plan.subtitle}</p>
        {plan.showPricing !== false && plan.launchPrice ? (
          <div className="mt-4">
            <p className="font-display text-3xl text-white">
              {plan.launchPrice}
              {plan.period ? (
                <span className="ml-1 font-sans text-sm font-normal text-[#737373]">
                  {plan.launchCaption ?? 'primer mes'}
                </span>
              ) : null}
            </p>
            <p className="mt-1 text-sm text-[#737373]">
              después {plan.price}
              {plan.period ?? ''}
            </p>
          </div>
        ) : plan.showPricing !== false ? (
          <p className="mt-4 font-display text-3xl text-white">
            {plan.price}
            {plan.period ? (
              <span className="ml-1 font-sans text-sm font-normal text-[#737373]">
                {plan.period}
              </span>
            ) : null}
          </p>
        ) : null}
      </div>

      <ul className="mb-8 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm text-[#A3A3A3]">
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
  );
}

function GymPlanCallout({ plan }: { plan: LandingPlan }) {
  return (
    <article className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-[#1a1a1a] via-[#101010] to-[#050505] p-8 sm:p-10 lg:p-12">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-white/[0.04] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -left-16 size-56 rounded-full bg-white/[0.03] blur-3xl"
      />

      <div className="relative grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-12">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5">
            <Building2 className="size-4 text-white" aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A3A3A3]">
              {plan.eyebrow ?? 'Para gimnasios'}
            </span>
          </div>

          <h3 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.05] tracking-wide text-white">
            {plan.headline ?? plan.name}
          </h3>
          <p className="mt-4 max-w-md text-base leading-relaxed text-[#A3A3A3] sm:text-lg">
            {plan.subtitle}
          </p>
          <p className="mt-3 text-sm text-[#737373]">
            Alta concierge · propuesta a medida · sin checkout online
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <LandingButton href={plan.href} variant="primary" className="px-8">
              {plan.cta}
            </LandingButton>
            <LandingButton href={contactUrl('demo')} variant="secondary" className="px-6">
              Pedir una demo
            </LandingButton>
          </div>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {plan.features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-3 rounded-xl border border-white/10 bg-[#0A0A0A]/80 p-4"
            >
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-white/15 bg-[#141414]">
                <Check className="size-3.5 text-white" aria-hidden />
              </span>
              <span className="text-sm leading-relaxed text-[#A3A3A3]">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function PricingSection({ pricing }: { pricing?: PublicPlatformPricing }) {
  const { saasPlans, trialDays, offerLabel } = pricing
    ? buildLandingPlansFromPricing(pricing)
    : {
        saasPlans: LANDING_SAAS_PLANS,
        trialDays: TRIAL_DAYS,
        offerLabel: '60% off el primer mes',
      };

  return (
    <section id="planes" className="border-t border-white/[0.06] bg-[#0A0A0A] py-20 sm:py-28">
      <div className={LANDING_CONTAINER}>
        <ScrollReveal className="mb-14 sm:mb-16">
          <SectionHeader
            label="ELEGÍ TU PLAN"
            title="Precios para profesores y gimnasios"
            description={`El registro de profesor empieza con ${trialDays} días Premium. Si no pagás, quedás en Free. Los precios de lista están en pesos; Premium se prueba en la app y el resto se coordina por mail.`}
          />
        </ScrollReveal>

        <ScrollReveal className="mb-6">
          <h3 className="font-display text-xl tracking-wide text-white">Para entrenadores</h3>
          <p className="mt-1 text-sm text-[#737373]">
            Suscripción mensual. Oferta de lanzamiento: {offerLabel.toLowerCase()}.
          </p>
        </ScrollReveal>

        <StaggerGrid className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {saasPlans.map((plan) => (
            <StaggerItem key={plan.id}>
              <PlanCard plan={plan} />
            </StaggerItem>
          ))}
        </StaggerGrid>

        <ScrollReveal className="mt-16 sm:mt-20">
          <GymPlanCallout plan={LANDING_GYM_PLAN} />
        </ScrollReveal>
      </div>
    </section>
  );
}
