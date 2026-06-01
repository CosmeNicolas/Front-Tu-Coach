'use client';

import { CheckCircle2, Circle } from 'lucide-react';
import { Planification } from '@/types/planification';
import {
  buildProgressStats,
  formatProgressDate,
} from '@/lib/planification/progress-stats';
import { CEMD } from '@/components/planificaciones/asistente/constants';

export function ProgresoAlumnoPanel({
  planification,
}: {
  planification: Planification;
}) {
  const stats = buildProgressStats(
    planification.progresoAlumno,
    planification.config.totalSesiones,
  );

  if (stats.completadas === 0) {
    return (
      <section className="mt-6 rounded-lg border border-dashed border-zinc-200 bg-zinc-50/80 p-5">
        <h2 className="text-sm font-semibold text-zinc-700">
          Progreso del alumno (portal)
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          El alumno aún no completó sesiones. Cuando marque sesiones en el portal,
          vas a ver adherencia, RPE y comentarios acá.
        </p>
      </section>
    );
  }

  return (
    <section
      className={`mt-6 rounded-lg border ${CEMD.borderClass} bg-white p-5`}
    >
      <h2 className={`text-sm font-semibold ${CEMD.primaryClass}`}>
        Progreso del alumno (portal)
      </h2>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric
          label="Adherencia"
          value={`${stats.completadas}/${stats.totalSesiones} (${stats.adherenciaPct}%)`}
        />
        <Metric
          label="RPE promedio"
          value={stats.rpePromedio !== null ? String(stats.rpePromedio) : '—'}
        />
        <Metric label="Pendientes" value={String(stats.pendientes)} />
        {stats.ejerciciosRegistrados > 0 ? (
          <Metric
            label="Ejercicios hechos"
            value={`${stats.ejerciciosCompletados}/${stats.ejerciciosRegistrados}`}
          />
        ) : null}
      </dl>

      <div className="mt-4 overflow-x-auto rounded-lg border border-zinc-100">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/80 text-xs uppercase tracking-wide text-zinc-500">
              <th className="px-3 py-2 font-medium">Sesión</th>
              <th className="px-3 py-2 font-medium">Estado</th>
              <th className="px-3 py-2 font-medium">Fecha</th>
              <th className="px-3 py-2 font-medium">RPE</th>
              <th className="px-3 py-2 font-medium">Comentario</th>
            </tr>
          </thead>
          <tbody>
            {stats.filas.map((fila) => (
              <tr
                key={fila.numero}
                className="border-b border-zinc-50 last:border-0"
              >
                <td className="px-3 py-2 font-medium text-zinc-800">
                  {fila.numero}
                </td>
                <td className="px-3 py-2">
                  <span className="inline-flex items-center gap-1.5">
                    {fila.completada ? (
                      <CheckCircle2 className="size-3.5 text-foreground" />
                    ) : (
                      <Circle className="size-3.5 text-zinc-300" />
                    )}
                    <span
                      className={
                        fila.completada
                          ? 'text-foreground'
                          : 'text-zinc-400'
                      }
                    >
                      {fila.completada ? 'Completada' : 'Pendiente'}
                    </span>
                  </span>
                </td>
                <td className="px-3 py-2 text-zinc-600">
                  {formatProgressDate(fila.fecha)}
                </td>
                <td className="px-3 py-2 text-zinc-800">
                  {fila.rpe ?? '—'}
                </td>
                <td className="max-w-[200px] truncate px-3 py-2 text-zinc-600">
                  {fila.comentario ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-zinc-50 px-3 py-2">
      <dt className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm font-medium text-zinc-900">{value}</dd>
    </div>
  );
}
