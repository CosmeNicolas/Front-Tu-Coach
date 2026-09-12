import { PlanificationProgress } from '@/types/planification';

const DAY_MS = 24 * 60 * 60 * 1000;
const AR_OFFSET_MS = -3 * 60 * 60 * 1000;

export interface TrainingActivitySnapshot {
  rachaSesiones: number;
  rachaMaxima: number;
  diasDesdeUltimaSesion: number | null;
  ultimaSesionNum: number | null;
  ultimaSesionFecha: string | null;
  proximaSesionNum: number | null;
  sesionesSemanaActual: number;
  sesionesEsperadasSemana: number;
  faltaSesionSemana: boolean;
  inactivoDosDias: boolean;
  necesitaRecordatorio: boolean;
  recordatorioMotivo: 'inactividad' | 'semana_incompleta' | null;
  recordatorioLabel: string | null;
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function toArgentinaDateParts(date: Date) {
  const ar = new Date(date.getTime() + AR_OFFSET_MS);
  return {
    year: ar.getUTCFullYear(),
    month: ar.getUTCMonth() + 1,
    day: ar.getUTCDate(),
    dayOfWeek: ar.getUTCDay(),
  };
}

function argentinaDateKey(date: Date): string {
  const p = toArgentinaDateParts(date);
  return `${p.year}-${pad2(p.month)}-${pad2(p.day)}`;
}

function argentinaWeekStartKey(date: Date): string {
  const p = toArgentinaDateParts(date);
  const mondayOffset = p.dayOfWeek === 0 ? -6 : 1 - p.dayOfWeek;
  const monday = new Date(
    Date.UTC(p.year, p.month - 1, p.day + mondayOffset),
  );
  return `${monday.getUTCFullYear()}-${pad2(monday.getUTCMonth() + 1)}-${pad2(monday.getUTCDate())}`;
}

function calendarDaysBetween(from: Date, to: Date): number {
  const a = argentinaDateKey(from);
  const b = argentinaDateKey(to);
  if (a === b) return 0;
  const fromMs = Date.parse(`${a}T12:00:00.000Z`);
  const toMs = Date.parse(`${b}T12:00:00.000Z`);
  return Math.floor(Math.abs(toMs - fromMs) / DAY_MS);
}

function computeConsecutiveFromStart(completadas: number[], total: number): number {
  const set = new Set(completadas);
  let streak = 0;
  for (let n = 1; n <= total; n += 1) {
    if (set.has(n)) streak += 1;
    else break;
  }
  return streak;
}

function computeLongestConsecutiveStreak(completadas: number[]): number {
  if (!completadas.length) return 0;
  const sorted = [...new Set(completadas)].sort((a, b) => a - b);
  let best = 1;
  let current = 1;
  for (let i = 1; i < sorted.length; i += 1) {
    if (sorted[i] === sorted[i - 1]! + 1) {
      current += 1;
      best = Math.max(best, current);
    } else {
      current = 1;
    }
  }
  return best;
}

function findLatestSession(progress?: PlanificationProgress) {
  let latest: { num: number; fecha: string; ms: number } | null = null;
  for (const n of progress?.completadas ?? []) {
    const fecha = progress?.fechas?.[n - 1]?.trim();
    if (!fecha) continue;
    const ms = Date.parse(fecha);
    if (Number.isNaN(ms)) continue;
    if (!latest || ms > latest.ms) latest = { num: n, fecha, ms };
  }
  return latest ? { num: latest.num, fecha: latest.fecha } : null;
}

function findProximaSesion(progress: PlanificationProgress | undefined, total: number) {
  const set = new Set(progress?.completadas ?? []);
  for (let n = 1; n <= total; n += 1) {
    if (!set.has(n)) return n;
  }
  return null;
}

function countSessionsInCurrentWeek(progress: PlanificationProgress | undefined, now: Date) {
  const weekKey = argentinaWeekStartKey(now);
  let count = 0;
  for (const n of progress?.completadas ?? []) {
    const fecha = progress?.fechas?.[n - 1]?.trim();
    if (!fecha) continue;
    const d = new Date(fecha);
    if (Number.isNaN(d.getTime())) continue;
    if (argentinaWeekStartKey(d) === weekKey) count += 1;
  }
  return count;
}

export function buildTrainingActivitySnapshot(
  progress: PlanificationProgress | undefined,
  totalSesiones: number,
  frecuenciaSemanal: number,
  options?: { now?: Date; planStartedAt?: Date | string | null },
): TrainingActivitySnapshot {
  const now = options?.now ?? new Date();
  const completadas = progress?.completadas ?? [];
  const freq = Math.max(1, Math.min(5, frecuenciaSemanal));
  const proximaSesionNum = findProximaSesion(progress, totalSesiones);
  const latest = findLatestSession(progress);
  const sesionesSemanaActual = countSessionsInCurrentWeek(progress, now);
  const dayOfWeek = toArgentinaDateParts(now).dayOfWeek;

  let diasDesdeUltimaSesion: number | null = null;
  if (latest) {
    diasDesdeUltimaSesion = calendarDaysBetween(new Date(latest.fecha), now);
  } else if (options?.planStartedAt) {
    diasDesdeUltimaSesion = calendarDaysBetween(
      new Date(options.planStartedAt),
      now,
    );
  }

  const planPendiente = proximaSesionNum !== null;
  const inactivoDosDias =
    planPendiente &&
    diasDesdeUltimaSesion !== null &&
    diasDesdeUltimaSesion >= 2;
  const faltaSesionSemana =
    planPendiente &&
    sesionesSemanaActual < freq &&
    (dayOfWeek >= 4 || dayOfWeek === 0);
  const necesitaRecordatorio = planPendiente && (inactivoDosDias || faltaSesionSemana);

  let recordatorioMotivo: TrainingActivitySnapshot['recordatorioMotivo'] = null;
  if (necesitaRecordatorio) {
    recordatorioMotivo = inactivoDosDias ? 'inactividad' : 'semana_incompleta';
  }

  let recordatorioLabel: string | null = null;
  if (inactivoDosDias && diasDesdeUltimaSesion !== null) {
    recordatorioLabel = `Hace ${diasDesdeUltimaSesion} día${diasDesdeUltimaSesion === 1 ? '' : 's'} sin entrenar`;
  } else if (faltaSesionSemana) {
    const faltan = freq - sesionesSemanaActual;
    recordatorioLabel = `Falta${faltan === 1 ? '' : 'n'} ${faltan} sesión${faltan === 1 ? '' : 'es'} esta semana`;
  }

  return {
    rachaSesiones: computeConsecutiveFromStart(completadas, totalSesiones),
    rachaMaxima: computeLongestConsecutiveStreak(completadas),
    diasDesdeUltimaSesion,
    ultimaSesionNum: latest?.num ?? null,
    ultimaSesionFecha: latest?.fecha ?? null,
    proximaSesionNum,
    sesionesSemanaActual,
    sesionesEsperadasSemana: freq,
    faltaSesionSemana,
    inactivoDosDias,
    necesitaRecordatorio,
    recordatorioMotivo,
    recordatorioLabel,
  };
}

export function streakLabel(snapshot: TrainingActivitySnapshot): string {
  if (snapshot.rachaSesiones <= 0) return 'Sin racha aún';
  return `${snapshot.rachaSesiones} sesión${snapshot.rachaSesiones === 1 ? '' : 'es'} seguidas`;
}
