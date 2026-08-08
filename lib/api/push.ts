import { apiClient } from '@/lib/api/client';

export interface VapidPublicKeyResponse {
  publicKey: string | null;
  configured: boolean;
}

export interface PushStatusResponse {
  configured: boolean;
  subscribed: boolean;
  activeSubscriptions: number;
}

export interface PushActionResult {
  ok: boolean;
  message?: string;
}

export interface PushTestResult {
  ok: boolean;
  enviados: number;
  fallidos: number;
  message?: string;
}

export function fetchVapidPublicKey() {
  return apiClient<VapidPublicKeyResponse>('/notifications/push/vapid-public-key');
}

export function fetchPushStatus() {
  return apiClient<PushStatusResponse>('/notifications/push/status', {
    auth: true,
  });
}

export function subscribePush(payload: {
  subscription: {
    endpoint: string;
    keys: { p256dh: string; auth: string };
  };
  userAgent?: string;
  dispositivo?: string;
}) {
  return apiClient<PushActionResult>('/notifications/push/subscribe', {
    method: 'POST',
    body: payload,
    auth: true,
  });
}

export function unsubscribePush(endpoint?: string) {
  return apiClient<PushActionResult>('/notifications/push/unsubscribe', {
    method: 'DELETE',
    body: endpoint ? { endpoint } : {},
    auth: true,
  });
}

export function sendPushTest() {
  return apiClient<PushTestResult>('/notifications/push/test', {
    method: 'POST',
    auth: true,
  });
}
