import { apiClient } from '@/lib/api/client';

export type SecurityBlocklistKind = 'ip_hash' | 'email' | 'email_domain';

export interface SecurityBlocklistRow {
  id: string;
  kind: SecurityBlocklistKind;
  value: string;
  reason: string;
  source: 'manual' | 'auto';
  expiresAt: string | null;
  createdAt: string;
}

export function fetchSecurityBlocklist() {
  return apiClient<SecurityBlocklistRow[]>('/admin/security-blocklist', { auth: true });
}

export function createSecurityBlocklistEntry(payload: {
  kind: SecurityBlocklistKind;
  value: string;
  reason: string;
  expiresInHours?: number;
}) {
  return apiClient<SecurityBlocklistRow>('/admin/security-blocklist', {
    auth: true,
    method: 'POST',
    body: payload,
  });
}

export function deleteSecurityBlocklistEntry(id: string) {
  return apiClient<{ ok: boolean }>(`/admin/security-blocklist/${id}`, {
    auth: true,
    method: 'DELETE',
  });
}
