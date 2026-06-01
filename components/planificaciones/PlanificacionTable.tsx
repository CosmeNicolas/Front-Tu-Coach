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
      <p className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500">
        No hay planificaciones todavía.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
      <table className="min-w-[720px] w-full text-sm">
        <thead className="bg-zinc-50 text-left text-zinc-600">
          <tr>
            <th className="px-4 py-3 font-medium">Título</th>
            <th className="px-4 py-3 font-medium">Config</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            <th className="px-4 py-3 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id} className="border-t border-zinc-100">
              <td className="px-4 py-3 font-medium text-zinc-900">{p.titulo}</td>
              <td className="px-4 py-3 text-zinc-600">
                {PROGRESSION_MODE_LABELS[p.config.modoProgresion]} ·{' '}
                {p.config.totalSesiones} sesiones
              </td>
              <td className="px-4 py-3 capitalize">{p.estado}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/profesor/planificaciones/${p.id}/asistente`}
                    className="font-medium text-primary hover:underline"
                  >
                    Asistente
                  </Link>
                  <Link href={`/profesor/planificaciones/${p.id}`} className="hover:underline">
                    Ver
                  </Link>
                  <button type="button" onClick={() => onArchive(p.id)} className="hover:underline">
                    Archivar
                  </button>
                  <button type="button" onClick={() => onDelete(p.id)} className="text-red-600 hover:underline">
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
