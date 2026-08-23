export type TourId =
  | 'alumno-planificacion'
  | 'alumno-sesion'
  | 'alumno-sesiones'
  | 'alumno-metricas'
  | 'alumno-mensajes'
  | 'profesor-dashboard'
  | 'profesor-ejercicios'
  | 'profesor-asistente'
  | 'profesor-progreso';

export const TOUR_LABELS: Record<TourId, string> = {
  'alumno-planificacion': 'Cómo entrenar',
  'alumno-sesion': 'Dentro de la sesión',
  'alumno-sesiones': 'Listado de sesiones',
  'alumno-metricas': 'Tus métricas',
  'alumno-mensajes': 'Mensajes con tu profesor',
  'profesor-dashboard': 'Tu dashboard',
  'profesor-ejercicios': 'Mis ejercicios',
  'profesor-asistente': 'Asistente de planificación',
  'profesor-progreso': 'Progreso del alumno',
};
