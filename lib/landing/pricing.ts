import { contactUrl } from '@/lib/landing/contact';
import {
  formatArs,
  LAUNCH_OFFER_LABEL,
  launchMonthPrice,
  PRICE_ARS,
  REGISTRO_ROUTE,
  TRIAL_DAYS,
} from '@/lib/landing/constants';

export interface LandingPlan {
  id: string;
  name: string;
  subtitle: string;
  /** Etiqueta superior opcional (ej. "Para gimnasios") */
  eyebrow?: string;
  /** Título grande cuando no se muestra precio (gimnasios) */
  headline?: string;
  /** Ocultar bloque de precios en la card */
  showPricing?: boolean;
  price: string;
  period?: string;
  launchPrice?: string;
  launchCaption?: string;
  features: string[];
  cta: string;
  href: string;
  highlighted?: boolean;
  badge?: string;
}

function saasPrice(amount: number) {
  return {
    price: formatArs(amount),
    period: '/mes',
    launchPrice: formatArs(launchMonthPrice(amount)),
    launchCaption: 'primer mes',
    badge: LAUNCH_OFFER_LABEL,
  };
}

export const LANDING_SAAS_PLANS: LandingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    subtitle: 'Después del trial',
    price: 'Gratis',
    features: [
      'Hasta 2 alumnos',
      '1 planificación activa en toda la cuenta',
      'Portal del alumno',
      'Chat y métricas básicas',
      'Tus datos no se borran si no pagás',
    ],
    cta: 'Crear cuenta',
    href: REGISTRO_ROUTE,
  },
  {
    id: 'premium',
    name: 'Premium',
    subtitle: 'Para entrenadores',
    ...saasPrice(PRICE_ARS.premiumMonth),
    features: [
      `${TRIAL_DAYS} días de prueba al registrarte`,
      'Hasta 50 alumnos',
      'Hasta 50 planificaciones activas',
      'Asistente, plantillas y videos propios',
      'Chat y métricas avanzadas',
    ],
    cta: `Probar ${TRIAL_DAYS} días`,
    href: REGISTRO_ROUTE,
    highlighted: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    subtitle: 'Para estudios grandes',
    ...saasPrice(PRICE_ARS.proMonth),
    features: [
      'Todo Premium',
      'Hasta 200 alumnos',
      'Hasta 200 planificaciones activas',
      'Más capacidad operativa',
      'Soporte prioritario',
    ],
    cta: 'Consultar Pro',
    href: contactUrl('plan-pro'),
  },
  {
    id: 'plus',
    name: 'Plus',
    subtitle: 'Para operaciones más grandes',
    ...saasPrice(PRICE_ARS.plusMonth),
    features: [
      'Todo Pro',
      'Más capacidad, la coordinamos con vos',
      'Prioridad de soporte',
      'Contactanos para activar este plan',
      'Pensado para equipos de un profesor con mucho volumen',
    ],
    cta: 'Consultar Plus',
    href: contactUrl('plan-plus'),
  },
];

export const LANDING_GYM_PLAN: LandingPlan = {
  id: 'gimnasios',
  eyebrow: 'Para gimnasios y centros',
  name: 'Gimnasios',
  headline: 'TuCoach en tu gym',
  subtitle: 'Contactanos y armamos la propuesta para tu centro.',
  price: '',
  showPricing: false,
  features: [
    'Varios profesores en un mismo tenant',
    'Dashboard del owner',
    'Ejercicios propios y reportes del centro',
    'Cupos a medida — lo adaptamos a tus funcionalidades',
    'Soporte prioritario y onboarding concierge',
  ],
  cta: 'Contactanos',
  href: contactUrl('gimnasio'),
};

export const LANDING_CATALOG_PLANS: LandingPlan[] = [
  {
    id: 'catalog-4',
    name: '4 semanas',
    subtitle: 'Salud, fuerza o hipertrofia',
    price: formatArs(PRICE_ARS.catalog4w),
    period: 'el bloque',
    features: [
      'Plan genérico de catálogo',
      'Kg y reps sugeridos',
      'Portal para seguir el bloque',
      'Sin seguimiento clínico',
    ],
    cta: 'Pedir este plan',
    href: contactUrl('catalog-4'),
  },
  {
    id: 'catalog-8',
    name: '8 semanas',
    subtitle: 'El bloque más elegido',
    price: formatArs(PRICE_ARS.catalog8w),
    period: 'el bloque',
    features: [
      'Plan genérico de catálogo',
      'Kg y reps sugeridos',
      'Portal para seguir el bloque',
      'Mejor relación semanas / precio',
    ],
    cta: 'Pedir este plan',
    href: contactUrl('catalog-8'),
    highlighted: true,
  },
  {
    id: 'catalog-12',
    name: '12 semanas',
    subtitle: 'Salud, fuerza o hipertrofia',
    price: formatArs(PRICE_ARS.catalog12w),
    period: 'el bloque',
    features: [
      'Plan genérico de catálogo',
      'Kg y reps sugeridos',
      'Portal para seguir el bloque',
      'El menor costo por semana',
    ],
    cta: 'Pedir este plan',
    href: contactUrl('catalog-12'),
  },
  {
    id: 'catalog-personalizada',
    name: 'Personalizada',
    subtitle: 'La arma un profesor para vos',
    price: formatArs(PRICE_ARS.personalized),
    period: 'el bloque',
    features: [
      'Planificación hecha a medida',
      'No es una plantilla de catálogo',
      'Se coordina por mail',
      'No cubre patologías ni lesiones',
      'Te asignamos un profesor para que te acompañe',

    ],
    cta: 'Pedir personalizada',
    href: contactUrl('personalizada'),
  },
];
