import { LANDING_CONTAINER } from '@/lib/landing/constants';
import { ScrollReveal } from '@/components/landing/ScrollReveal';
import { CommunicationMockup } from '@/components/landing/CommunicationMockup';

export function CommunicationSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className={LANDING_CONTAINER}>
        <ScrollReveal className="mb-12 text-center sm:mb-16">
          <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-tight tracking-wide text-white">
            Más comunicación. Mejor seguimiento.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#A3A3A3] sm:text-lg">
            El alumno puede registrar su sesión, dejar comentarios y compartir cómo se
            sintió. El profesor recibe esa información y puede ajustar el entrenamiento
            con mayor precisión.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <CommunicationMockup />
        </ScrollReveal>
      </div>
    </section>
  );
}
