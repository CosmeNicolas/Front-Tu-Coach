'use client';

import Link from 'next/link';
import { usePlatformOverview } from '@/hooks/useGymAdmin';
import {
  DashboardActivityCharts,
  DashboardStatCard,
} from '@/components/dashboard/DashboardCharts';
import { EditarGimnasioDialog } from '@/components/super-admin/EditarGimnasioDialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCupo, planLabel } from '@/lib/plan/labels';
import type { PlatformTenantRow, TenantSummary } from '@/types/gym-admin';

function rowToTenant(row: PlatformTenantRow): TenantSummary {
  return {
    id: row.id,
    nombre: row.nombre,
    slug: row.slug,
    estado: row.estado,
    planCodigo: row.planCodigo,
    planComercialId: null,
    limitesOverride: row.limitesOverride,
  };
}

type TabId = 'todos' | 'activos' | 'suspendidos' | 'con-actividad' | 'sin-actividad';

function filterGimnasios(rows: PlatformTenantRow[], tab: TabId) {
  switch (tab) {
    case 'activos':
      return rows.filter((r) => r.estado === 'activo');
    case 'suspendidos':
      return rows.filter((r) => r.estado !== 'activo');
    case 'con-actividad':
      return rows.filter((r) => Boolean(r.ultimaActividadAt));
    case 'sin-actividad':
      return rows.filter((r) => !r.ultimaActividadAt);
    default:
      return rows;
  }
}

function GimnasiosTable({ rows }: { rows: PlatformTenantRow[] }) {
  if (rows.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
        No hay gimnasios en este filtro.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="min-w-[1080px] w-full text-sm">
        <thead className="bg-muted/40 text-left text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Gimnasio</th>
            <th className="px-4 py-3 font-medium">Plan</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            <th className="px-4 py-3 font-medium text-center">Profes</th>
            <th className="px-4 py-3 font-medium">Alumnos / cupo</th>
            <th className="px-4 py-3 font-medium">Planes / cupo</th>
            <th className="px-4 py-3 font-medium">Última actividad</th>
            <th className="px-4 py-3 font-medium">Acción</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((g) => (
            <tr key={g.id} className="border-t border-border hover:bg-muted/20">
              <td className="px-4 py-3">
                <p className="font-medium text-foreground">{g.nombre}</p>
                <p className="text-xs text-muted-foreground">{g.slug}</p>
              </td>
              <td className="px-4 py-3 font-medium text-foreground">
                {planLabel(g.planEfectivo ?? g.planCodigo)}
              </td>
              <td className="px-4 py-3 capitalize text-foreground">{g.estado}</td>
              <td className="px-4 py-3 text-center font-semibold">{g.profesores}</td>
              <td className="px-4 py-3">
                {g.cupos
                  ? formatCupo(
                      g.cupos.uso.alumnos,
                      g.cupos.limites.alumnos,
                      g.cupos.disponibles.alumnos,
                    )
                  : g.alumnos}
              </td>
              <td className="px-4 py-3">
                {g.cupos
                  ? formatCupo(
                      g.cupos.uso.planesActivos,
                      g.cupos.limites.planesActivos,
                      g.cupos.disponibles.planesActivos,
                    )
                  : g.planificacionesActivas}
              </td>
              <td className="px-4 py-3">
                <span
                  className={
                    g.ultimaActividadAt
                      ? 'font-medium text-foreground'
                      : 'text-muted-foreground'
                  }
                >
                  {g.ultimaActividad}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/super-admin/tenants/${g.id}`}
                    className="text-foreground underline-offset-2 hover:underline"
                  >
                    Ver
                  </Link>
                  <EditarGimnasioDialog tenant={rowToTenant(g)} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SuperAdminDashboardView() {
  const { data, isLoading, error } = usePlatformOverview();

  if (isLoading) {
    return (
      <p className="text-sm text-muted-foreground">Cargando resumen de la plataforma…</p>
    );
  }

  if (error || !data) {
    return (
      <p className="text-sm text-destructive">
        No se pudo cargar el dashboard global.
      </p>
    );
  }

  const { resumen, gimnasios } = data;
  const counts = {
    todos: gimnasios.length,
    activos: filterGimnasios(gimnasios, 'activos').length,
    suspendidos: filterGimnasios(gimnasios, 'suspendidos').length,
    'con-actividad': filterGimnasios(gimnasios, 'con-actividad').length,
    'sin-actividad': filterGimnasios(gimnasios, 'sin-actividad').length,
  };

  return (
    <div className="space-y-6">
      <header className="space-y-4">
        <div>
          <h1 className="font-display text-2xl tracking-wide text-foreground sm:text-3xl">
            Dashboard Super Admin
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Vista global de la plataforma.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/super-admin/tenants">Ver gimnasios</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/super-admin/profesores">Profesores</Link>
          </Button>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        <DashboardStatCard label="Gimnasios" value={resumen.totalGimnasios} />
        <DashboardStatCard label="Profesores" value={resumen.totalProfesores} />
        <DashboardStatCard label="Alumnos" value={resumen.totalAlumnos} />
        <DashboardStatCard
          label="Planes activos"
          value={resumen.totalPlanificacionesActivas}
        />
        <DashboardStatCard
          label="Sesiones completadas"
          value={resumen.sesionesCompletadas}
        />
        <DashboardStatCard
          label="Alumnos con actividad"
          value={resumen.alumnosConActividad}
        />
      </section>

      <section className="rounded-2xl border border-border bg-card px-4 py-4 shadow-sm sm:px-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Última actividad global
        </p>
        <p className="mt-1 text-sm text-foreground">{resumen.ultimaActividad}</p>
      </section>

      <DashboardActivityCharts
        sesionesPorDia={data.sesionesPorDia}
        planesPorDia={data.planesPorDia}
        sesionesTitle="Sesiones en toda la plataforma"
        planesTitle="Planes creados en toda la plataforma"
      />

      <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            Gimnasios registrados
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Última actividad = última sesión completada por alumnos de ese tenant.
          </p>
        </div>

        <Tabs defaultValue="todos">
          <TabsList className="max-w-full flex-wrap">
            <TabsTrigger value="todos">Todos ({counts.todos})</TabsTrigger>
            <TabsTrigger value="activos">Activos ({counts.activos})</TabsTrigger>
            <TabsTrigger value="suspendidos">
              Otros estados ({counts.suspendidos})
            </TabsTrigger>
            <TabsTrigger value="con-actividad">
              Con actividad ({counts['con-actividad']})
            </TabsTrigger>
            <TabsTrigger value="sin-actividad">
              Sin actividad ({counts['sin-actividad']})
            </TabsTrigger>
          </TabsList>

          {(
            [
              'todos',
              'activos',
              'suspendidos',
              'con-actividad',
              'sin-actividad',
            ] as TabId[]
          ).map((tab) => (
            <TabsContent key={tab} value={tab}>
              <GimnasiosTable rows={filterGimnasios(gimnasios, tab)} />
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </div>
  );
}
