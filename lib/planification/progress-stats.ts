import { PlanificationProgress } from '@/types/planification';

export interface SessionProgressRow {
  numero: number;
  completada: boolean;
  fecha: string | null;
  rpe: number | null;
  comentario: string | null;
}

export interface PlanificationProgressStats {
  totalSesiones: number;
  completadas: number;
  pendientes: number;
  adherenciaPct: number;
  rpePromedio: number | null;
  ejerciciosCompletados: number;
  ejerciciosRegistrados: number;
  filas: SessionProgressRow[];
}

export function buildProgressStats(
  progress: PlanificationProgress | undefined,
  totalSesiones: number,
): PlanificationProgressStats {
  const completadasSet = new Set(progress?.completadas ?? []);
  const fechas = progress?.fechas ?? [];
  const comentarios = progress?.comentarios ?? [];
  const rpeMap = progress?.rpePorSesion ?? {};

  const rpeValues: number[] = [];
  const filas: SessionProgressRow[] = [];
  let ejerciciosCompletados = 0;
  let ejerciciosRegistrados = 0;
  const detalle = progress?.detallePorSesion ?? {};

  for (let n = 1; n <= totalSesiones; n += 1) {
    const key = String(n);
    const det = detalle[key];
    const rpeRaw = det?.rpe?.value ?? rpeMap[key];
    const rpe =
      typeof rpeRaw === 'number' && rpeRaw >= 1 && rpeRaw <= 10 ? rpeRaw : null;
    if (rpe !== null) rpeValues.push(rpe);

    if (det?.exercises?.length) {
      ejerciciosRegistrados += det.exercises.length;
      ejerciciosCompletados += det.exercises.filter((e) => e.completed).length;
    }

    const comentarioSesion =
      det?.sessionComment?.trim() ||
      (comentarios[n - 1]?.trim() ? comentarios[n - 1] : null);

    filas.push({
      numero: n,
      completada: completadasSet.has(n),
      fecha: fechas[n - 1]?.trim() ? fechas[n - 1] : null,
      rpe,
      comentario: comentarioSesion,
    });
  }

  const completadas = completadasSet.size;
  const adherenciaPct =
    totalSesiones > 0 ? Math.round((completadas / totalSesiones) * 100) : 0;
  const rpePromedio =
    rpeValues.length > 0
      ? Math.round(
          (rpeValues.reduce((a, b) => a + b, 0) / rpeValues.length) * 10,
        ) / 10
      : null;

  return {
    totalSesiones,
    completadas,
    pendientes: totalSesiones - completadas,
    adherenciaPct,
    rpePromedio,
    ejerciciosCompletados,
    ejerciciosRegistrados,
    filas,
  };
}

export function formatProgressDate(iso: string | null): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('es-AR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}
