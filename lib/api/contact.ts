import { apiClient } from '@/lib/api/client';
import type { ContactTopicValue } from '@/lib/landing/contact';

export interface ContactInquiryPayload {
  nombre: string;
  email: string;
  motivo: ContactTopicValue;
  mensaje: string;
}

export interface ContactInquiryResponse {
  ok: boolean;
  message: string;
}

export function submitContactInquiry(payload: ContactInquiryPayload) {
  return apiClient<ContactInquiryResponse>('/contact', {
    method: 'POST',
    body: payload,
  });
}
