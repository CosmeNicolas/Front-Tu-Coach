'use client';

import { useAuth } from '@/hooks/useAuth';
import { useMiPerfil, useMiPlanificacion } from '@/hooks/useStudentPortal';
import { useMyCoachRelationships } from '@/hooks/useCoachRelationships';

/**
 * Alumno cuyo profesor asignado es él mismo y no tiene un coach aceptado.
 * Si el perfil ya trae el flag del servidor, ese manda.
 */
export function useTrainsAlone() {
  const { data: me, isLoading: loadingMe } = useAuth();
  const { data: perfil, isLoading: loadingPerfil } = useMiPerfil();
  const { data: plan, isLoading: loadingPlan } = useMiPlanificacion();
  const { data: relationships, isLoading: loadingRel } = useMyCoachRelationships();

  const hasExternalCoach = (relationships?.items ?? []).some(
    (item) => item.status === 'accepted' && item.profesorUserId !== me?.id,
  );
  const selfAssigned = Boolean(
    me?.id && plan?.profesorId && plan.profesorId === me.id,
  );
  const inferred = selfAssigned && !hasExternalCoach;
  const trainsAlone =
    typeof perfil?.entrenandoSolo === 'boolean'
      ? perfil.entrenandoSolo
      : inferred;

  return {
    trainsAlone,
    isLoading: loadingMe || loadingPerfil || loadingPlan || loadingRel,
  };
}
