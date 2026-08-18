import { apiClient } from '@/lib/api/client';
import {
  MaterializedPlanification,
  Planification,
  PlanificationStatus,
} from '@/types/planification';
import {
  CompleteSessionPayloadV2,
  StudentProgressExtended,
} from '@/types/alumno-session';
import { StudentPerfil } from '@/types/alumno-perfil';

export interface StudentProgressSummary {
  completadas: number;
  total: number;
  porcentaje: number;
  proximaSesion: number | null;
}

export interface StudentPlanificationListItem {
  id: string;
  titulo: string;
  estado: PlanificationStatus;
  createdAt: string;
  updatedAt: string;
  progresoResumen: StudentProgressSummary;
  completada: boolean;
  finalizadaEn: string | null;
  fechasCompletadas: string[];
}

export interface StudentPlanification extends Planification {
  progresoResumen: StudentProgressSummary;
}

export interface StudentMaterializedPlanification
  extends MaterializedPlanification {
  progreso: StudentProgressExtended;
}

export interface CompleteSessionResult {
  planification: Planification;
  sessionNum: number;
  completedAt: string;
}

export function fetchMiPerfil() {
  return apiClient<StudentPerfil>('/alumno/mi-perfil', { auth: true });
}

export function fetchMiPlanificacion() {
  return apiClient<StudentPlanification>('/alumno/mi-planificacion', {
    auth: true,
  });
}

export function fetchMisPlanificaciones() {
  return apiClient<StudentPlanificationListItem[]>('/alumno/mis-planificaciones', {
    auth: true,
  });
}

export function fetchStudentMaterialized(planificationId: string) {
  return apiClient<StudentMaterializedPlanification>(
    `/alumno/planificaciones/${planificationId}/materialized`,
    { auth: true },
  );
}

export function completeStudentSession(
  planificationId: string,
  sessionNum: number,
  payload: CompleteSessionPayloadV2,
) {
  return apiClient<CompleteSessionResult>(
    `/alumno/planificaciones/${planificationId}/sessions/${sessionNum}/complete`,
    {
      method: 'POST',
      body: {
        rpeDetail: payload.rpe,
        sessionComment: payload.sessionComment,
        exercises: payload.exercises,
        notifyProfessor: payload.notifyProfessor ?? false,
        sessionDurationSeconds: payload.sessionDurationSeconds,
        totalVolumeKg: payload.totalVolumeKg,
      },
      auth: true,
    },
  );
}

export function solicitarNuevaPlanificacion(
  planificationId: string,
  mensaje?: string,
) {
  return apiClient<StudentPlanification>(
    `/alumno/planificaciones/${planificationId}/solicitar-nueva`,
    {
      method: 'POST',
      body: mensaje?.trim() ? { mensaje: mensaje.trim() } : {},
      auth: true,
    },
  );
}

export function isSessionCompleted(
  progress: Pick<StudentProgressExtended, 'completadas'>,
  sessionNum: number,
): boolean {
  return (progress.completadas ?? []).includes(sessionNum);
}

export function getSessionProgress(
  progress: StudentProgressExtended,
  sessionNum: number,
) {
  return progress.detallePorSesion?.[String(sessionNum)];
}

export function sessionRpe(
  progress: StudentProgressExtended,
  sessionNum: number,
): number | undefined {
  const det = getSessionProgress(progress, sessionNum);
  if (det?.rpe?.value) return det.rpe.value;
  return progress.rpePorSesion[String(sessionNum)];
}

export function sessionComment(
  progress: StudentProgressExtended,
  sessionNum: number,
): string {
  const det = getSessionProgress(progress, sessionNum);
  if (det?.sessionComment?.trim()) return det.sessionComment;
  return progress.comentarios[sessionNum - 1] ?? '';
}
