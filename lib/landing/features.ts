import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  Bot,
  ClipboardList,
  LayoutTemplate,
  MessageSquare,
  Video,
} from 'lucide-react';

export interface LandingFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const LANDING_FEATURES: LandingFeature[] = [
  {
    icon: ClipboardList,
    title: 'Planificaciones personalizadas',
    description: 'Creá rutinas adaptadas a cada objetivo, nivel y frecuencia.',
  },
  {
    icon: Video,
    title: 'Videos propios',
    description: 'Subí tus propios videos o agregá enlaces desde cualquier plataforma.',
  },
  {
    icon: Bot,
    title: 'Asistente de planificación',
    description: 'Armá planificaciones con un flujo guiado, rápido y organizado.',
  },
  {
    icon: LayoutTemplate,
    title: 'Plantillas reutilizables',
    description: 'Ahorrá tiempo utilizando estructuras de entrenamiento ya preparadas.',
  },
  {
    icon: MessageSquare,
    title: 'Chat integrado',
    description: 'Mantené la comunicación con cada alumno dentro de la plataforma.',
  },
  {
    icon: BarChart3,
    title: 'Métricas y progreso',
    description: 'Analizá sesiones, cargas, adherencia, esfuerzo y evolución.',
  },
];
