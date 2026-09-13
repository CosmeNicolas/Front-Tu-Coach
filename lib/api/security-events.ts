import { apiClient } from '@/lib/api/client';

export type SecurityEventSeverity = 'info' | 'warn';

export interface SecurityEventRow {
  id: string;
  event: string;
  severity: SecurityEventSeverity;
  meta: Record<string, string | number | boolean>;
  ipHash: string | null;
  createdAt: string;
}

export function fetchSecurityEvents(params?: {
  limit?: number;
  event?: string;
  severity?: SecurityEventSeverity;
}) {
  const search = new URLSearchParams();
  if (params?.limit) {
    search.set('limit', String(params.limit));
  }
  if (params?.event) {
    search.set('event', params.event);
  }
  if (params?.severity) {
    search.set('severity', params.severity);
  }

  const query = search.toString();
  return apiClient<SecurityEventRow[]>(
    `/admin/security-events${query ? `?${query}` : ''}`,
    { auth: true },
  );
}
