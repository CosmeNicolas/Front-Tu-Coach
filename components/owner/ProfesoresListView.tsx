'use client';

import Link from 'next/link';
import { useGymDashboard } from '@/hooks/useGymAdmin';

interface Props {
  tenantId?: string;
  basePath?: string;
}

export function ProfesoresListView({
  tenantId,
  basePath = '/owner',
}: Props) {
  const { data, isLoading, error } = useGymDashboard(tenantId);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Cargando profesores…</p>;
  }

  if (error || !data) {
    return (
      <p className="text-sm text-destructive">No se pudieron cargar los profesores.</p>
    );
  }

  const dashboardHref =
    basePath.startsWith('/super-admin/tenants/')
      ? basePath
      : `${basePath}/dashboard`;

  return (
    <div className="space-y-6">
      <Link
        href={dashboardHref}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Dashboard
      </Link>
      <header>
        <h1 className="text-2xl font-bold text-foreground">Profesores</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {data.tenant.nombre} · {data.profesores.length} profesores
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.profesores.map((p) => {
          const href = `${basePath}/profesores/${p.id}`;
          return (
            <Link
              key={p.id}
              href={href}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-primary/40 hover:bg-accent/10"
            >
              <p className="font-semibold text-foreground">
                {p.apellido}, {p.nombre}
              </p>
              <p className="mt-1 truncate text-sm text-muted-foreground">
                {p.email}
              </p>
              <div className="mt-4 flex gap-4 text-sm">
                <span>
                  <strong className="text-primary">{p.alumnosCount}</strong>{' '}
                  alumnos
                </span>
                <span>
                  <strong>{p.planificacionesActivas}</strong> planes
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
