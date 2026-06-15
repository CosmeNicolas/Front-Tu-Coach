'use client';

import Link from 'next/link';
import { useGymDashboard } from '@/hooks/useGymAdmin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Props {
  tenantId?: string;
  basePath?: string;
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-foreground">{value}</p>
      </CardContent>
    </Card>
  );
}

export function GymDashboardView({
  tenantId,
  basePath = '/owner',
}: Props) {
  const { data, isLoading, error } = useGymDashboard(tenantId);

  if (isLoading) {
    return (
      <p className="text-sm text-muted-foreground">Cargando resumen del gimnasio…</p>
    );
  }

  if (error || !data) {
    return (
      <p className="text-sm text-destructive">
        No se pudo cargar el dashboard del gimnasio.
      </p>
    );
  }

  const profesoresPath = `${basePath}/profesores`;
  const alumnosPath = `${basePath}/alumnos`;
  const ejerciciosPath = `${basePath}/ejercicios-privados`;

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {data.tenant.nombre}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-foreground">
          Dashboard del gimnasio
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Profesores con servicio activo y alumnos por profesor
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Profesores" value={data.resumen.totalProfesores} />
        <StatCard label="Alumnos" value={data.resumen.totalAlumnos} />
        <StatCard
          label="Planes activos"
          value={data.resumen.totalPlanificacionesActivas}
        />
      </section>

      <section className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-4 sm:px-6">
          <h2 className="text-lg font-semibold text-foreground">Profesores</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={profesoresPath}>Profesores</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={alumnosPath}>Todos los alumnos</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={ejerciciosPath}>Ejercicios privados</Link>
            </Button>
          </div>
        </div>

        {data.profesores.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-muted-foreground">
            No hay profesores registrados en este gimnasio.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/40 text-left text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium sm:px-6">Profesor</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium text-center">Alumnos</th>
                  <th className="px-4 py-3 font-medium text-center">Planes</th>
                  <th className="px-4 py-3 font-medium">Acción</th>
                </tr>
              </thead>
              <tbody>
                {data.profesores.map((p) => {
                  const detailHref = `${basePath}/profesores/${p.id}`;
                  return (
                    <tr
                      key={p.id}
                      className="border-t border-border hover:bg-muted/20"
                    >
                      <td className="px-4 py-3 font-medium text-foreground sm:px-6">
                        {p.apellido}, {p.nombre}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{p.email}</td>
                      <td className="px-4 py-3 text-center font-semibold text-foreground">
                        {p.alumnosCount}
                      </td>
                      <td className="px-4 py-3 text-center text-foreground">
                        {p.planificacionesActivas}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={detailHref}
                          className="font-medium text-foreground underline-offset-2 hover:underline"
                        >
                          Ver alumnos
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
