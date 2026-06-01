import { Role } from '@/types/auth';

const DASHBOARD_BY_ROLE: Record<Role, string> = {
  [Role.SUPER_ADMIN]: '/super-admin/dashboard',
  [Role.OWNER_GIMNASIO]: '/owner/dashboard',
  [Role.PROFESOR]: '/profesor/dashboard',
  [Role.ALUMNO]: '/alumno/mi-planificacion',
};

const ROLE_PREFIX: Record<Role, string> = {
  [Role.SUPER_ADMIN]: '/super-admin',
  [Role.OWNER_GIMNASIO]: '/owner',
  [Role.PROFESOR]: '/profesor',
  [Role.ALUMNO]: '/alumno',
};

export function getDashboardPath(role: Role): string {
  return DASHBOARD_BY_ROLE[role];
}

export function getRolePrefix(role: Role): string {
  return ROLE_PREFIX[role];
}

export function isRoleAllowedForPath(role: Role, pathname: string): boolean {
  return pathname.startsWith(getRolePrefix(role));
}

export function getRoleLabel(role: Role): string {
  const labels: Record<Role, string> = {
    [Role.SUPER_ADMIN]: 'Super Admin',
    [Role.OWNER_GIMNASIO]: 'Dueño de Gimnasio',
    [Role.PROFESOR]: 'Profesor',
    [Role.ALUMNO]: 'Alumno',
  };
  return labels[role];
}
