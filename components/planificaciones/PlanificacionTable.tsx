'use client';

import Link from 'next/link';
import { Planification, PROGRESSION_MODE_LABELS } from '@/types/planification';

interface PlanificacionTableProps {
  items: Planification[];
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PlanificacionTable({
  items,
  onArchive,
  onDelete,
}: PlanificacionTableProps) {
  if (!items.length) {
    return (
      <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        No hay planificaciones todavía.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-sm">
      <table className="min-w-[720px] w-full text-sm">
        <thead className="bg-muted/40 text-left text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Título</th>
            <th className="px-4 py-3 font-medium">Config</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            <th className="px-4 py-3 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id} className="border-t border-border hover:bg-muted/20">
              <td className="px-4 py-3 font-medium text-foreground">{p.titulo}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {PROGRESSION_MODE_LABELS[p.config.modoProgresion]} ·{' '}
                {p.config.totalSesiones} sesiones
              </td>
              <td className="px-4 py-3 capitalize text-foreground">{p.estado}</td>
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
                  <button
                    type="button"
                    onClick={() => onArchive(p.id)}
                    className="text-foreground underline-offset-2 hover:underline"
                  >
                    Archivar
                  </button>
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
