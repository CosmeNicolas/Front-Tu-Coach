import Image from 'next/image';
import { Check } from 'lucide-react';
import { LANDING_CONTAINER } from '@/lib/landing/constants';
import { ScrollReveal } from '@/components/landing/ScrollReveal';

const ASSISTANT_BENEFITS = [
  'Flujo guiado',
  'Plantillas',
  'Vista previa',
  'Progresiones',
  'Reutilización de ejercicios',
  'Edición organizada',
] as const;

export function PlanningAssistantSection() {
  return (
    <section className="border-t border-white/[0.06] bg-[#0A0A0A] py-20 sm:py-28">
      <div className={LANDING_CONTAINER}>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <ScrollReveal>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#737373]">
              Planificar sin complicaciones
            </p>
            <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-tight tracking-wide text-white">
              Un asistente que ordena todo el proceso
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#A3A3A3] sm:text-lg">
              Creá semanas, sesiones, bloques y progresiones paso a paso. Revisá la
              planificación antes de asignarla y reutilizá estructuras para trabajar más
              rápido.
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {ASSISTANT_BENEFITS.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-[#A3A3A3]">
                  <Check className="mt-0.5 size-4 shrink-0 text-white" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </ScrollReveal>

          <ScrollReveal delay={0.12}>
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0A0A0A] shadow-[0_24px_80px_rgba(0,0,0,0.4)] ring-1 ring-white/10">
              <Image
                src="/landing/HerramientaAsistenteLineal.png"
                alt="Asistente de planificación lineal del profesor en TuCoach"
                width={630}
                height={406}
                className="h-auto w-full rounded-3xl object-cover object-top"
                unoptimized
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
