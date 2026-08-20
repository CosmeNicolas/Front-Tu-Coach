import { countSessionExercises } from '@/lib/alumno/flatten-materialized';
import { StudentMaterializedPlanification } from '@/lib/api/student-portal';
import { StudentProgressExtended } from '@/types/alumno-session';

export interface ChartPoint {
  label: string;
  value: number;
  /** Segundos originales (tooltips de duración). */
  seconds?: number;
}

function dayKey(isoDate: string): string | null {
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

function formatDayLabel(isoDay: string): string {
  const d = new Date(isoDay + 'T12:00:00');
  return d.toLocaleDateString('es-AR', { weekday: 'short', day: '2-digit', month: 'short' });
}

function mondayKey(d: Date): string {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  const day = copy.getDay();
  const diff = copy.getDate() - day + (day === 0 ? -6 : 1);
  copy.setDate(diff);
  return copy.toISOString().slice(0, 10);
}

function formatWeekLabel(isoMonday: string): string {
  const d = new Date(isoMonday);
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' });
}

function formatMonthLabel(yearMonth: string): string {
  const [year, month] = yearMonth.split('-');
  const d = new Date(Number(year), Number(month) - 1, 1);
  return d.toLocaleDateString('es-AR', { month: 'short', year: '2-digit' });
}

function monthKey(isoDate: string): string | null {
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

function bucketDatesByMonth(fechas: string[]): ChartPoint[] {
  const buckets = new Map<string, { label: string; value: number; sort: string }>();

  for (const fecha of fechas) {
    if (!fecha?.trim()) continue;
    const key = monthKey(fecha);
    if (!key) continue;
    const existing = buckets.get(key);
    if (existing) {
      existing.value += 1;
    } else {
      buckets.set(key, {
        label: formatMonthLabel(key),
        value: 1,
        sort: key,
      });
    }
  }

  return [...buckets.values()]
    .sort((a, b) => a.sort.localeCompare(b.sort))
    .slice(-12)
    .map(({ label, value }) => ({ label, value }));
}

export function buildWeeklyCompletions(
  fechas: string[],
  completadas: number[],
): ChartPoint[] {
  const dates = completadas
    .map((n) => fechas[n - 1])
    .filter((f): f is string => Boolean(f?.trim()));
  return bucketDatesByWeek(dates);
}

function bucketDatesByWeek(fechas: string[]): ChartPoint[] {
  const buckets = new Map<string, { label: string; value: number; sort: string }>();

  for (const fecha of fechas) {
    const d = new Date(fecha);
    if (Number.isNaN(d.getTime())) continue;
    const key = mondayKey(d);
    const existing = buckets.get(key);
    if (existing) {
      existing.value += 1;
    } else {
      buckets.set(key, {
        label: formatWeekLabel(key),
        value: 1,
        sort: key,
      });
    }
  }

  return [...buckets.values()]
    .sort((a, b) => a.sort.localeCompare(b.sort))
    .slice(-8)
    .map(({ label, value }) => ({ label, value }));
}

export function buildMonthlyCompletions(
  fechas: string[],
  completadas: number[],
): ChartPoint[] {
  const dates = completadas
    .map((n) => fechas[n - 1])
    .filter((f): f is string => Boolean(f?.trim()));
  return bucketDatesByMonth(dates);
}

export function buildAggregateMonthlyCompletions(
  items: Array<{ fechasCompletadas: string[] }>,
): ChartPoint[] {
  const allDates = items.flatMap((item) => item.fechasCompletadas ?? []);
  return bucketDatesByMonth(allDates);
}

export function buildRpePerSession(
  progress: StudentProgressExtended,
  totalSesiones: number,
): ChartPoint[] {
  const points: ChartPoint[] = [];
  for (let n = 1; n <= totalSesiones; n += 1) {
    const key = String(n);
    const det = progress.detallePorSesion[key];
    const raw = det?.rpe?.value ?? progress.rpePorSesion[key];
    if (typeof raw === 'number' && raw >= 1 && raw <= 10) {
      points.push({ label: `S${n}`, value: raw });
    }
  }
  return points;
}

export function buildExercisesPerSession(
  materialized: StudentMaterializedPlanification,
): ChartPoint[] {
  const { progreso, sesiones } = materialized;
  const points: ChartPoint[] = [];

  for (const sesion of sesiones) {
    const n = sesion.numero;
    const assigned = countSessionExercises(sesion);
    if (assigned === 0) continue;
    const det = progreso.detallePorSesion[String(n)];
    const completed =
      det?.exercises?.filter((e) => e.completed).length ??
      (progreso.completadas.includes(n) ? assigned : 0);
    points.push({
      label: `S${n}`,
      value: Math.min(completed, assigned),
    });
  }

  return points;
}

export function countAssignedExercises(
  materialized: StudentMaterializedPlanification,
): number {
  return materialized.sesiones.reduce(
    (acc, s) => acc + countSessionExercises(s),
    0,
  );
}

interface SessionMetricRow {
  sessionNum: number;
  fecha: string;
  sessionDurationSeconds: number;
  totalVolumeKg: number;
}

function buildSessionMetricRows(
  progress: StudentProgressExtended,
): SessionMetricRow[] {
  const rows: SessionMetricRow[] = [];
  for (const n of progress.completadas) {
    const fecha = progress.fechas[n - 1]?.trim();
    if (!fecha) continue;
    const det = progress.detallePorSesion[String(n)];
    rows.push({
      sessionNum: n,
      fecha,
      sessionDurationSeconds: det?.sessionDurationSeconds ?? 0,
      totalVolumeKg: det?.totalVolumeKg ?? 0,
    });
  }
  return rows;
}

function bucketMetricByDay(
  rows: SessionMetricRow[],
  field: 'sessionDurationSeconds' | 'totalVolumeKg',
): ChartPoint[] {
  const buckets = new Map<
    string,
    { label: string; value: number; seconds: number; sort: string }
  >();

  for (const row of rows) {
    const key = dayKey(row.fecha);
    if (!key) continue;
    const addSeconds = field === 'sessionDurationSeconds' ? row.sessionDurationSeconds : 0;
    const add =
      field === 'sessionDurationSeconds'
        ? Math.round(row.sessionDurationSeconds / 60)
        : row.totalVolumeKg;
    const existing = buckets.get(key);
    if (existing) {
      existing.value += add;
      existing.seconds += addSeconds;
    } else {
      buckets.set(key, {
        label: formatDayLabel(key),
        value: add,
        seconds: addSeconds,
        sort: key,
      });
    }
  }

  return [...buckets.values()]
    .sort((a, b) => a.sort.localeCompare(b.sort))
    .slice(-14)
    .map(({ label, value, seconds }) => ({
      label,
      value: Math.round(value * 10) / 10,
      seconds: field === 'sessionDurationSeconds' ? seconds : undefined,
    }));
}

function bucketMetricByMonth(
  rows: SessionMetricRow[],
  field: 'sessionDurationSeconds' | 'totalVolumeKg',
): ChartPoint[] {
  const buckets = new Map<
    string,
    { label: string; value: number; seconds: number; sort: string }
  >();

  for (const row of rows) {
    const key = monthKey(row.fecha);
    if (!key) continue;
    const addSeconds =
      field === 'sessionDurationSeconds' ? row.sessionDurationSeconds : 0;
    const add =
      field === 'sessionDurationSeconds'
        ? Math.round(row.sessionDurationSeconds / 60)
        : row.totalVolumeKg;
    const existing = buckets.get(key);
    if (existing) {
      existing.value += add;
      existing.seconds += addSeconds;
    } else {
      buckets.set(key, {
        label: formatMonthLabel(key),
        value: add,
        seconds: addSeconds,
        sort: key,
      });
    }
  }

  return [...buckets.values()]
    .sort((a, b) => a.sort.localeCompare(b.sort))
    .slice(-12)
    .map(({ label, value, seconds }) => ({
      label,
      value: Math.round(value * 10) / 10,
      seconds: field === 'sessionDurationSeconds' ? seconds : undefined,
    }));
}

function bucketMetricByWeek(
  rows: SessionMetricRow[],
  field: 'sessionDurationSeconds' | 'totalVolumeKg',
): ChartPoint[] {
  const buckets = new Map<
    string,
    { label: string; value: number; seconds: number; sort: string }
  >();

  for (const row of rows) {
    const d = new Date(row.fecha);
    if (Number.isNaN(d.getTime())) continue;
    const key = mondayKey(d);
    const addSeconds =
      field === 'sessionDurationSeconds' ? row.sessionDurationSeconds : 0;
    const add =
      field === 'sessionDurationSeconds'
        ? Math.round(row.sessionDurationSeconds / 60)
        : row.totalVolumeKg;
    const existing = buckets.get(key);
    if (existing) {
      existing.value += add;
      existing.seconds += addSeconds;
    } else {
      buckets.set(key, {
        label: formatWeekLabel(key),
        value: add,
        seconds: addSeconds,
        sort: key,
      });
    }
  }

  return [...buckets.values()]
    .sort((a, b) => a.sort.localeCompare(b.sort))
    .slice(-8)
    .map(({ label, value, seconds }) => ({
      label,
      value: Math.round(value * 10) / 10,
      seconds: field === 'sessionDurationSeconds' ? seconds : undefined,
    }));
}

function withRecordedTrainingTime(points: ChartPoint[]): ChartPoint[] {
  return points.filter((p) => (p.seconds ?? 0) > 0);
}

export interface SessionTrainingRow {
  sessionNum: number;
  fecha: string;
  sessionDurationSeconds: number;
  planTitulo?: string;
}

function sessionMetricRowToTrainingRow(
  row: SessionMetricRow,
  planTitulo?: string,
): SessionTrainingRow {
  return {
    sessionNum: row.sessionNum,
    fecha: row.fecha,
    sessionDurationSeconds: row.sessionDurationSeconds,
    planTitulo,
  };
}

/** Filas de sesiones con tiempo registrado, más recientes primero. */
export function buildSessionTrainingRows(
  progress: StudentProgressExtended,
  planTitulo?: string,
): SessionTrainingRow[] {
  return buildSessionMetricRows(progress)
    .filter((row) => row.sessionDurationSeconds > 0)
    .map((row) => sessionMetricRowToTrainingRow(row, planTitulo))
    .sort((a, b) => b.fecha.localeCompare(a.fecha));
}

function buildTrainingTimePerSessionFromRows(
  rows: SessionMetricRow[],
  labelForRow?: (row: SessionMetricRow) => string,
): ChartPoint[] {
  return withRecordedTrainingTime(
    [...rows]
      .sort((a, b) => a.sessionNum - b.sessionNum)
      .map((row) => ({
        label: labelForRow ? labelForRow(row) : `S${row.sessionNum}`,
        value: Math.round((row.sessionDurationSeconds / 60) * 10) / 10,
        seconds: row.sessionDurationSeconds,
      })),
  );
}

function buildDailyTrainingMinutesFromRows(rows: SessionMetricRow[]): ChartPoint[] {
  return withRecordedTrainingTime(
    bucketMetricByDay(rows, 'sessionDurationSeconds'),
  );
}

function buildMonthlyTrainingMinutesFromRows(rows: SessionMetricRow[]): ChartPoint[] {
  return withRecordedTrainingTime(
    bucketMetricByMonth(rows, 'sessionDurationSeconds'),
  );
}

function buildWeeklyTrainingMinutesFromRows(rows: SessionMetricRow[]): ChartPoint[] {
  return withRecordedTrainingTime(
    bucketMetricByWeek(rows, 'sessionDurationSeconds'),
  );
}

/** Tiempo de entrenamiento (min) por cada sesión completada. */
export function buildTrainingTimePerSession(
  progress: StudentProgressExtended,
): ChartPoint[] {
  return buildTrainingTimePerSessionFromRows(buildSessionMetricRows(progress));
}

export function buildDailyTrainingMinutes(
  progress: StudentProgressExtended,
): ChartPoint[] {
  return buildDailyTrainingMinutesFromRows(buildSessionMetricRows(progress));
}

export function buildMonthlyTrainingMinutes(
  progress: StudentProgressExtended,
): ChartPoint[] {
  return buildMonthlyTrainingMinutesFromRows(buildSessionMetricRows(progress));
}

export function buildWeeklyTrainingMinutes(
  progress: StudentProgressExtended,
): ChartPoint[] {
  return buildWeeklyTrainingMinutesFromRows(buildSessionMetricRows(progress));
}

function shortPlanLabel(titulo: string, max = 12): string {
  const t = titulo.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max)}…`;
}

export interface CombinedTrainingData {
  trainingPerSession: ChartPoint[];
  trainingDaily: ChartPoint[];
  trainingWeekly: ChartPoint[];
  trainingMonthly: ChartPoint[];
  sessionRows: SessionTrainingRow[];
  totalTrainingSeconds: number;
}

/** Agrega tiempos de entrenamiento de varios planes (vista historial). */
export function buildCombinedTrainingData(
  items: Array<{ progress: StudentProgressExtended; planTitulo: string }>,
): CombinedTrainingData {
  const enrichedRows = items.flatMap(({ progress, planTitulo }) =>
    buildSessionMetricRows(progress)
      .filter((row) => row.sessionDurationSeconds > 0)
      .map((row) => ({ ...row, planTitulo })),
  );

  const sessionRows = enrichedRows
    .map((row) => sessionMetricRowToTrainingRow(row, row.planTitulo))
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  const perSessionRows = [...enrichedRows]
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .slice(-14);

  return {
    trainingPerSession: buildTrainingTimePerSessionFromRows(
      perSessionRows,
      (row) => {
        const planTitulo =
          'planTitulo' in row
            ? (row as SessionMetricRow & { planTitulo: string }).planTitulo
            : '';
        return planTitulo
          ? `${shortPlanLabel(planTitulo)} S${row.sessionNum}`
          : `S${row.sessionNum}`;
      },
    ),
    trainingDaily: buildDailyTrainingMinutesFromRows(enrichedRows),
    trainingWeekly: buildWeeklyTrainingMinutesFromRows(enrichedRows),
    trainingMonthly: buildMonthlyTrainingMinutesFromRows(enrichedRows),
    sessionRows,
    totalTrainingSeconds: enrichedRows.reduce(
      (acc, row) => acc + row.sessionDurationSeconds,
      0,
    ),
  };
}

export function buildMonthlyVolumeKg(
  progress: StudentProgressExtended,
): ChartPoint[] {
  return bucketMetricByMonth(buildSessionMetricRows(progress), 'totalVolumeKg');
}

export function buildWeeklyVolumeKg(
  progress: StudentProgressExtended,
): ChartPoint[] {
  return bucketMetricByWeek(buildSessionMetricRows(progress), 'totalVolumeKg');
}
