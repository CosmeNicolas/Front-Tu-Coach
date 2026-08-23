import Image from 'next/image';
import { Check } from 'lucide-react';
import { LANDING_CONTAINER } from '@/lib/landing/constants';
import { ScrollReveal } from '@/components/landing/ScrollReveal';

const CONTENT_POINTS = [
  'Ejercicios personalizados',
  'Videos propios',
  'Links externos',
  'Notas técnicas',
  'Bloques, biseries y triseries',
  'Organización por sesiones y semanas',
] as const;

export function ContentSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className={LANDING_CONTAINER}>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <ScrollReveal className="order-2 lg:order-1">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#101010] shadow-[0_24px_80px_rgba(0,0,0,0.4)]">
              <Image
                src="/landing/EjerciciosProfePanel.png"
                alt="Panel de ejercicios del profesor con videos propios y links externos"
                width={1063}
                height={627}
                className="h-auto w-full object-cover object-top"
                unoptimized
              />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1} className="order-1 lg:order-2">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#737373]">
              Tu contenido, tu método
            </p>
            <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-tight tracking-wide text-white">
              Tus ejercicios. Tus videos. Tu forma de entrenar.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#A3A3A3] sm:text-lg">
              TuCoach no te obliga a trabajar con una biblioteca cerrada. Podés cargar
              tus propios ejercicios, subir videos o utilizar enlaces desde YouTube,
              Vimeo y otras plataformas.
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {CONTENT_POINTS.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-[#A3A3A3]">
                  <Check className="mt-0.5 size-4 shrink-0 text-white" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
