'use client';

import { SessionTrainingRow } from '@/lib/alumno/chart-data';
import { formatSessionClock } from '@/lib/alumno/format-time';
import { formatProgressDate } from '@/lib/planification/progress-stats';

interface Props {
  rows: SessionTrainingRow[];
  showPlan?: boolean;
  maxRows?: number;
}

export function AlumnoSessionTrainingTable({
  rows,
  showPlan = false,
  maxRows = 30,
}: Props) {
  const visible = rows.slice(0, maxRows);

  if (visible.length === 0) {
    return (
      <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground">
          Detalle por sesión
        </h2>
        <p className="mt-3 rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
          Todavía no hay sesiones con tiempo registrado. Iniciá el cronómetro al
          entrenar y finalizá la sesión para ver el detalle acá.
        </p>
      </section>
    );
  }

  return (
    <section
      data-tour="alumno-metricas-tabla"
      className="rounded-2xl border border-border bg-card p-4 shadow-sm"
    >
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Detalle por sesión
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Fecha y duración de cada entrenamiento con cronómetro
          </p>
        </div>
        {rows.length > maxRows ? (
          <p className="text-xs text-muted-foreground">
            Mostrando las {maxRows} más recientes de {rows.length}
          </p>
        ) : null}
      </div>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[280px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              {showPlan ? <th className="px-2 py-2 font-semibold">Plan</th> : null}
              <th className="px-2 py-2 font-semibold">Sesión</th>
              <th className="px-2 py-2 font-semibold">Fecha</th>
              <th className="px-2 py-2 text-right font-semibold">Duración</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr
                key={`${row.planTitulo ?? 'plan'}-${row.sessionNum}-${row.fecha}`}
                className="border-b border-border/60 last:border-0"
              >
                {showPlan ? (
                  <td className="max-w-[140px] truncate px-2 py-2.5 text-foreground">
                    {row.planTitulo ?? '—'}
                  </td>
                ) : null}
                <td className="whitespace-nowrap px-2 py-2.5 font-medium text-foreground">
                  S{row.sessionNum}
                </td>
                <td className="whitespace-nowrap px-2 py-2.5 text-muted-foreground">
                  {formatProgressDate(row.fecha)}
                </td>
                <td className="whitespace-nowrap px-2 py-2.5 text-right font-mono text-sm text-foreground">
                  {formatSessionClock(row.sessionDurationSeconds)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
