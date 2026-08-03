'use client';

import Link from 'next/link';
import { useGymDashboard } from '@/hooks/useGymAdmin';
import {
  DashboardActivityCharts,
  DashboardStatCard,
} from '@/components/dashboard/DashboardCharts';
import { GymAlumnosActivityTable } from '@/components/owner/GymAlumnosActivityTable';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Props {
  tenantId?: string;
  basePath?: string;
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
  const alumnos = data.alumnos ?? [];
  const sesionesPorDia = data.sesionesPorDia ?? [];
  const planesPorDia = data.planesPorDia ?? [];

  return (
    <div className="space-y-6">
      <header className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {data.tenant.nombre}
          </p>
          <h1 className="mt-1 font-display text-2xl tracking-wide text-foreground sm:text-3xl">
            Dashboard del gimnasio
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Resumen del tenant: profesores, alumnos y actividad del portal.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
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
      </header>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        <DashboardStatCard
          label="Profesores"
          value={data.resumen.totalProfesores}
        />
        <DashboardStatCard label="Alumnos" value={data.resumen.totalAlumnos} />
        <DashboardStatCard
          label="Alumnos activos"
          value={data.resumen.alumnosActivos ?? '—'}
        />
        <DashboardStatCard
          label="Planes activos"
          value={data.resumen.totalPlanificacionesActivas}
        />
        <DashboardStatCard
          label="Sesiones completadas"
          value={data.resumen.sesionesCompletadas ?? 0}
        />
        <DashboardStatCard
          label="Última actividad"
          value={data.resumen.ultimaActividad ?? '—'}
        />
      </section>

      <DashboardActivityCharts
        sesionesPorDia={sesionesPorDia}
        planesPorDia={planesPorDia}
      />

      <section className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-4 py-4 sm:px-6">
          <h2 className="text-lg font-semibold text-foreground">Profesores</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Solo profesores activos de este gimnasio
          </p>
        </div>

        {data.profesores.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-muted-foreground">
            No hay profesores registrados en este gimnasio.
          </p>
        ) : (
          <Tabs defaultValue="todos" className="p-4 sm:p-6">
            <TabsList>
              <TabsTrigger value="todos">
                Todos ({data.profesores.length})
              </TabsTrigger>
              <TabsTrigger value="con-alumnos">
                Con alumnos (
                {data.profesores.filter((p) => p.alumnosCount > 0).length})
              </TabsTrigger>
              <TabsTrigger value="sin-alumnos">
                Sin alumnos (
                {data.profesores.filter((p) => p.alumnosCount === 0).length})
              </TabsTrigger>
            </TabsList>

            {(['todos', 'con-alumnos', 'sin-alumnos'] as const).map((tab) => {
              const rows =
                tab === 'todos'
                  ? data.profesores
                  : tab === 'con-alumnos'
                    ? data.profesores.filter((p) => p.alumnosCount > 0)
                    : data.profesores.filter((p) => p.alumnosCount === 0);

              return (
                <TabsContent key={tab} value={tab}>
                  <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="min-w-full text-sm">
                      <thead className="bg-muted/40 text-left text-muted-foreground">
                        <tr>
                          <th className="px-4 py-3 font-medium">Profesor</th>
                          <th className="px-4 py-3 font-medium">Email</th>
                          <th className="px-4 py-3 font-medium text-center">
                            Alumnos
                          </th>
                          <th className="px-4 py-3 font-medium text-center">
                            Planes
                          </th>
                          <th className="px-4 py-3 font-medium">Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((p) => (
                          <tr
                            key={p.id}
                            className="border-t border-border hover:bg-muted/20"
                          >
                            <td className="px-4 py-3 font-medium text-foreground">
                              {p.apellido}, {p.nombre}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {p.email}
                            </td>
                            <td className="px-4 py-3 text-center font-semibold text-foreground">
                              {p.alumnosCount}
                            </td>
                            <td className="px-4 py-3 text-center text-foreground">
                              {p.planificacionesActivas}
                            </td>
                            <td className="px-4 py-3">
                              <Link
                                href={`${basePath}/profesores/${p.id}`}
                                className="font-medium text-foreground underline-offset-2 hover:underline"
                              >
                                Ver alumnos
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        )}
      </section>

      <GymAlumnosActivityTable rows={alumnos} basePath={basePath} />
    </div>
  );
}
