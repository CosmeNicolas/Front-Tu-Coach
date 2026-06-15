'use client';

import Link from 'next/link';
import { Client, ClientStatus } from '@/types/client';

interface AlumnoTableProps {
  items: Client[];
  onDelete: (id: string) => void;
}

export function AlumnoTable({ items, onDelete }: AlumnoTableProps) {
  if (!items.length) {
    return (
      <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        Todavía no tenés alumnos. Creá el primero para empezar.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-sm">
      <table className="min-w-[640px] w-full text-sm">
        <thead className="bg-muted/40 text-left text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Alumno</th>
            <th className="px-4 py-3 font-medium">Contacto</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            <th className="px-4 py-3 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((client) => (
            <tr key={client.id} className="border-t border-border hover:bg-muted/20">
              <td className="px-4 py-3">
                <p className="font-medium text-foreground">
                  {client.apellido}, {client.nombre}
                </p>
                {client.dni && (
                  <p className="text-xs text-muted-foreground">DNI {client.dni}</p>
                )}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {client.email ?? client.telefono ?? '—'}
              </td>
              <td className="px-4 py-3">
                <span
                  className={
                    client.estado === ClientStatus.ACTIVE
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  }
                >
                  {client.estado === ClientStatus.ACTIVE ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/profesor/alumnos/${client.id}`}
                    className="text-foreground underline-offset-2 hover:underline"
                  >
                    Ver
                  </Link>
                  <Link
                    href={`/profesor/alumnos/${client.id}/editar`}
                    className="text-foreground underline-offset-2 hover:underline"
                  >
                    Editar
                  </Link>
                  <Link
                    href={`/profesor/planificaciones/nueva?alumnoId=${client.id}`}
                    className="text-foreground underline-offset-2 hover:underline"
                  >
                    Nueva planificación
                  </Link>
                  <button
                    type="button"
                    onClick={() => onDelete(client.id)}
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
