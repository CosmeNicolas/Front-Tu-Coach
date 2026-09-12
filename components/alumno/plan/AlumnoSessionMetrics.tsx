'use client';

import { AlumnoDashboardMetrics } from '@/lib/alumno/metrics';
import { formatTrainingMinutes } from '@/lib/alumno/format-time';
import { formatProgressDate } from '@/lib/planification/progress-stats';

export function AlumnoSessionMetrics({ metrics }: { metrics: AlumnoDashboardMetrics }) {
  const items = [
    { label: 'Completadas', value: String(metrics.completadas) },
    { label: 'Pendientes', value: String(metrics.pendientes) },
    {
      label: 'RPE promedio',
      value: metrics.rpePromedio !== null ? String(metrics.rpePromedio) : '—',
    },
    {
      label: 'Último RPE',
      value: metrics.ultimoRpe !== null ? String(metrics.ultimoRpe) : '—',
    },
    {
      label: 'Ejercicios hechos',
      value: String(metrics.ejerciciosCompletadosTotal),
    },
    {
      label: 'Tiempo entrenado',
      value:
        metrics.totalTrainingSeconds > 0
          ? formatTrainingMinutes(metrics.totalTrainingSeconds)
          : '—',
    },
    {
      label: 'Carga total',
      value:
        metrics.totalVolumeKg > 0 ? `${metrics.totalVolumeKg} kg` : '—',
    },
    {
      label: 'Racha actual',
      value:
        metrics.rachaSesiones > 0
          ? `${metrics.rachaSesiones} ses.`
          : '—',
    },
    {
      label: 'Mejor racha',
      value: metrics.rachaMaxima > 0 ? `${metrics.rachaMaxima} ses.` : '—',
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-border bg-card px-3 py-3 shadow-sm"
        >
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            {item.label}
          </p>
          <p className="mt-1 text-lg font-bold text-foreground">{item.value}</p>
        </div>
      ))}
      {metrics.ultimaFecha ? (
        <div className="col-span-2 rounded-xl border border-border bg-accent/40 px-3 py-3 sm:col-span-3 lg:col-span-6">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-accent-foreground">
            Última sesión
          </p>
          <p className="mt-1 text-sm text-foreground">
            Sesión {metrics.ultimaSesion} · {formatProgressDate(metrics.ultimaFecha)}
          </p>
        </div>
      ) : null}
    </section>
  );
}
