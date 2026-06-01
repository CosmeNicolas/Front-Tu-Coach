import { apiClient } from '@/lib/api/client';
import {
  ClientPortalAccess,
  UpsertClientPortalPayload,
} from '@/types/client-portal';
import {
  Client,
  CreateClientPayload,
  PaginatedClients,
  UpdateClientPayload,
} from '@/types/client';

export function fetchClients(params?: {
  search?: string;
  page?: number;
  limit?: number;
}) {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  const qs = query.toString();
  return apiClient<PaginatedClients>(`/clients${qs ? `?${qs}` : ''}`, {
    auth: true,
  });
}

export function fetchClient(id: string) {
  return apiClient<Client>(`/clients/${id}`, { auth: true });
}

export function createClient(payload: CreateClientPayload) {
  return apiClient<Client>('/clients', {
    method: 'POST',
    body: payload,
    auth: true,
  });
}

export function updateClient(id: string, payload: UpdateClientPayload) {
  return apiClient<Client>(`/clients/${id}`, {
    method: 'PATCH',
    body: payload,
    auth: true,
  });
}

export function deleteClient(id: string) {
  return apiClient<{ message: string }>(`/clients/${id}`, {
    method: 'DELETE',
    auth: true,
  });
}

export function fetchClientPortalAccess(clientId: string) {
  return apiClient<ClientPortalAccess>(`/clients/${clientId}/portal-access`, {
    auth: true,
  });
}

export function upsertClientPortalAccess(
  clientId: string,
  payload: UpsertClientPortalPayload,
) {
  const body: UpsertClientPortalPayload = { email: payload.email.trim() };
  if (payload.password?.trim()) {
    body.password = payload.password.trim();
  }
  return apiClient<ClientPortalAccess>(`/clients/${clientId}/portal-access`, {
    method: 'PUT',
    body,
    auth: true,
  });
}
