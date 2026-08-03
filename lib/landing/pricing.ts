import { LOGIN_ROUTE, PREMIUM_PRICE_LABEL, PRO_PRICE_LABEL } from '@/lib/landing/constants';

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
    subtitle: 'Para comenzar',
    price: 'Gratis',
    features: [
      'Gestión básica de alumnos',
      'Planificaciones básicas',
      'Biblioteca inicial',
      'Métricas esenciales',
    ],
    cta: 'Comenzar gratis',
    href: LOGIN_ROUTE,
  },
  {
    id: 'premium',
    name: 'Premium',
    subtitle: 'Para entrenadores',
    price: PREMIUM_PRICE_LABEL,
    features: [
      'Planificaciones personalizadas',
      'Videos propios',
      'Chat integrado',
      'Métricas avanzadas',
      'Plantillas',
      'Más capacidad de alumnos',
    ],
    cta: 'Probar Premium',
    href: LOGIN_ROUTE,
    highlighted: true,
    badge: 'MÁS ELEGIDO',
  },
  {
    id: 'pro',
    name: 'Pro',
    subtitle: 'Para profesionales',
    price: PRO_PRICE_LABEL,
    features: [
      'Todo Premium',
      'Gestión de múltiples grupos',
      'Herramientas avanzadas',
      'Mayor capacidad',
      'Soporte prioritario',
    ],
    cta: 'Probar Pro',
    href: LOGIN_ROUTE,
  },
  {
    id: 'gimnasios',
    name: 'Gimnasios',
    subtitle: 'Para equipos y centros',
    price: 'A medida',
    features: [
      'Gestión de profesores',
      'Gestión de alumnos',
      'Planes institucionales',
      'Reportes generales',
      'Roles y permisos',
      'Integraciones',
    ],
    cta: 'Contactar',
    href: '#contacto',
  },
];
