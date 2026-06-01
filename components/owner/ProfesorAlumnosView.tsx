'use client';

import Link from 'next/link';
import { useProfesorAlumnos, useProfesorDetail } from '@/hooks/useGymAdmin';
import { ClientStatus } from '@/types/client';

interface Props {
  profesorId: string;
  tenantId?: string;
  basePath?: string;
}

export function ProfesorAlumnosView({
  profesorId,
  tenantId,
  basePath = '/owner',
}: Props) {
  const { data: profesor, isLoading: loadingProf } = useProfesorDetail(
    profesorId,
    tenantId,
  );
  const { data: alumnos, isLoading: loadingAlumnos } = useProfesorAlumnos(
    profesorId,
    tenantId,
  );

  const backHref = `${basePath}/profesores`;
  const dashboardHref =
    basePath.startsWith('/super-admin/tenants/')
      ? basePath
      : `${basePath}/dashboard`;

  if (loadingProf || loadingAlumnos) {
    return (
      <p className="text-sm text-muted-foreground">Cargando alumnos del profesor…</p>
    );
  }

  if (!profesor) {
    return (
      <p className="text-sm text-destructive">Profesor no encontrado.</p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Link
          href={dashboardHref}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Dashboard
        </Link>
        <Link
          href={backHref}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Profesores
        </Link>
      </div>

      <header className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          Profesor
        </p>
        <h1 className="mt-1 text-2xl font-bold text-foreground">
          {profesor.apellido}, {profesor.nombre}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{profesor.email}</p>
        <p className="mt-3 text-sm text-foreground">
          <strong>{alumnos?.total ?? 0}</strong> alumnos ·{' '}
          <strong>{profesor.planificacionesActivas}</strong> planificaciones activas
        </p>
      </header>

      {!alumnos?.items.length ? (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Este profesor aún no tiene alumnos cargados.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
          <table className="min-w-[640px] w-full text-sm">
            <thead className="bg-muted/40 text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Alumno</th>
                <th className="px-4 py-3 font-medium">Contacto</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Cuenta app</th>
              </tr>
            </thead>
            <tbody>
              {alumnos.items.map((c) => (
                <tr key={c.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {c.apellido}, {c.nombre}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {c.email ?? c.telefono ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        c.estado === ClientStatus.ACTIVE
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                      }
                    >
                      {c.estado === ClientStatus.ACTIVE ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {c.userId ? 'Vinculada' : 'Sin cuenta'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
