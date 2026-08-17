'use client';

import { CheckCircle2, Circle, MessageSquareText } from 'lucide-react';
import { Planification, SessionExecutionLog } from '@/types/planification';
import {
  buildProgressStats,
  formatProgressDate,
} from '@/lib/planification/progress-stats';

export function ProgresoAlumnoPanel({
  planification,
}: {
  planification: Planification;
}) {
  const stats = buildProgressStats(
    planification.progresoAlumno,
    planification.config.totalSesiones,
  );
  const detalle = planification.progresoAlumno?.detallePorSesion ?? {};

  if (stats.completadas === 0) {
    return (
      <section className="mt-6 rounded-lg border border-dashed border-border bg-muted/40 p-5">
        <h2 className="text-sm font-semibold text-foreground">
          Progreso del alumno (portal)
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          El alumno aún no completó sesiones. Cuando marque sesiones en el portal,
          vas a ver adherencia, RPE y comentarios acá.
        </p>
      </section>
    );
  }

  const sesionesConFeedback = stats.filas.filter((fila) => {
    const det = detalle[String(fila.numero)];
    const comentario = fila.comentario?.trim();
    const notasEjercicios =
      det?.exercises?.some((e) => e.note?.trim()) ?? false;
    const notaRpe = det?.rpe?.note?.trim();
    return Boolean(comentario || notasEjercicios || notaRpe);
  });

  return (
    <section className="mt-6 rounded-lg border border-border bg-card p-5">
      <h2 className="text-sm font-semibold text-foreground">
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

      <div className="mt-4 overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-3 py-2 font-medium">Sesión</th>
              <th className="px-3 py-2 font-medium">Estado</th>
              <th className="px-3 py-2 font-medium">Fecha</th>
              <th className="px-3 py-2 font-medium">RPE</th>
              <th className="px-3 py-2 font-medium">Comentario de sesión</th>
            </tr>
          </thead>
          <tbody>
            {stats.filas.map((fila) => (
              <tr
                key={fila.numero}
                className="border-b border-border/60 align-top last:border-0"
              >
                <td className="px-3 py-2 font-medium text-foreground">
                  {fila.numero}
                </td>
                <td className="px-3 py-2">
                  <span className="inline-flex items-center gap-1.5">
                    {fila.completada ? (
                      <CheckCircle2 className="size-3.5 text-foreground" />
                    ) : (
                      <Circle className="size-3.5 text-muted-foreground/50" />
                    )}
                    <span
                      className={
                        fila.completada
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                      }
                    >
                      {fila.completada ? 'Completada' : 'Pendiente'}
                    </span>
                  </span>
                </td>
                <td className="px-3 py-2 text-muted-foreground">
                  {formatProgressDate(fila.fecha)}
                </td>
                <td className="px-3 py-2 text-foreground">
                  {fila.rpe ?? '—'}
                </td>
                <td className="max-w-md px-3 py-2 text-muted-foreground">
                  {fila.comentario?.trim() ? (
                    <p className="whitespace-pre-wrap break-words text-foreground">
                      {fila.comentario}
                    </p>
                  ) : (
                    '—'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sesionesConFeedback.length > 0 ? (
        <div className="mt-5 space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <MessageSquareText className="size-4" />
            Comentarios y notas del alumno
          </h3>
          {sesionesConFeedback.map((fila) => (
            <SessionFeedbackCard
              key={fila.numero}
              sessionNum={fila.numero}
              det={detalle[String(fila.numero)]}
              comentarioSesion={fila.comentario}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

function SessionFeedbackCard({
  sessionNum,
  det,
  comentarioSesion,
}: {
  sessionNum: number;
  det?: SessionExecutionLog;
  comentarioSesion: string | null;
}) {
  const notasEjercicios =
    det?.exercises?.filter((e) => e.note?.trim()) ?? [];
  const notaRpe = det?.rpe?.note?.trim();

  return (
    <article className="rounded-lg border border-border bg-muted/30 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Sesión {sessionNum}
      </p>
      {comentarioSesion?.trim() ? (
        <p className="mt-2 text-sm text-foreground">
          <span className="font-semibold">Comentario general: </span>
          {comentarioSesion}
        </p>
      ) : null}
      {notaRpe ? (
        <p className="mt-2 text-sm text-foreground">
          <span className="font-semibold">Nota RPE: </span>
          {notaRpe}
        </p>
      ) : null}
      {notasEjercicios.length > 0 ? (
        <ul className="mt-2 space-y-1.5">
          {notasEjercicios.map((ej) => (
            <li
              key={ej.exerciseId}
              className="rounded-md border border-border bg-background px-2.5 py-1.5 text-sm"
            >
              <span className="font-medium text-foreground">{ej.name}: </span>
              <span className="text-muted-foreground">{ej.note}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/50 px-3 py-2">
      <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}
