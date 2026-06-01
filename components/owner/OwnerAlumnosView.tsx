'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useClients } from '@/hooks/useClients';
import { useGymDashboard } from '@/hooks/useGymAdmin';
import { ClientStatus } from '@/types/client';

interface Props {
  tenantId?: string;
  basePath?: string;
}

export function OwnerAlumnosView({
  tenantId,
  basePath = '/owner',
}: Props) {
  const { data: dashboard } = useGymDashboard(tenantId);
  const { data: clients, isLoading } = useClients({ limit: 200 });

  const profesorNames = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of dashboard?.profesores ?? []) {
      map.set(p.id, `${p.apellido}, ${p.nombre}`);
    }
    return map;
  }, [dashboard?.profesores]);

  const filteredItems = useMemo(() => {
    const items = clients?.items ?? [];
    if (!tenantId || !dashboard) return items;
    return items.filter((c) => c.tenantId === dashboard.tenant.id);
  }, [clients?.items, tenantId, dashboard]);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Cargando alumnos…</p>;
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Alumnos del gimnasio</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {dashboard?.tenant.nombre ?? 'Tu gimnasio'} · {filteredItems.length}{' '}
          alumnos
        </p>
      </header>

      {!filteredItems.length ? (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No hay alumnos registrados.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/40 text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Alumno</th>
                <th className="px-4 py-3 font-medium">Profesor</th>
                <th className="px-4 py-3 font-medium">Contacto</th>
                <th className="px-4 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((c) => {
                const profHref = `${basePath}/profesores/${c.profesorId}`;
                return (
                  <tr key={c.id} className="border-t border-border">
                    <td className="px-4 py-3 font-medium text-foreground">
                      {c.apellido}, {c.nombre}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={profHref}
                        className="text-primary hover:underline"
                      >
                        {profesorNames.get(c.profesorId) ?? '—'}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {c.email ?? c.telefono ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      {c.estado === ClientStatus.ACTIVE ? 'Activo' : 'Inactivo'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
