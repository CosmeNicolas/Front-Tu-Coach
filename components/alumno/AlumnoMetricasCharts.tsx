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
import { formatSessionClock, formatTrainingMinutes } from '@/lib/alumno/format-time';

const CHART_PRIMARY = '#525252';
const CHART_MUTED = '#a3a3a3';
const CHART_GRID = '#404040';

interface BarChartBlockProps {
  title: string;
  description?: string;
  data: ChartPoint[];
  valueLabel?: string;
  maxDomain?: number;
  allowDecimals?: boolean;
  durationTooltip?: boolean;
  emptyMessage?: string;
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
  allowDecimals = false,
  durationTooltip = false,
  emptyMessage = 'Aún no hay datos para mostrar en este gráfico.',
}: BarChartBlockProps) {
  if (data.length === 0) {
    return (
      <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description ? (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        ) : null}
        <div className="mt-3">
          <EmptyChart message={emptyMessage} />
        </div>
      </section>
    );
  }

  const hasDuration = durationTooltip && data.some((d) => (d.seconds ?? 0) > 0);

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
              interval={0}
              angle={data.length > 6 ? -35 : 0}
              textAnchor={data.length > 6 ? 'end' : 'middle'}
              height={data.length > 6 ? 56 : 30}
            />
            <YAxis
              allowDecimals={allowDecimals}
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
              formatter={(value, _name, item) => {
                const seconds = (item?.payload as ChartPoint | undefined)?.seconds;
                if (hasDuration && typeof seconds === 'number' && seconds > 0) {
                  return [
                    `${formatSessionClock(seconds)} (${formatTrainingMinutes(seconds)})`,
                    valueLabel,
                  ];
                }
                return [value, valueLabel];
              }}
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
  monthly: ChartPoint[];
  rpe: ChartPoint[];
  exercises: ChartPoint[];
  trainingPerSession: ChartPoint[];
  trainingDaily: ChartPoint[];
  trainingWeekly: ChartPoint[];
  trainingMonthly: ChartPoint[];
  volumeWeekly: ChartPoint[];
  volumeMonthly: ChartPoint[];
}

const TRAINING_EMPTY =
  'Completá sesiones con el cronómetro de sesión iniciado para ver tiempos acá.';

export function AlumnoMetricasCharts({
  weekly,
  monthly,
  rpe,
  exercises,
  trainingPerSession,
  trainingDaily,
  trainingWeekly,
  trainingMonthly,
  volumeWeekly,
  volumeMonthly,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">
          Tiempo de entrenamiento
        </h2>
        <p className="text-xs text-muted-foreground">
          Cronómetro de sesión al finalizar cada entrenamiento
        </p>
      </div>

      <AlumnoBarChart
        title="Por sesión"
        description="Duración registrada en cada sesión completada"
        data={trainingPerSession}
        valueLabel="Minutos"
        allowDecimals
        durationTooltip
        emptyMessage={TRAINING_EMPTY}
      />
      <AlumnoBarChart
        title="Por día"
        description="Suma de minutos por día de entrenamiento"
        data={trainingDaily}
        valueLabel="Minutos"
        allowDecimals
        durationTooltip
        emptyMessage={TRAINING_EMPTY}
      />
      <AlumnoBarChart
        title="Por semana"
        description="Total de minutos por semana"
        data={trainingWeekly}
        valueLabel="Minutos"
        allowDecimals
        durationTooltip
        emptyMessage={TRAINING_EMPTY}
      />
      <AlumnoBarChart
        title="Por mes"
        description="Total de minutos por mes"
        data={trainingMonthly}
        valueLabel="Minutos"
        allowDecimals
        durationTooltip
        emptyMessage={TRAINING_EMPTY}
      />

      <div className="space-y-1 pt-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Carga y actividad
        </h2>
      </div>

      <AlumnoBarChart
        title="Carga levantada por mes (kg)"
        description="Volumen total: peso × series × reps (ejercicios completados)"
        data={volumeMonthly}
        valueLabel="kg"
        allowDecimals
      />
      <AlumnoBarChart
        title="Carga levantada por semana (kg)"
        data={volumeWeekly}
        valueLabel="kg"
        allowDecimals
      />
      <AlumnoBarChart
        title="Sesiones completadas por mes"
        description="Actividad mensual (últimos 12 meses con registros)"
        data={monthly}
        valueLabel="Sesiones"
      />
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
