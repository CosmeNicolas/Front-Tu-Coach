import { PlanCodigo } from '@/types/admin';

export const PLAN_LABELS: Record<PlanCodigo, string> = {
  [PlanCodigo.FREE]: 'Free',
  [PlanCodigo.TRIAL]: 'Trial',
  [PlanCodigo.PREMIUM]: 'Premium',
  [PlanCodigo.PRO]: 'Pro',
};

export const PLAN_HINTS: Record<PlanCodigo, string> = {
  [PlanCodigo.FREE]: '2 alumnos · 1 plan activo',
  [PlanCodigo.TRIAL]: '30 alumnos · 30 planes',
  [PlanCodigo.PREMIUM]: '50 alumnos · 50 planes',
  [PlanCodigo.PRO]: '200 alumnos · 200 planes',
};

export function planLabel(codigo?: string | null): string {
  if (!codigo) return 'Premium';
  return PLAN_LABELS[codigo as PlanCodigo] ?? codigo;
}

export function formatCupo(usado: number, tope: number, libres: number): string {
  return `${usado} / ${tope} · ${libres} libres`;
}
