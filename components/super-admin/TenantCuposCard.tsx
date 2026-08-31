import { formatCupo, planLabel } from '@/lib/plan/labels';
import type { TenantCupos } from '@/types/gym-admin';

function UsageBar({ usado, tope }: { usado: number; tope: number }) {
  const pct = tope > 0 ? Math.min(100, Math.round((usado / tope) * 100)) : 0;
  return (
    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
      <div
        className="h-full rounded-full bg-primary"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function TenantCuposCard({
  cupos,
  profesores,
}: {
  cupos: TenantCupos;
  profesores?: number;
}) {
  const plan = planLabel(cupos.planEfectivo);
  const custom = cupos.limitesOverride?.alumnos
    ? `Tope custom: ${cupos.limitesOverride.alumnos} alumnos.`
    : '';

  return (
    <section className="rounded-2xl border border-border bg-card px-4 py-4 shadow-sm sm:px-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Cupo del gimnasio
        </p>
        <p className="text-sm font-medium text-foreground">
          Plan {plan}
          {cupos.planCodigo !== cupos.planEfectivo
            ? ` (guardado: ${planLabel(cupos.planCodigo)})`
            : null}
        </p>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs text-muted-foreground">Alumnos</p>
          <p className="mt-1 font-display text-xl text-foreground">
            {formatCupo(
              cupos.uso.alumnos,
              cupos.limites.alumnos,
              cupos.disponibles.alumnos,
            )}
          </p>
          <UsageBar usado={cupos.uso.alumnos} tope={cupos.limites.alumnos} />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Planes activos</p>
          <p className="mt-1 font-display text-xl text-foreground">
            {formatCupo(
              cupos.uso.planesActivos,
              cupos.limites.planesActivos,
              cupos.disponibles.planesActivos,
            )}
          </p>
          <UsageBar
            usado={cupos.uso.planesActivos}
            tope={cupos.limites.planesActivos}
          />
        </div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        El cupo es del gimnasio entero
        {profesores != null ? ` · ${profesores} profesores` : ''}.
        {custom ? ` ${custom}` : ''}
      </p>
    </section>
  );
}
