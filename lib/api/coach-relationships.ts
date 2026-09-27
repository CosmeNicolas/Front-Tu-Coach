import { apiClient } from '@/lib/api/client';

export type CoachRelationshipStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'ended'
  | 'cancelled';

export type CoachRelationship = {
  id: string;
  status: CoachRelationshipStatus;
  initiatedBy: 'alumno' | 'profesor';
  alumnoUserId: string;
  alumnoClientId: string;
  profesorUserId: string;
  alumnoNombre?: string;
  profesorNombre?: string;
  professorSlug?: string | null;
  permissions: {
    viewHistory: boolean;
    chat: boolean;
    adjustPlan: boolean;
  };
  requestedAt: string;
  respondedAt: string | null;
  endedAt: string | null;
};

export function requestCoachRelationship(payload: {
  professorSlug?: string;
  profesorUserId?: string;
}) {
  return apiClient<CoachRelationship>('/coach-relationships/request', {
    method: 'POST',
    auth: true,
    body: payload,
  });
}

export function fetchMyCoachRelationships() {
  return apiClient<{ items: CoachRelationship[] }>(
    '/coach-relationships/mine',
    { auth: true },
  );
}

export function fetchCoachRelationshipStatus(slug: string) {
  return apiClient<{ status: CoachRelationshipStatus | null; relationshipId: string | null }>(
    `/coach-relationships/status?slug=${encodeURIComponent(slug)}`,
    { auth: true },
  );
}

export function fetchProfessorCoachInbox(status?: string) {
  const qs = status ? `?status=${encodeURIComponent(status)}` : '';
  return apiClient<{ items: CoachRelationship[] }>(
    `/coach-relationships/inbox${qs}`,
    { auth: true },
  );
}

export function acceptCoachRelationship(id: string) {
  return apiClient<CoachRelationship>(`/coach-relationships/${id}/accept`, {
    method: 'POST',
    auth: true,
  });
}

export function rejectCoachRelationship(id: string) {
  return apiClient<CoachRelationship>(`/coach-relationships/${id}/reject`, {
    method: 'POST',
    auth: true,
  });
}

export function cancelCoachRelationship(id: string) {
  return apiClient<CoachRelationship>(`/coach-relationships/${id}/cancel`, {
    method: 'POST',
    auth: true,
  });
}

export function endCoachRelationship(id: string) {
  return apiClient<CoachRelationship>(`/coach-relationships/${id}/end`, {
    method: 'POST',
    auth: true,
  });
}

export function setViewHistoryPermission(id: string, viewHistory: boolean) {
  return apiClient<CoachRelationship>(
    `/coach-relationships/${id}/permissions/view-history`,
    {
      method: 'PATCH',
      auth: true,
      body: { viewHistory },
    },
  );
}

export type CoachHistoryPlanItem = {
  id: string;
  titulo: string;
  estado: string;
  createdAt: string;
  updatedAt: string;
  progresoResumen: {
    completadas: number;
    total: number;
    porcentaje: number;
    proximaSesion: number | null;
  };
};

export type CoachHistoryList = {
  relationshipId: string;
  alumnoNombre: string;
  items: CoachHistoryPlanItem[];
};

export function fetchCoachHistory(relationshipId: string) {
  return apiClient<CoachHistoryList>(
    `/coach-relationships/${relationshipId}/history`,
    { auth: true },
  );
}

import type { MaterializedPlanification } from '@/types/planification';

export type CoachHistoryMaterialized = MaterializedPlanification & {
  relationshipId: string;
  titulo: string;
  estado: string;
  progresoResumen: {
    completadas: number;
    total: number;
    porcentaje: number;
    proximaSesion: number | null;
  };
  progreso: {
    completadas: number[];
    fechas: string[];
    rpePorSesion: Record<string, number>;
    comentarios: string[];
  };
};

export function fetchCoachHistoryMaterialized(
  relationshipId: string,
  planificationId: string,
) {
  return apiClient<CoachHistoryMaterialized>(
    `/coach-relationships/${relationshipId}/history/planifications/${planificationId}/materialized`,
    { auth: true },
  );
}

export function setChatPermission(id: string, chat: boolean) {
  return apiClient<CoachRelationship>(
    `/coach-relationships/${id}/permissions/chat`,
    {
      method: 'PATCH',
      auth: true,
      body: { chat },
    },
  );
}

export type CoachChatThread = {
  relationshipId: string;
  threadKey: string;
  alumnoId: string;
  alumnoNombre: string;
  profesorNombre: string | null;
  messages: Array<{
    id: string;
    threadKey: string;
    relationshipId?: string;
    senderRole: 'alumno' | 'profesor';
    senderUserId: string;
    text: string;
    readAtProfesor: string | null;
    readAtAlumno: string | null;
    createdAt: string;
  }>;
  unreadCount: number;
};

export function fetchCoachChat(relationshipId: string) {
  return apiClient<CoachChatThread>(
    `/coach-relationships/${relationshipId}/chat`,
    { auth: true },
  );
}

export function sendCoachChatMessage(relationshipId: string, text: string) {
  return apiClient<CoachChatThread['messages'][number]>(
    `/coach-relationships/${relationshipId}/chat`,
    {
      method: 'POST',
      auth: true,
      body: { text },
    },
  );
}

export function markCoachChatRead(relationshipId: string) {
  return apiClient<{ updated: number }>(
    `/coach-relationships/${relationshipId}/chat/read`,
    {
      method: 'PATCH',
      auth: true,
    },
  );
}
