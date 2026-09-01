'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import {
  Planification,
  PlanificationStatus,
  PROGRESSION_MODE_LABELS,
} from '@/types/planification';

interface PlanificacionTableProps {
  items: Planification[];
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

function EstadoCell({ plan }: { plan: Planification }) {
  const esActual = plan.estado === PlanificationStatus.ACTIVE;
  if (esActual) {
    return (
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
          Actual
        </Badge>
        {plan.solicitudRevisionPendiente ? (
          <Badge variant="outline" className="border-amber-500/40 text-amber-700">
            A renovar
          </Badge>
        ) : null}
      </div>
    );
  }
  if (plan.estado === PlanificationStatus.ARCHIVED) {
    return (
      <span className="text-muted-foreground">Archivada</span>
    );
  }
  return <span className="capitalize text-muted-foreground">{plan.estado}</span>;
}

export function PlanificacionTable({
  items,
  onArchive,
  onDelete,
}: PlanificacionTableProps) {
  if (!items.length) {
    return (
      <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        No hay planificaciones con ese criterio.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-sm">
      <table className="min-w-[880px] w-full text-sm">
        <thead className="bg-muted/40 text-left text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Alumno</th>
            <th className="px-4 py-3 font-medium">Planificación</th>
            <th className="px-4 py-3 font-medium">Config</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            <th className="px-4 py-3 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => {
            const esActual = p.estado === PlanificationStatus.ACTIVE;
            return (
              <tr
                key={p.id}
                className={`border-t border-border hover:bg-muted/20 ${
                  esActual ? 'bg-emerald-500/5' : ''
                }`}
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">
                    {p.alumnoNombre ?? 'Sin alumno'}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{p.titulo}</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {PROGRESSION_MODE_LABELS[p.config.modoProgresion]} ·{' '}
                  {p.config.totalSesiones} sesiones
                </td>
                <td className="px-4 py-3">
                  <EstadoCell plan={p} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/profesor/planificaciones/${p.id}/asistente`}
                      className="font-medium text-foreground underline-offset-2 hover:underline"
                    >
                      Asistente
                    </Link>
                    <Link
                      href={`/profesor/planificaciones/${p.id}`}
                      className="text-foreground underline-offset-2 hover:underline"
                    >
                      Ver
                    </Link>
                    {esActual ? (
                      <button
                        type="button"
                        onClick={() => onArchive(p.id)}
                        className="text-foreground underline-offset-2 hover:underline"
                      >
                        Archivar
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => onDelete(p.id)}
                      className="text-red-600 underline-offset-2 hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
