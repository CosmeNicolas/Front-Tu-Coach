import { CONTACT_ROUTE } from '@/lib/landing/constants';

export const CONTACT_TOPICS = [
  { value: 'demo', label: 'Pedir una demo' },
  { value: 'gimnasio', label: 'TuCoach para un gimnasio' },
  { value: 'plan-pro', label: 'Plan Pro' },
  { value: 'plan-plus', label: 'Plan Plus' },
  { value: 'catalog-4', label: 'Plan catálogo 4 semanas' },
  { value: 'catalog-8', label: 'Plan catálogo 8 semanas' },
  { value: 'catalog-12', label: 'Plan catálogo 12 semanas' },
  { value: 'personalizada', label: 'Planificación personalizada' },
  { value: 'general', label: 'Consulta general' },
] as const;

export type ContactTopicValue = (typeof CONTACT_TOPICS)[number]['value'];

const CONTACT_TOPIC_VALUES = new Set<string>(
  CONTACT_TOPICS.map((topic) => topic.value),
);

export function isContactTopic(value: string | null | undefined): value is ContactTopicValue {
  return Boolean(value && CONTACT_TOPIC_VALUES.has(value));
}

export function contactUrl(motivo?: ContactTopicValue): string {
  if (!motivo) return CONTACT_ROUTE;
  return `${CONTACT_ROUTE}?motivo=${encodeURIComponent(motivo)}`;
}

export function getContactTopicLabel(value: ContactTopicValue): string {
  return CONTACT_TOPICS.find((topic) => topic.value === value)?.label ?? 'Consulta general';
}
