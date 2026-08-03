import { Star } from 'lucide-react';
import { LANDING_TESTIMONIALS } from '@/lib/landing/testimonials';
import { LANDING_CONTAINER } from '@/lib/landing/constants';
import { ScrollReveal, StaggerGrid, StaggerItem } from '@/components/landing/ScrollReveal';

const DEMO_PLACEHOLDERS = [
  {
    quote:
      'Contenido demostrativo — reemplazar con testimonio real cuando esté disponible.',
    name: 'Nombre demo',
    role: 'Entrenador',
    organization: 'Centro demo',
  },
  {
    quote:
      'Contenido demostrativo — reemplazar con testimonio real cuando esté disponible.',
    name: 'Nombre demo',
    role: 'Profesional',
    organization: 'Gimnasio demo',
  },
  {
    quote:
      'Contenido demostrativo — reemplazar con testimonio real cuando esté disponible.',
    name: 'Nombre demo',
    role: 'Coordinador',
    organization: 'Equipo demo',
  },
] as const;

export function TestimonialsSection() {
  const items =
    LANDING_TESTIMONIALS.length > 0 ? LANDING_TESTIMONIALS : DEMO_PLACEHOLDERS;

  return (
    <section className="py-20 sm:py-28">
      <div className={LANDING_CONTAINER}>
        <ScrollReveal className="mb-14 text-center sm:mb-16">
          <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-tight tracking-wide text-white">
            Historias que impulsan
          </h2>
          {LANDING_TESTIMONIALS.length === 0 ? (
            <p className="mt-3 text-sm text-[#737373]">
              Placeholders editables — agregar testimonios reales en{' '}
              <code className="rounded bg-white/5 px-1.5 py-0.5 text-xs">
                lib/landing/testimonials.ts
              </code>
            </p>
          ) : null}
        </ScrollReveal>

        <StaggerGrid className="grid gap-5 md:grid-cols-3">
          {items.map((item, index) => (
            <StaggerItem key={`${item.name}-${index}`}>
              <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-[#101010] p-6">
                {'rating' in item && item.rating ? (
                  <div className="mb-3 flex gap-0.5">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="size-4 fill-white/80 text-white/80"
                        aria-hidden
                      />
                    ))}
                  </div>
                ) : null}
                <blockquote className="flex-1 text-sm leading-relaxed text-[#A3A3A3]">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <footer className="mt-6 border-t border-white/10 pt-4">
                  <p className="font-medium text-white">{item.name}</p>
                  <p className="text-xs text-[#737373]">
                    {item.role}
                    {'organization' in item && item.organization
                      ? ` · ${item.organization}`
                      : ''}
                  </p>
                </footer>
              </article>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
