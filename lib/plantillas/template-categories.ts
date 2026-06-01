import {
  PlanificationConfig,
  ProgressionMode,
  computeTotalSesiones,
} from '@/types/planification';

export enum TemplateCategory {
  GENERAL = 'general',
  LUMBAR = 'lumbar',
  CERVICAL = 'cervical',
  RODILLA = 'rodilla',
  HOMBRO = 'hombro',
  CADERA = 'cadera',
  POST_OPERATORIO = 'post_operatorio',
  EMBARAZO = 'embarazo',
  CARDIOVASCULAR = 'cardiovascular',
  ADULTO_MAYOR = 'adulto_mayor',
  PRINCIPIANTE = 'principiante',
  RETORNO = 'retorno_entrenamiento',
  DEPORTIVO = 'deportivo',
  OTRO = 'otro',
}

export const TEMPLATE_CATEGORY_LABELS: Record<TemplateCategory, string> = {
  [TemplateCategory.GENERAL]: 'General',
  [TemplateCategory.LUMBAR]: 'Lumbar',
  [TemplateCategory.CERVICAL]: 'Cervical',
  [TemplateCategory.RODILLA]: 'Rodilla',
  [TemplateCategory.HOMBRO]: 'Hombro',
  [TemplateCategory.CADERA]: 'Cadera',
  [TemplateCategory.POST_OPERATORIO]: 'Post operatorio',
  [TemplateCategory.EMBARAZO]: 'Embarazo',
  [TemplateCategory.CARDIOVASCULAR]: 'Cardiovascular',
  [TemplateCategory.ADULTO_MAYOR]: 'Adulto mayor',
  [TemplateCategory.PRINCIPIANTE]: 'Principiante',
  [TemplateCategory.RETORNO]: 'Retorno al entrenamiento',
  [TemplateCategory.DEPORTIVO]: 'Deportivo',
  [TemplateCategory.OTRO]: 'Otro',
};

const CATEGORY_DEFAULTS: Record<TemplateCategory, Omit<PlanificationConfig, 'totalSesiones'>> = {
  [TemplateCategory.GENERAL]: {
    semanasDelPlan: 4,
    frecuenciaSemanal: 3,
    modoProgresion: ProgressionMode.LINEAL,
  },
  [TemplateCategory.LUMBAR]: {
    semanasDelPlan: 6,
    frecuenciaSemanal: 2,
    modoProgresion: ProgressionMode.LINEAL,
  },
  [TemplateCategory.CERVICAL]: {
    semanasDelPlan: 4,
    frecuenciaSemanal: 2,
    modoProgresion: ProgressionMode.LINEAL,
  },
  [TemplateCategory.RODILLA]: {
    semanasDelPlan: 8,
    frecuenciaSemanal: 2,
    modoProgresion: ProgressionMode.LINEAL,
  },
  [TemplateCategory.HOMBRO]: {
    semanasDelPlan: 6,
    frecuenciaSemanal: 2,
    modoProgresion: ProgressionMode.LINEAL,
  },
  [TemplateCategory.CADERA]: {
    semanasDelPlan: 4,
    frecuenciaSemanal: 3,
    modoProgresion: ProgressionMode.LINEAL,
  },
  [TemplateCategory.POST_OPERATORIO]: {
    semanasDelPlan: 8,
    frecuenciaSemanal: 2,
    modoProgresion: ProgressionMode.LINEAL,
  },
  [TemplateCategory.EMBARAZO]: {
    semanasDelPlan: 4,
    frecuenciaSemanal: 2,
    modoProgresion: ProgressionMode.LINEAL,
  },
  [TemplateCategory.CARDIOVASCULAR]: {
    semanasDelPlan: 4,
    frecuenciaSemanal: 3,
    modoProgresion: ProgressionMode.LINEAL,
  },
  [TemplateCategory.ADULTO_MAYOR]: {
    semanasDelPlan: 6,
    frecuenciaSemanal: 2,
    modoProgresion: ProgressionMode.LINEAL,
  },
  [TemplateCategory.PRINCIPIANTE]: {
    semanasDelPlan: 4,
    frecuenciaSemanal: 2,
    modoProgresion: ProgressionMode.LINEAL,
  },
  [TemplateCategory.RETORNO]: {
    semanasDelPlan: 4,
    frecuenciaSemanal: 3,
    modoProgresion: ProgressionMode.LINEAL,
  },
  [TemplateCategory.DEPORTIVO]: {
    semanasDelPlan: 4,
    frecuenciaSemanal: 4,
    modoProgresion: ProgressionMode.BLOQUE_X4,
  },
  [TemplateCategory.OTRO]: {
    semanasDelPlan: 4,
    frecuenciaSemanal: 3,
    modoProgresion: ProgressionMode.LINEAL,
  },
};

export function getDefaultConfigForCategory(
  categoria: TemplateCategory,
): PlanificationConfig {
  const base = CATEGORY_DEFAULTS[categoria];
  return {
    ...base,
    totalSesiones: computeTotalSesiones(
      base.semanasDelPlan,
      base.frecuenciaSemanal,
    ),
  };
}

export const TEMPLATE_CATEGORY_HINTS: Partial<Record<TemplateCategory, string>> = {
  [TemplateCategory.LUMBAR]:
    'Priorizá estabilidad lumbar y progresión conservadora.',
  [TemplateCategory.RODILLA]:
    'Progresión gradual; validar rango sin dolor.',
  [TemplateCategory.EMBARAZO]:
    'Bajo impacto; evitar maniobras de alto riesgo.',
  [TemplateCategory.CARDIOVASCULAR]:
    'Monitorear RPE; evitar picos extremos de intensidad.',
};
