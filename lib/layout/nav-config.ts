import { SidebarNavItem } from '@/components/layout/AppSidebar';



export const SUPER_ADMIN_NAV: SidebarNavItem[] = [

  { href: '/super-admin/dashboard', label: 'Dashboard' },

  { href: '/super-admin/tenants', label: 'Gimnasios' },

  { href: '/super-admin/profesores', label: 'Profesores' },

  { href: '/super-admin/ejercicios-privados', label: 'Ejercicios' },

];



export const OWNER_NAV: SidebarNavItem[] = [

  { href: '/owner/dashboard', label: 'Dashboard' },

  { href: '/owner/profesores', label: 'Profesores' },

  { href: '/owner/alumnos', label: 'Alumnos' },

];



export const PROFESOR_NAV: SidebarNavItem[] = [

  { href: '/profesor/dashboard', label: 'Dashboard' },

  { href: '/profesor/alumnos', label: 'Alumnos' },

  { href: '/profesor/mensajes', label: 'Mensajes' },

  { href: '/profesor/planificaciones', label: 'Planificaciones' },

  { href: '/profesor/plantillas', label: 'Plantillas' },

  { href: '/profesor/ejercicios', label: 'Ejercicios' },

];



export const ALUMNO_NAV: SidebarNavItem[] = [

  { href: '/alumno/mi-planificacion', label: 'Mi planificación' },

  { href: '/alumno/sesiones', label: 'Sesiones' },

  { href: '/alumno/mensajes', label: 'Mensajes' },

  { href: '/alumno/metricas', label: 'Métricas' },

  { href: '/alumno/mis-datos', label: 'Mis datos' },

];

