import { LANDING_HOME_ROUTE, CONTACT_ROUTE } from '@/lib/landing/constants';

export interface LandingNavItem {
  href: string;
  label: string;
}

export const LANDING_NAV_ITEMS: LandingNavItem[] = [
  { label: 'Inicio', href: `${LANDING_HOME_ROUTE}#inicio` },
  { label: 'Funciones', href: `${LANDING_HOME_ROUTE}#funciones` },
  { label: 'Entrenadores', href: `${LANDING_HOME_ROUTE}#entrenadores` },
  { label: 'Gimnasios', href: `${LANDING_HOME_ROUTE}#gimnasios` },
  { label: 'Planes', href: `${LANDING_HOME_ROUTE}#planes` },
  { label: 'Entrenamientos', href: '/entrenamientos' },
  { label: 'Profesores', href: '/profesores' },
  { label: 'Contacto', href: CONTACT_ROUTE },
];
