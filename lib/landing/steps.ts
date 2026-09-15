import { TRIAL_DAYS } from '@/lib/landing/constants';

export interface LandingStep {
  number: string;
  title: string;
  description: string;
}

export function buildLandingSteps(trialDays = TRIAL_DAYS): LandingStep[] {
  return [
  {
    number: '01',
    title: 'Creá tu cuenta',
    description: `Registrate como profe. Empezás con ${trialDays} días Premium.`,
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
}
