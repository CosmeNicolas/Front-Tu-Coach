import { LOGIN_ROUTE } from '@/lib/landing/constants';

export interface LandingNavItem {
  href: string;
  label: string;
}

export const LANDING_NAV_ITEMS: LandingNavItem[] = [
  { label: 'Inicio', href: LOGIN_ROUTE },
  { label: 'Funciones', href: LOGIN_ROUTE },
  { label: 'Para entrenadores', href: LOGIN_ROUTE },
  { label: 'Para gimnasios', href: LOGIN_ROUTE },
  { label: 'Planes', href: LOGIN_ROUTE },
  { label: 'Contacto', href: LOGIN_ROUTE },
];
