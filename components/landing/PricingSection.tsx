import { Check } from 'lucide-react';
import {
  LANDING_CATALOG_PLANS,
  LANDING_GYM_PLAN,
  LANDING_SAAS_PLANS,
  type LandingPlan,
} from '@/lib/landing/pricing';
import { LANDING_CONTAINER, TRIAL_DAYS } from '@/lib/landing/constants';
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
        <h3 className="font-display text-2xl tracking-wide text-white">{plan.name}</h3>
        <p className="mt-1 text-sm text-[#737373]">{plan.subtitle}</p>
        {plan.launchPrice ? (
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
        ) : (
          <p className="mt-4 font-display text-3xl text-white">
            {plan.price}
            {plan.period ? (
              <span className="ml-1 font-sans text-sm font-normal text-[#737373]">
                {plan.period}
              </span>
            ) : null}
          </p>
        )}
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

export function PricingSection() {
  const gym = LANDING_GYM_PLAN;

  return (
    <section id="planes" className="border-t border-white/[0.06] bg-[#0A0A0A] py-20 sm:py-28">
      <div className={LANDING_CONTAINER}>
        <ScrollReveal className="mb-14 sm:mb-16">
          <SectionHeader
            label="ELEGÍ TU PLAN"
            title="Precios para profes, gyms y quien entrena solo"
            description={`El registro de profesor empieza con ${TRIAL_DAYS} días Premium. Si no pagás, quedás en Free. Los precios de lista están en pesos; todavía no hay cobro automático: Premium se prueba en la app y el resto se coordina por mail.`}
          />
        </ScrollReveal>

        <ScrollReveal className="mb-6">
          <h3 className="font-display text-xl tracking-wide text-white">Para entrenadores</h3>
          <p className="mt-1 text-sm text-[#737373]">
            Suscripción mensual. Oferta de lanzamiento: 60% off el primer mes.
          </p>
        </ScrollReveal>

        <StaggerGrid className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {LANDING_SAAS_PLANS.map((plan) => (
            <StaggerItem key={plan.id}>
              <PlanCard plan={plan} />
            </StaggerItem>
          ))}
        </StaggerGrid>

        <ScrollReveal className="mt-5">
          <article className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-[#101010] p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#737373]">
                Para gimnasios
              </p>
              <h3 className="mt-2 font-display text-2xl tracking-wide text-white">
                {gym.name}
              </h3>
              <p className="mt-1 text-sm text-[#737373]">{gym.subtitle}</p>
              <p className="mt-3 font-display text-3xl text-white">
                {gym.launchPrice}
                <span className="ml-1 font-sans text-sm font-normal text-[#737373]">
                  primer mes
                </span>
              </p>
              <p className="mt-1 text-sm text-[#737373]">
                después {gym.price}
                {gym.period}
              </p>
            </div>
            <ul className="grid gap-2 text-sm text-[#A3A3A3] sm:max-w-sm">
              {gym.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 size-4 shrink-0 text-white" aria-hidden />
                  {feature}
                </li>
              ))}
            </ul>
            <LandingButton href={gym.href} variant="secondary" className="w-full sm:w-auto">
              {gym.cta}
            </LandingButton>
          </article>
        </ScrollReveal>

        <div id="planes-entrenamiento" className="mt-16 sm:mt-20">
          <ScrollReveal className="mb-8">
            <h3 className="font-display text-xl tracking-wide text-white">
              Para entrenar sin profesor
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-[#737373]">
              Bloques genéricos de salud, fuerza o hipertrofia, y una opción
              personalizada. No vendemos planes por patología, lesión ni
              rehabilitación: eso pide supervisión presencial.
            </p>
          </ScrollReveal>

          <StaggerGrid className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {LANDING_CATALOG_PLANS.map((plan) => (
              <StaggerItem key={plan.id}>
                <PlanCard plan={plan} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </div>
    </section>
  );
}
