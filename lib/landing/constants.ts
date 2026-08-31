/** Paleta y tokens de la landing pública (neutros exclusivamente). */
export const LANDING = {
  bg: '#050505',
  bgSecondary: '#0A0A0A',
  card: '#101010',
  cardElevated: '#141414',
  text: '#FFFFFF',
  textSecondary: '#A3A3A3',
  textMuted: '#737373',
  border: 'rgba(255,255,255,0.10)',
  borderHighlight: 'rgba(255,255,255,0.22)',
} as const;

export const LANDING_CONTAINER = 'mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8';

/** Precio Premium configurable — editar aquí sin tocar componentes. */
export const PREMIUM_PRICE_LABEL = 'Consultar';

/** Precio Pro configurable */
export const PRO_PRICE_LABEL = 'Consultar';

export const LOGIN_ROUTE = '/login';
export const REGISTRO_ROUTE = '/registro';
export const CONTACT_EMAIL = 'apptucoach@gmail.com';
export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}`;

/** Debe coincidir con TRIAL_DAYS del backend. */
export const TRIAL_DAYS = 7;
