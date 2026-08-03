import { TRUSTED_BY_PLACEHOLDERS } from '@/lib/landing/footer';
import { LANDING_CONTAINER } from '@/lib/landing/constants';
import { ScrollReveal } from '@/components/landing/ScrollReveal';

export function TrustedBySection() {
  return (
    <section
      aria-label="Profesionales que confían en TuCoach"
      className="border-y border-white/[0.06] bg-[#0A0A0A] py-10 sm:py-12"
    >
      <div className={LANDING_CONTAINER}>
        <ScrollReveal>
          <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#737373]">
            Profesionales que confían en TuCoach
          </p>
          {/* Reemplazar placeholders con logos reales en /public/landing/logos/ */}
          <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
            {TRUSTED_BY_PLACEHOLDERS.map((name) => (
              <li
                key={name}
                className="flex h-12 items-center justify-center rounded-lg border border-dashed border-white/10 px-4 text-center text-sm font-medium text-[#737373] opacity-60 transition-opacity hover:opacity-80"
              >
                {name}
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </div>
    </section>
  );
}
