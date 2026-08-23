import Image from 'next/image';

/** Composición visual de chat, comentarios, progreso y RPE en la landing. */
export function CommunicationMockup() {
  return (
    <div className="grid gap-4 lg:grid-cols-12 lg:gap-5">
      {/* Chat integrado — captura real */}
      <figure className="overflow-hidden rounded-2xl border border-white/10 bg-[#101010] lg:col-span-4">
        <Image
          src="/landing/chat-integrado.png"
          alt="Chat integrado entre alumno y profesor en TuCoach"
          width={321}
          height={623}
          className="h-auto w-full object-contain object-top"
          unoptimized
        />
        <figcaption className="border-t border-white/10 px-4 py-3 text-xs leading-relaxed text-[#737373]">
          Mensajes directos con tu profesor: dudas de entrenamiento, feedback de
          sesiones y ajustes del plan.
        </figcaption>
      </figure>

      {/* Comentario en sesión + carga */}
      <div className="space-y-4 lg:col-span-4">
        <div className="rounded-2xl border border-white/10 bg-[#101010] p-4">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-[#737373]">
            Comentario en sesión
          </p>
          <p className="text-sm text-[#A3A3A3]">
            &ldquo;Sentí buena activación en la primera serie.&rdquo;
          </p>
          <p className="mt-2 text-xs text-[#737373]">Sesión demo · Comentario del alumno</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#101010] p-4">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-[#737373]">
            Última carga utilizada
          </p>
          <p className="font-display text-2xl text-white">30 kg</p>
          <p className="text-xs text-[#737373]">Registro por ejercicio para el profesor</p>
        </div>
      </div>

      {/* Progreso + RPE — capturas reales del portal alumno */}
      <div className="space-y-4 lg:col-span-4">
        <figure className="overflow-hidden rounded-2xl border border-white/10 bg-[#101010]">
          <Image
            src="/landing/Progreso-sesiones.png"
            alt="Progreso de la sesión: ejercicios completados y avance del entrenamiento"
            width={282}
            height={106}
            className="h-auto w-full object-contain"
            unoptimized
          />
          <figcaption className="border-t border-white/10 px-4 py-3 text-xs leading-relaxed text-[#737373]">
            El alumno ve su avance en la sesión y el profesor monitorea adherencia
            sesión a sesión.
          </figcaption>
        </figure>

        <figure className="overflow-hidden rounded-2xl border border-white/10 bg-[#101010]">
          <Image
            src="/landing/Escala-esfuerzo-percibido%20.png"
            alt="Escala de esfuerzo percibido RPE al finalizar la sesión"
            width={277}
            height={191}
            className="h-auto w-full object-contain"
            unoptimized
          />
          <figcaption className="border-t border-white/10 px-4 py-3 text-xs leading-relaxed text-[#737373]">
            RPE obligatorio al cerrar cada entrenamiento: el profesor sabe cómo se
            sintió el alumno y ajusta la planificación.
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
