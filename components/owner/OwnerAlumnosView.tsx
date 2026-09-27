'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useGymDashboard } from '@/hooks/useGymAdmin';
import { ClientStatus } from '@/types/client';
import {
  TablePagination,
  useClientPagination,
} from '@/components/ui/table-pagination';

interface Props {
  tenantId?: string;
  basePath?: string;
}

export function OwnerAlumnosView({
  tenantId,
  basePath = '/owner',
}: Props) {
  const { data: dashboard, isLoading } = useGymDashboard(tenantId);

  const profesorNames = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of dashboard?.profesores ?? []) {
      map.set(p.id, `${p.apellido}, ${p.nombre}`);
    }
    return map;
  }, [dashboard?.profesores]);

  const rows = dashboard?.alumnos ?? [];
  const { pageItems, page, totalPages, totalItems, pageSize, setPage } =
    useClientPagination(rows);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Cargando alumnos…</p>;
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Alumnos del gimnasio</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {dashboard?.tenant.nombre ?? 'Tu gimnasio'} · {rows.length} alumnos
        </p>
      </header>

      {!rows.length ? (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No hay alumnos registrados.
        </p>
      ) : (
        <div>
          <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
            <table className="min-w-[640px] w-full text-sm">
              <thead className="bg-muted/40 text-left text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Alumno</th>
                  <th className="px-4 py-3 font-medium">Profesor</th>
                  <th className="px-4 py-3 font-medium">Contacto</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((c) => {
                  const profHref = `${basePath}/profesores/${c.profesorId}`;
                  return (
                    <tr key={c.id} className="border-t border-border">
                      <td className="px-4 py-3 font-medium text-foreground">
                        {c.apellido}, {c.nombre}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={profHref}
                          className="text-foreground underline-offset-2 hover:underline"
                        >
                          {c.profesorNombre ||
                            profesorNames.get(c.profesorId) ||
                            '—'}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {c.email ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {c.estado === ClientStatus.ACTIVE ? 'Activo' : 'Inactivo'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <TablePagination
            page={page}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
