import { PlanificationStatus } from '@/types/planification';

type PlanRef = {
  id: string;
  alumnoId?: string | null;
  estado: PlanificationStatus | string;
  updatedAt?: string | null;
};

/**
 * Entre los planes activos de un alumno, el portal muestra el de updatedAt
 * más reciente. No cambia el estado guardado.
 */
export function portalActualIds(plans: PlanRef[]): Set<string> {
  const best = new Map<string, { id: string; updatedAt: string }>();

  for (const plan of plans) {
    if (plan.estado !== PlanificationStatus.ACTIVE) continue;
    const key = plan.alumnoId || plan.id;
    const updatedAt = plan.updatedAt ?? '';
    const current = best.get(key);
    if (!current || updatedAt > current.updatedAt) {
      best.set(key, { id: plan.id, updatedAt });
    }
  }

  return new Set([...best.values()].map((item) => item.id));
}
