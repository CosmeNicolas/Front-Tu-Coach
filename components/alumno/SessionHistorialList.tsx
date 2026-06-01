'use client';

import { StudentMaterializedPlanification } from '@/lib/api/student-portal';
import { AlumnoPlanificacionVertical } from './AlumnoPlanificacionVertical';

interface Props {
  planificationId: string;
  materialized: StudentMaterializedPlanification;
  highlightSession?: number;
}

/** @deprecated Usar AlumnoPlanificacionVertical directamente */
export function SessionHistorialList(props: Props) {
  return <AlumnoPlanificacionVertical {...props} />;
}
