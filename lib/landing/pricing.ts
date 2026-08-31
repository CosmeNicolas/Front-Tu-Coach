import {
  CONTACT_MAILTO,
  PREMIUM_PRICE_LABEL,
  PRO_PRICE_LABEL,
  REGISTRO_ROUTE,
  TRIAL_DAYS,
} from '@/lib/landing/constants';

export interface LandingPlan {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  features: string[];
  cta: string;
  href: string;
  highlighted?: boolean;
  badge?: string;
}

export const LANDING_PLANS: LandingPlan[] = [
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
    price: PREMIUM_PRICE_LABEL,
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
    badge: `${TRIAL_DAYS} DÍAS DE PRUEBA`,
  },
  {
    id: 'pro',
    name: 'Pro',
    subtitle: 'Para estudios grandes',
    price: PRO_PRICE_LABEL,
    features: [
      'Todo Premium',
      'Hasta 200 alumnos',
      'Hasta 200 planificaciones activas',
      'Más capacidad operativa',
      'Soporte prioritario',
    ],
    cta: 'Consultar Pro',
    href: CONTACT_MAILTO,
  },
  {
    id: 'gimnasios',
    name: 'Gimnasios',
    subtitle: 'Para equipos y centros',
    price: 'A medida',
    features: [
      'Alta concierge (te armamos la cuenta)',
      'Varios profesores en un mismo tenant',
      'Dashboard del owner',
      'Aislamiento por gimnasio',
      'Planes y cupos a medida',
    ],
    cta: 'Escribirnos',
    href: CONTACT_MAILTO,
  },
];
