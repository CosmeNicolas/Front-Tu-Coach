'use client';

import Link from 'next/link';
import {
  Archive,
  ArchiveRestore,
  Eye,
  Trash2,
  Wand2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Planification,
  PlanificationStatus,
  PROGRESSION_MODE_LABELS,
} from '@/types/planification';

interface PlanificacionTableProps {
  items: Planification[];
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
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
  onUnarchive,
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
      <table className="min-w-[980px] w-full text-sm">
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
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Button asChild size="sm">
                      <Link href={`/profesor/planificaciones/${p.id}/asistente`}>
                        <Wand2 />
                        Asistente
                      </Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/profesor/planificaciones/${p.id}`}>
                        <Eye />
                        Ver
                      </Link>
                    </Button>
                    {esActual ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => onArchive(p.id)}
                      >
                        <Archive />
                        Archivar
                      </Button>
                    ) : null}
                    {p.estado === PlanificationStatus.ARCHIVED ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => onUnarchive(p.id)}
                      >
                        <ArchiveRestore />
                        Desarchivar
                      </Button>
                    ) : null}
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => onDelete(p.id)}
                    >
                      <Trash2 />
                      Eliminar
                    </Button>
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
