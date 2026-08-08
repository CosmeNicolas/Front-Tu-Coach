import { apiClient } from '@/lib/api/client';
import { ChatMessage, MessageThread, ThreadDetail } from '@/types/message';

function encodeThreadKey(threadKey: string) {
  return encodeURIComponent(threadKey);
}

export function fetchMessageThreads() {
  return apiClient<MessageThread[]>('/messages/threads', { auth: true });
}

export function fetchMessagesUnreadCount() {
  return apiClient<{ count: number }>('/messages/unread-count', {
    auth: true,
  });
}

export function fetchMyMessageThread() {
  return apiClient<ThreadDetail>('/messages/my-thread', { auth: true });
}

export function fetchThreadWithAlumno(alumnoId: string) {
  return apiClient<ThreadDetail>(`/messages/with-alumno/${alumnoId}`, {
    auth: true,
  });
}

export function fetchThreadDetail(threadKey: string) {
  return apiClient<ThreadDetail>(
    `/messages/threads/${encodeThreadKey(threadKey)}`,
    { auth: true },
  );
}

export function markThreadRead(threadKey: string) {
  return apiClient<{ updated: number }>(
    `/messages/threads/${encodeThreadKey(threadKey)}/read`,
    { method: 'PATCH', auth: true },
  );
}

export function sendThreadMessage(threadKey: string, text: string) {
  return apiClient<ChatMessage>(
    `/messages/threads/${encodeThreadKey(threadKey)}`,
    {
      method: 'POST',
      body: { text },
      auth: true,
    },
  );
}
