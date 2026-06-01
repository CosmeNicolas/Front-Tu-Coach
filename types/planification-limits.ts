/**
 * Topes de seguridad por defecto del Asistente de Planificación.
 *
 * @sync-with tucoach-back/src/common/constants/planification-limits.const.ts
 * Mantener sincronizado con el backend; si cambia un valor allá, espejalo acá.
 */
export const PLANIFICATION_LIMITS = {
  calentamiento: {
    minutosIniciales: { min: 1, max: 30 },
    incrementoMinutos: { min: 0, max: 10 },
    topeMinutos: 30,
  },
  vueltaCalma: {
    minutosIniciales: { min: 1, max: 20 },
    incrementoMinutos: { min: 0, max: 10 },
    topeMinutos: 20,
  },
  isometrico: {
    segundosIniciales: { min: 5, max: 120 },
    incrementoSegundos: { min: 0, max: 30 },
    topeSegundos: 120,
    series: { min: 1, max: 10 },
  },
  aerobicoPrincipal: {
    minutosIniciales: { min: 1, max: 60 },
    incrementoMinutos: { min: 0, max: 10 },
    topeMinutos: 60,
  },
  fuerza: {
    series: { min: 1, max: 10 },
    reps: { min: 1, max: 50 },
    peso: { min: 0, max: 500 },
    descanso: { min: 0, max: 600 },
    incrementoPeso: { min: 0, max: 25 },
    incrementoReps: { min: 0, max: 5 },
  },
} as const;
