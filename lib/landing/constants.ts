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

export const LOGIN_ROUTE = '/login';
export const REGISTRO_ROUTE = '/registro';
export const CONTACT_EMAIL = 'apptucoach@gmail.com';
export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}`;

export function contactMail(subject: string): string {
  return `${CONTACT_MAILTO}?subject=${encodeURIComponent(subject)}`;
}

/** Debe coincidir con TRIAL_DAYS del backend. */
export const TRIAL_DAYS = 7;

/** Precios de lista en ARS. Suscripciones = por mes. Catálogo = por bloque. */
export const PRICE_ARS = {
  premiumMonth: 50_000,
  proMonth: 100_000,
  plusMonth: 150_000,
  gymMonth: 200_000,
  catalog4w: 15_000,
  catalog8w: 25_000,
  catalog12w: 35_000,
  personalized: 50_000,
} as const;

/** Oferta de lanzamiento sobre el primer mes de suscripción. */
export const LAUNCH_DISCOUNT = 0.6;
export const LAUNCH_OFFER_LABEL = '60% off el primer mes';

export function formatArs(amount: number): string {
  return `$${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

export function launchMonthPrice(amount: number): number {
  return Math.round(amount * (1 - LAUNCH_DISCOUNT));
}
