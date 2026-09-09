import { Star } from 'lucide-react';
import { LANDING_TESTIMONIALS } from '@/lib/landing/testimonials';
import { LANDING_CONTAINER } from '@/lib/landing/constants';
import { ScrollReveal, StaggerGrid, StaggerItem } from '@/components/landing/ScrollReveal';

const DEMO_PLACEHOLDERS = [
  {
    quote:
      'Lo que más valoro de TuCoach es la facilidad para planificar y consultar lo que viene haciendo cada alumno. Me permite trabajar de forma más ordenada y ahorrar tiempo en el día a día.',
    name: 'Alexis Cordoba',
    role: 'Entrenador',
    organization: '',
  },
  {
    quote:
      'A mi me gusta porque puedo tener un control del progreso de los alumnos, además al no verlos todos los días, también ellos pueden guiarse con las referencias que tiene la ilustración y eso nos facilita a ambos, cada vez es más intuitiva también',
    name: 'Sofi Nieva',
    role: 'Entrenadora',
    organization: '',
  },
  {
    quote:
    'TuCoach se adaptó a nuestra forma de trabajo, centralizando planificaciones, seguimiento de alumnos y la gestión de turnos y agenda mediante un chatbot. Hoy forma parte del trabajo diario del equipo. Nos permitió ordenar procesos que antes estaban distribuidos en distintas herramientas y mejorar la comunicación con nuestros alumnos. Además, nos da una base más clara para seguir creciendo y sumar nuevas funcionalidades.',
    name: 'CEMD',
    role: 'Centro de Medicina Deportiva',
    organization: '',
  },
  {
  quote:
    'Esta muy buena , puedo saber que hacer cuando llego al gimnasio, registrando los ejercicios que hago y ver mi progreso.',
  name: 'Enzo Oviedo',
  role: 'Alumno',
  organization: '',
},
{
  quote:
    'La verdad que TuCoach es bellísima, fácil de utilizar además es fácil seguir la rutina desde la app. Lo importante: puedo seguir la evolución de las cargas y avisarte si cambio los ejercicios por algún motivo ✨🫶🏻 Me facilitó el regreso al gym!!! 💪🏻💖',
  name: 'Alicia Barraza',
  role: 'Alumna',
  organization: '',
},
{
  quote:
    'Me gusta lo sencillo que es usar TuCoach, no me gusta que tenga tantas funcionalidades, me gusta que sea simple y fácil de usar.',
  name: 'Paola Salvatore',
  role: 'Alumna',
  organization: '',
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
             
              <code className="rounded bg-white/5 px-1.5 py-0.5 text-xs">
             
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
