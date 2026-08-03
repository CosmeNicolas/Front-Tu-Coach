'use client';

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
import type { DashboardChartPoint } from '@/types/gym-admin';

const CHART_LINE = '#60a5fa';
const CHART_BAR = '#4ade80';
const CHART_MUTED = '#a3a3a3';
const CHART_GRID = '#404040';

export function DashboardStatCard({
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

function ChartShell({
  title,
  empty,
  children,
}: {
  title: string;
  empty?: boolean;
  children: React.ReactNode;
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

export function DashboardActivityCharts({
  sesionesPorDia,
  planesPorDia,
  sesionesTitle = 'Sesiones registradas por fecha',
  planesTitle = 'Planificaciones creadas por fecha',
}: {
  sesionesPorDia: DashboardChartPoint[];
  planesPorDia: DashboardChartPoint[];
  sesionesTitle?: string;
  planesTitle?: string;
}) {
  const hasSesiones = sesionesPorDia.some((p) => p.value > 0);
  const hasPlanes = planesPorDia.some((p) => p.value > 0);

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <ChartShell title={sesionesTitle} empty={!hasSesiones}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={sesionesPorDia}
            margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
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
              formatter={(value) => [Number(value ?? 0), 'Sesiones']}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={CHART_LINE}
              strokeWidth={2}
              dot={{ r: 3, fill: CHART_LINE }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartShell>

      <ChartShell title={planesTitle} empty={!hasPlanes}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={planesPorDia}
            margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
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
              formatter={(value) => [Number(value ?? 0), 'Planes']}
            />
            <Bar dataKey="value" fill={CHART_BAR} radius={[6, 6, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </ChartShell>
    </section>
  );
}
