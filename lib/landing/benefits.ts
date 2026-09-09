import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  ClipboardCheck,
  ClipboardList,
  Gift,
  LayoutDashboard,
  MessageSquare,
  Smartphone,
  Users,
  Video,
} from 'lucide-react';

export interface PlatformBenefit {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const PROFESOR_BENEFITS: PlatformBenefit[] = [
  {
    icon: ClipboardList,
    title: 'Planificaciones a medida',
    description:
      'Creá rutinas por alumno con sesiones, bloques, progresiones y plantillas reutilizables.',
  },
  {
    icon: Users,
    title: 'Todos tus alumnos en un lugar',
    description:
      'Seguí cargas, sesiones, comentarios y adherencia desde un panel centralizado.',
  },
  {
    icon: Video,
    title: 'Tu contenido, tu método',
    description:
      'Ejercicios propios, videos subidos o links de YouTube y Vimeo en cada planificación.',
  },
  {
    icon: BarChart3,
    title: 'Métricas y decisiones',
    description:
      'RPE, historial de entrenamiento y reportes para ajustar el plan con datos reales.',
  },
  {
    icon: MessageSquare,
    title: 'Chat integrado',
    description:
      'Comunicación directa con cada alumno sin salir de la plataforma.',
  },
  {
    icon: LayoutDashboard,
    title: 'Escala con tu estudio',
    description:
      'Desde el plan Free hasta operaciones grandes, con límites claros y upgrade cuando lo necesités.',
  },
  {
    icon: Gift,
    title: 'Descuentos en la app',
    description:
      'Accedé a códigos y promos de locales adheridos desde la sección Beneficios de TuCoach.',
  },
];

export const ALUMNO_BENEFITS: PlatformBenefit[] = [
  {
    icon: Smartphone,
    title: 'Tu plan en el bolsillo',
    description:
      'Accedé a la planificación activa desde el celular o la compu, sesión a sesión.',
  },
  {
    icon: ClipboardCheck,
    title: 'Registrá cada entrenamiento',
    description:
      'Marcá ejercicios completados, cargas y comentarios para que tu profe vea cómo te fue.',
  },
  {
    icon: BarChart3,
    title: 'Seguí tu progreso',
    description:
      'Visualizá avance de la sesión, historial y esfuerzo percibido al cerrar cada día.',
  },
  {
    icon: MessageSquare,
    title: 'Hablar con tu entrenador',
    description:
      'Consultá dudas y recibí feedback dentro del chat de TuCoach.',
  },
  {
    icon: ClipboardList,
    title: 'Claridad en cada sesión',
    description:
      'Sabés qué hacer al llegar al gimnasio: ejercicios, series, descansos y notas del profe.',
  },
  {
    icon: Video,
    title: 'Videos y referencias',
    description:
      'Mirá demostraciones o enlaces que tu entrenador adjuntó a cada ejercicio.',
  },
  {
    icon: Gift,
    title: 'Descuentos en la app',
    description:
      'Aprovechá códigos y beneficios de marcas y locales adheridos, directo desde tu portal.',
  },
];
