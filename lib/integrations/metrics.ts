/**
 * Placeholder — portal alumno: sesiones, RPE y métricas de progreso.
 * Fase posterior.
 */
export interface SessionProgressPayload {
  planificacionId: string;
  sessionNumber: number;
  rpe?: Record<string, number>;
  completed?: boolean;
  comment?: string;
}
