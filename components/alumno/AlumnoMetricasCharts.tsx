'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartPoint } from '@/lib/alumno/chart-data';

const CHART_PRIMARY = '#525252';
const CHART_MUTED = '#a3a3a3';
const CHART_GRID = '#404040';

interface BarChartBlockProps {
  title: string;
  description?: string;
  data: ChartPoint[];
  valueLabel?: string;
  maxDomain?: number;
}

function EmptyChart({ message }: { message: string }) {
  return (
    <p className="flex h-48 items-center justify-center rounded-xl border border-dashed border-border px-4 text-center text-sm text-muted-foreground">
      {message}
    </p>
  );
}

function AlumnoBarChart({
  title,
  description,
  data,
  valueLabel = 'Valor',
  maxDomain,
}: BarChartBlockProps) {
  if (data.length === 0) {
    return (
      <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description ? (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        ) : null}
        <div className="mt-3">
          <EmptyChart message="Aún no hay datos para mostrar en este gráfico." />
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {description ? (
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      ) : null}
      <div className="mt-3 h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: CHART_MUTED, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              domain={maxDomain ? [0, maxDomain] : undefined}
              tick={{ fill: CHART_MUTED, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: '#262626',
                border: '1px solid #404040',
                borderRadius: '8px',
                color: '#fafafa',
              }}
              labelStyle={{ color: '#a3a3a3' }}
              formatter={(value) => [value, valueLabel]}
            />
            <Bar dataKey="value" fill={CHART_PRIMARY} radius={[6, 6, 0, 0]} maxBarSize={48} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

interface Props {
  weekly: ChartPoint[];
  rpe: ChartPoint[];
  exercises: ChartPoint[];
}

export function AlumnoMetricasCharts({ weekly, rpe, exercises }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <AlumnoBarChart
        title="Sesiones completadas por semana"
        description="Últimas semanas con al menos una sesión registrada"
        data={weekly}
        valueLabel="Sesiones"
      />
      <AlumnoBarChart
        title="RPE por sesión"
        description="Escala 1–10 de esfuerzo percibido"
        data={rpe}
        valueLabel="RPE"
        maxDomain={10}
      />
      <AlumnoBarChart
        title="Ejercicios completados por sesión"
        description="Según el registro al finalizar cada sesión"
        data={exercises}
        valueLabel="Ejercicios"
      />
    </div>
  );
}
