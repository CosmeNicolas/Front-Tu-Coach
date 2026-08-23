import { TourId } from '@/lib/onboarding/types';

/** Resuelve qué tour corresponde a la ruta actual (null si no hay guía). */
export function resolveTourFromPath(pathname: string): TourId | null {
  if (/^\/alumno\/sesiones\/\d+/.test(pathname)) {
    return 'alumno-sesion';
  }
  if (pathname === '/alumno/mi-planificacion') {
    return 'alumno-planificacion';
  }
  if (pathname === '/alumno/sesiones') {
    return 'alumno-sesiones';
  }
  if (pathname === '/alumno/metricas') {
    return 'alumno-metricas';
  }
  if (pathname === '/alumno/mensajes') {
    return 'alumno-mensajes';
  }
  if (pathname === '/profesor/dashboard') {
    return 'profesor-dashboard';
  }
  if (pathname === '/profesor/ejercicios') {
    return 'profesor-ejercicios';
  }
  if (/^\/profesor\/planificaciones\/[^/]+\/asistente/.test(pathname)) {
    return 'profesor-asistente';
  }
  if (/^\/profesor\/planificaciones\/[^/]+$/.test(pathname)) {
    return 'profesor-progreso';
  }
  return null;
}
