/** Placeholder visual del panel del profesor — reemplazar con captura real. */
export function DashboardPlaceholder() {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-white/10 bg-[#101010] shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
      data-screenshot-placeholder="Captura: panel del profesor"
      title="Reemplazar con /public/landing/profesor-dashboard.png"
    >
      <div className="flex border-b border-white/10">
        <div className="hidden w-14 shrink-0 flex-col gap-2 border-r border-white/10 bg-[#0A0A0A] p-3 sm:flex">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-2 rounded bg-white/10" />
          ))}
        </div>
        <div className="min-w-0 flex-1 p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#737373]">
                Panel del profesor
              </p>
              <p className="font-display text-lg text-white">Resumen general</p>
            </div>
            <div className="rounded-lg border border-dashed border-white/15 px-2 py-1 text-[10px] text-[#737373]">
              Demo
            </div>
          </div>

          <div className="mb-4 grid grid-cols-3 gap-2">
            {['Alumnos', 'Planificaciones', 'Sesiones'].map((label) => (
              <div
                key={label}
                className="rounded-xl border border-white/10 bg-[#141414] p-3"
              >
                <p className="text-[10px] text-[#737373]">{label}</p>
                <p className="mt-1 font-display text-xl text-white/80">—</p>
              </div>
            ))}
          </div>

          <div className="mb-4 rounded-xl border border-white/10 bg-[#141414] p-3">
            <p className="mb-2 text-[10px] uppercase tracking-wider text-[#737373]">
              Actividad reciente
            </p>
            <div className="flex h-16 items-end gap-1">
              {[30, 45, 35, 55, 40, 60, 50].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-white/20"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-wider text-[#737373]">
              Lista de alumnos
            </p>
            {['Alumno demo A', 'Alumno demo B', 'Alumno demo C'].map((name) => (
              <div
                key={name}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#0A0A0A] px-3 py-2"
              >
                <div className="size-6 rounded-full bg-white/10" />
                <span className="text-xs text-[#A3A3A3]">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
