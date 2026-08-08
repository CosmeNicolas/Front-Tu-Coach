import { apiClient } from '@/lib/api/client';
import { AppNotification } from '@/types/notification';

export function fetchNotifications(limit = 30) {
  return apiClient<AppNotification[]>(
    `/notifications?limit=${limit}`,
    { auth: true },
  );
}

export function fetchUnreadNotificationCount() {
  return apiClient<{ count: number }>('/notifications/unread-count', {
    auth: true,
  });
}

export function markNotificationRead(id: string) {
  return apiClient<AppNotification>(`/notifications/${id}/read`, {
    method: 'PATCH',
    auth: true,
  });
}

export function markAllNotificationsRead() {
  return apiClient<{ ok: boolean }>('/notifications/read-all', {
    method: 'PATCH',
    auth: true,
  });
}
