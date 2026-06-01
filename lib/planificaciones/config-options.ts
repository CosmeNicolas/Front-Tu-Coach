import {
  BLOQUE_MODE_FREQUENCY,
  PlanificationConfig,
  ProgressionMode,
  PROGRESSION_MODE_LABELS,
  computeTotalSesiones,
} from '@/types/planification';

export const PLAN_WEEK_OPTIONS = [1, 2, 3, 4] as const;
export const WEEKLY_FREQUENCY_OPTIONS = [1, 2, 3, 4, 5] as const;

export interface OpcionSesiones {
  totalSesiones: number;
  semanasDelPlan: number;
  label: string;
}

/** Múltiplos CEMD: freq × 1..4 semanas (ej. 3 → 3, 6, 9, 12) */
export function opcionesSesiones(
  frecuenciaSemanal: number,
): OpcionSesiones[] {
  return PLAN_WEEK_OPTIONS.map((s) => {
    const total = s * frecuenciaSemanal;
    return {
      totalSesiones: total,
      semanasDelPlan: s,
      label: `${total} sesiones (${s} semana${s > 1 ? 's' : ''})`,
    };
  });
}

export function esModoLineal(modo: ProgressionMode): boolean {
  return modo === ProgressionMode.LINEAL;
}

export function modoProgresionParaFrecuencia(
  frecuencia: number,
): ProgressionMode {
  if (frecuencia <= 1) return ProgressionMode.LINEAL;
  if (frecuencia === 2) return ProgressionMode.BLOQUE_X2;
  if (frecuencia === 3) return ProgressionMode.BLOQUE_X3;
  if (frecuencia === 4) return ProgressionMode.BLOQUE_X4;
  return ProgressionMode.BLOQUE_X5;
}

export function descripcionProgresion(config: PlanificationConfig): string {
  const { modoProgresion, frecuenciaSemanal, semanasDelPlan, totalSesiones } =
    config;
  if (esModoLineal(modoProgresion)) {
    return `Lineal: ${totalSesiones} sesiones consecutivas (${frecuenciaSemanal} días/sem × ${semanasDelPlan} sem).`;
  }
  const bloques = BLOQUE_MODE_FREQUENCY[modoProgresion] ?? 0;
  return `${PROGRESSION_MODE_LABELS[modoProgresion]}: ${bloques} bloques alternados (sesión → bloque con módulo), ${frecuenciaSemanal} sesiones/sem × ${semanasDelPlan} sem = ${totalSesiones} sesiones.`;
}

export function aplicarCambioConfig(
  actual: PlanificationConfig,
  partial: Partial<PlanificationConfig>,
): PlanificationConfig {
  let next = { ...actual, ...partial };

  if (partial.frecuenciaSemanal !== undefined) {
    next.frecuenciaSemanal = Math.min(
      5,
      Math.max(1, partial.frecuenciaSemanal),
    );
  }

  if (partial.totalSesiones !== undefined && partial.semanasDelPlan === undefined) {
    next.semanasDelPlan = Math.max(
      1,
      Math.min(
        4,
        Math.round(partial.totalSesiones / Math.max(1, next.frecuenciaSemanal)),
      ),
    );
  }

  if (partial.semanasDelPlan !== undefined && partial.totalSesiones === undefined) {
    next.semanasDelPlan = Math.min(4, Math.max(1, partial.semanasDelPlan));
    next.totalSesiones = computeTotalSesiones(
      next.semanasDelPlan,
      next.frecuenciaSemanal,
    );
  }

  if (
    partial.modoProgresion !== undefined ||
    partial.frecuenciaSemanal !== undefined ||
    partial.semanasDelPlan !== undefined
  ) {
    next.totalSesiones = computeTotalSesiones(
      next.semanasDelPlan,
      next.frecuenciaSemanal,
    );
  }

  return next;
}

export function aplicarCambioModo(
  actual: PlanificationConfig,
  modo: ProgressionMode,
): PlanificationConfig {
  const next = aplicarCambioConfig(actual, { modoProgresion: modo });
  const ops = opcionesSesiones(next.frecuenciaSemanal);
  const mejor =
    ops.find((o) => o.totalSesiones === actual.totalSesiones) ??
    ops[ops.length - 1];
  return aplicarCambioConfig(next, {
    semanasDelPlan: mejor.semanasDelPlan,
    totalSesiones: mejor.totalSesiones,
  });
}

export function aplicarCambioFrecuencia(
  actual: PlanificationConfig,
  frecuencia: number,
): PlanificationConfig {
  const freq = Math.min(5, Math.max(1, frecuencia));
  const next = aplicarCambioConfig(actual, { frecuenciaSemanal: freq });
  const ops = opcionesSesiones(next.frecuenciaSemanal);
  const mejor =
    ops.find((o) => o.totalSesiones === actual.totalSesiones) ?? ops[0];
  return aplicarCambioConfig(next, {
    semanasDelPlan: mejor.semanasDelPlan,
    totalSesiones: mejor.totalSesiones,
  });
}

export function aplicarCambioTotalSesiones(
  actual: PlanificationConfig,
  totalSesiones: number,
): PlanificationConfig {
  const op = opcionesSesiones(actual.frecuenciaSemanal).find(
    (o) => o.totalSesiones === totalSesiones,
  );
  if (!op) return actual;
  return aplicarCambioConfig(actual, {
    totalSesiones: op.totalSesiones,
    semanasDelPlan: op.semanasDelPlan,
  });
}

export function aplicarCambioSemanas(
  actual: PlanificationConfig,
  semanas: number,
): PlanificationConfig {
  const semanasDelPlan = Math.min(4, Math.max(1, semanas));
  return aplicarCambioConfig(actual, { semanasDelPlan });
}
