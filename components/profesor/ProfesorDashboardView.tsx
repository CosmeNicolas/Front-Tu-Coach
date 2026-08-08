'use client';

import Link from 'next/link';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useClients } from '@/hooks/useClients';
import { usePlanifications } from '@/hooks/usePlanifications';
import { usePrivateExercises } from '@/hooks/usePrivateExercises';
import { useTemplates } from '@/hooks/usePlanificationTemplates';
import {
  buildAlumnoDashboardRows,
  buildProfesorDashboardStats,
} from '@/lib/profesor/dashboard-stats';
import { PushNotificationsCard } from '@/components/notifications/PushNotificationsCard';
import { AlumnosDashboardTable } from '@/components/profesor/AlumnosDashboardTable';
import { PlanesARenovarPanel } from '@/components/profesor/PlanesARenovarPanel';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

const CHART_LINE = '#60a5fa';
const CHART_BAR = '#4ade80';
const CHART_MUTED = '#a3a3a3';
const CHART_GRID = '#404040';

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card px-4 py-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl tracking-wide text-foreground">
        {value}
      </p>
    </div>
  );
}

function ChartCard({
  title,
  children,
  empty,
}: {
  title: string;
  children: React.ReactNode;
  empty?: boolean;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <div className="mt-3 h-56 w-full">
        {empty ? (
          <p className="flex h-full items-center justify-center rounded-xl border border-dashed border-border px-4 text-center text-sm text-muted-foreground">
            Aún no hay datos para mostrar.
          </p>
        ) : (
          children
        )}
      </div>
    </section>
  );
}

export function ProfesorDashboardView() {
  const { data: clientsData, isLoading: loadingClients } = useClients({
    limit: 100,
  });
  const { data: plansData, isLoading: loadingPlans } = usePlanifications();
  const { data: exercisesData } = usePrivateExercises({ limit: 100 });
  const { data: templatesData } = useTemplates();

  const loading = loadingClients || loadingPlans;
  const clients = clientsData?.items ?? [];
  const plans = plansData?.items ?? [];
  const stats = buildProfesorDashboardStats(clients, plans, 14);
  const alumnoRows = buildAlumnoDashboardRows(clients, plans);
  const alumnoNameById = new Map(
    clients.map((c) => [c.id, `${c.apellido}, ${c.nombre}`]),
  );
  const ejerciciosPropios = exercisesData?.total ?? exercisesData?.items?.length ?? 0;
  const plantillas = templatesData?.total ?? templatesData?.items?.length ?? 0;

  const hasSesiones = stats.sesionesPorDia.some((p) => p.value > 0);
  const hasPlanesChart = stats.planesPorDia.some((p) => p.value > 0);

  return (
    <div className="space-y-6 p-4 sm:p-8">
      <header className="space-y-4">
        <div>
          <h1 className="font-display text-2xl tracking-wide text-foreground sm:text-3xl">
            Dashboard Profesor
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Resumen de tus alumnos, planificaciones y actividad reciente.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/profesor/alumnos/nuevo">Nuevo alumno</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/profesor/planificaciones/nueva">Nueva planificación</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/profesor/alumnos">Ver alumnos</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/profesor/planificaciones">Ver planificaciones</Link>
          </Button>
        </div>

        <PushNotificationsCard variant="banner" />
      </header>

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando tu resumen…</p>
      ) : (
        <>
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
            <StatCard label="Total alumnos" value={stats.totalAlumnos} />
            <StatCard label="Alumnos activos" value={stats.alumnosActivos} />
            <StatCard label="Planes activos" value={stats.planesActivos} />
            <StatCard label="Sin planificación" value={stats.alumnosSinPlan} />
            <StatCard
              label="Sesiones completadas"
              value={stats.sesionesCompletadas}
            />
            <StatCard label="Promedio de edad" value={stats.promedioEdad} />
          </section>

          <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="Total planes" value={stats.totalPlanes} />
            <StatCard label="Con plan activo" value={stats.alumnosConPlan} />
            <StatCard label="Plantillas" value={plantillas} />
            <StatCard label="Ejercicios propios" value={ejerciciosPropios} />
          </section>

          <PlanesARenovarPanel plans={plans} alumnoNameById={alumnoNameById} />

          <section className="grid gap-4 lg:grid-cols-2">
            <ChartCard
              title="Sesiones registradas por fecha"
              empty={!hasSesiones}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={stats.sesionesPorDia}
                  margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={CHART_GRID}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: CHART_MUTED, fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: CHART_MUTED, fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#262626',
                      border: '1px solid #404040',
                      borderRadius: 8,
                      color: '#fafafa',
                    }}
                    labelStyle={{ color: '#a3a3a3' }}
                    formatter={(value) => [Number(value ?? 0), 'Sesiones']}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={CHART_LINE}
                    strokeWidth={2}
                    dot={{ r: 3, fill: CHART_LINE }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Planificaciones creadas por fecha"
              empty={!hasPlanesChart}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.planesPorDia}
                  margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={CHART_GRID}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: CHART_MUTED, fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: CHART_MUTED, fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#262626',
                      border: '1px solid #404040',
                      borderRadius: 8,
                      color: '#fafafa',
                    }}
                    labelStyle={{ color: '#a3a3a3' }}
                    formatter={(value) => [Number(value ?? 0), 'Planes']}
                  />
                  <Bar
                    dataKey="value"
                    fill={CHART_BAR}
                    radius={[6, 6, 0, 0]}
                    maxBarSize={28}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </section>

          <section
            className={cn(
              'rounded-2xl border border-border bg-card px-4 py-4 shadow-sm sm:px-5',
            )}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Última actividad global
                </p>
                <p className="mt-1 text-sm text-foreground">
                  {stats.ultimaActividad}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link href="/profesor/alumnos">Gestionar alumnos</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/profesor/planificaciones">Ver planes</Link>
                </Button>
              </div>
            </div>
          </section>

          <AlumnosDashboardTable rows={alumnoRows} />
        </>
      )}
    </div>
  );
}
