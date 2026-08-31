export interface LandingStep {
  number: string;
  title: string;
  description: string;
}

export const LANDING_STEPS: LandingStep[] = [
  {
    number: '01',
    title: 'Creá tu cuenta',
    description: 'Registrate como profe. Empezás con 7 días Premium.',
  },
  {
    number: '02',
    title: 'Creá o elegí una planificación',
    description: 'Usá plantillas o armá una planificación desde cero.',
  },
  {
    number: '03',
    title: 'Acompañá el progreso',
    description: 'Revisá sesiones, métricas, comentarios y resultados.',
  },
];
