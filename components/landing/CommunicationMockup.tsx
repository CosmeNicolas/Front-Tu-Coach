/** Composición visual de chat, comentarios y progreso — placeholder demostrativo. */
export function CommunicationMockup() {
  return (
    <div className="grid gap-4 lg:grid-cols-12 lg:gap-5">
      {/* Chat */}
      <div className="rounded-2xl border border-white/10 bg-[#101010] p-4 lg:col-span-4">
        <p className="mb-3 text-[10px] font-medium uppercase tracking-wider text-[#737373]">
          Chat integrado
        </p>
        <div className="space-y-3">
          <div className="max-w-[85%] rounded-xl rounded-bl-sm bg-[#141414] px-3 py-2 text-xs text-[#A3A3A3]">
            ¿Cómo te sentiste en la sesión de hoy?
          </div>
          <div className="ml-auto max-w-[85%] rounded-xl rounded-br-sm border border-white/10 bg-white/5 px-3 py-2 text-xs text-white">
            Bien, pero el último ejercicio me costó.
          </div>
          <div className="max-w-[85%] rounded-xl rounded-bl-sm bg-[#141414] px-3 py-2 text-xs text-[#A3A3A3]">
            Perfecto, ajustamos la carga la próxima semana.
          </div>
        </div>
      </div>

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
          <p className="font-display text-2xl text-white">— kg</p>
          <p className="text-xs text-[#737373]">Valor de demostración</p>
        </div>
      </div>

      {/* Progreso + RPE */}
      <div className="space-y-4 lg:col-span-4">
        <div className="rounded-2xl border border-white/10 bg-[#101010] p-4">
          <p className="mb-3 text-[10px] font-medium uppercase tracking-wider text-[#737373]">
            Progreso de sesiones
          </p>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-3/5 rounded-full bg-white/35" />
          </div>
          <p className="mt-2 text-xs text-[#737373]">Adherencia demo</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#101010] p-4">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-[#737373]">
            Esfuerzo percibido (RPE)
          </p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className={`flex-1 rounded py-2 text-center text-[10px] ${
                  n <= 6
                    ? 'bg-white/25 text-white'
                    : 'bg-white/5 text-[#737373]'
                }`}
              >
                {n}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
