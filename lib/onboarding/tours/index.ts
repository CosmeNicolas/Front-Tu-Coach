import type { DriveStep } from 'driver.js';
import { TourId } from '@/lib/onboarding/types';

const alumnoPlanificacionSteps: DriveStep[] = [
  {
    element: '[data-tour="alumno-plan-header"]',
    popover: {
      title: 'Tu plan de entrenamiento',
      description:
        'Acá ves el nombre del plan, el modo (bloque x2, x3…) y cuántas sesiones tenés en total.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '[data-tour="alumno-plan-entrenar"]',
    popover: {
      title: 'Empezar a entrenar',
      description:
        'Tocá este botón para abrir la sesión que te toca. Es el acceso más rápido desde acá.',
      side: 'bottom',
      align: 'end',
    },
    skipMissingElement: true,
  },
  {
    element: '[data-tour="alumno-plan-lista"]',
    popover: {
      title: 'Todas las sesiones',
      description:
        'Tocá cualquier sesión para ver ejercicios, marcar los que hiciste, usar timers y finalizar con RPE.',
      side: 'top',
      align: 'start',
    },
    skipMissingElement: true,
  },
  {
    popover: {
      title: 'Dentro de cada sesión',
      description:
        'Iniciá el cronómetro arriba, marcá ejercicios uno a uno, usá los timers de trabajo/descanso y finalizá con tu RPE. La guía paso a paso aparece al entrar a una sesión.',
    },
  },
];

const alumnoSesionesListSteps: DriveStep[] = [
  {
    element: '[data-tour="alumno-sesiones-header"]',
    popover: {
      title: 'Historial de sesiones',
      description:
        'Listado completo de tu plan con el progreso de cada sesión.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '[data-tour="alumno-plan-lista"]',
    popover: {
      title: 'Elegí una sesión',
      description:
        'Tocá la sesión que vas a hacer (o una pendiente). Adentro podés marcar ejercicios, cronometrar y finalizar.',
      side: 'top',
      align: 'start',
    },
    skipMissingElement: true,
  },
];

const alumnoSesionSteps: DriveStep[] = [
  {
    element: '[data-tour="alumno-session-header"]',
    popover: {
      title: 'Tu sesión de hoy',
      description:
        'Barra de progreso con los ejercicios que vas completando en esta sesión.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '[data-tour="alumno-session-stopwatch"]',
    popover: {
      title: 'Cronómetro de sesión',
      description:
        'Tocá Iniciar al empezar a entrenar. El tiempo total se guarda al finalizar y lo ves en Métricas.',
      side: 'bottom',
      align: 'end',
    },
  },
  {
    element: '[data-tour="alumno-session-ejercicio-marca"]',
    popover: {
      title: 'Marcar ejercicio',
      description:
        'Cuando termines una serie o el ejercicio completo, marcá el tilde. Podés agregar una nota abajo.',
      side: 'bottom',
      align: 'start',
    },
    skipMissingElement: true,
  },
  {
    element: '[data-tour="alumno-session-ejercicio-timer"]',
    popover: {
      title: 'Timers por ejercicio',
      description:
        'Cronometrá el tiempo de trabajo y, si hay descanso, usá el temporizador. Los tiempos quedan registrados.',
      side: 'top',
      align: 'start',
    },
    skipMissingElement: true,
  },
  {
    element: '[data-tour="alumno-session-ejercicios"]',
    popover: {
      title: 'Bloques de la sesión',
      description:
        'Entrada en calor, principales y vuelta a la calma. Abrí cada bloque para ver todos los ejercicios.',
      side: 'top',
      align: 'start',
    },
    skipMissingElement: true,
  },
  {
    element: '[data-tour="alumno-session-finalize"]',
    popover: {
      title: 'Finalizar sesión',
      description:
        'Elegí tu RPE (obligatorio), comentario opcional y tocá Finalizar. Tu profesor verá el registro.',
      side: 'top',
      align: 'center',
    },
    skipMissingElement: true,
  },
];

const alumnoMetricasSteps: DriveStep[] = [
  {
    element: '[data-tour="alumno-metricas-resumen"]',
    popover: {
      title: 'Resumen',
      description:
        'Tarjetas con sesiones completadas, adherencia, tiempo entrenado y carga total del plan.',
      side: 'bottom',
      align: 'start',
    },
    skipMissingElement: true,
  },
  {
    element: '[data-tour="alumno-metricas-tiempo"]',
    popover: {
      title: 'Tiempo de entrenamiento',
      description:
        'Gráficos por sesión, día, semana y mes. Necesitás haber usado el cronómetro al entrenar.',
      side: 'top',
      align: 'start',
    },
    skipMissingElement: true,
  },
  {
    element: '[data-tour="alumno-metricas-tabla"]',
    popover: {
      title: 'Detalle por sesión',
      description:
        'Tabla con fecha y duración de cada entrenamiento donde registraste tiempo.',
      side: 'top',
      align: 'start',
    },
    skipMissingElement: true,
  },
];

const profesorDashboardSteps: DriveStep[] = [
  {
    element: '[data-tour="profesor-dashboard-header"]',
    popover: {
      title: 'Panel del profesor',
      description:
        'Acá tenés un resumen de alumnos, planes y actividad reciente de tu consultorio.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '[data-tour="profesor-dashboard-acciones"]',
    popover: {
      title: 'Acciones rápidas',
      description:
        'Alta de alumnos, nueva planificación o acceso directo a listados. Son los atajos más usados del día a día.',
      side: 'bottom',
      align: 'start',
    },
    skipMissingElement: true,
  },
  {
    element: '[data-tour="profesor-dashboard-stats"]',
    popover: {
      title: 'Indicadores clave',
      description:
        'Alumnos activos, planes en curso, sesiones completadas y ejercicios propios. Te ayudan a ver el estado general de un vistazo.',
      side: 'bottom',
      align: 'start',
    },
    skipMissingElement: true,
  },
  {
    element: '[data-tour="profesor-dashboard-renovar"]',
    popover: {
      title: 'Planes a renovar',
      description:
        'Alumnos que pidieron una nueva planificación o terminaron el plan. Revisá feedback y armá el siguiente ciclo.',
      side: 'top',
      align: 'start',
    },
    skipMissingElement: true,
  },
  {
    element: '[data-tour="profesor-dashboard-graficos"]',
    popover: {
      title: 'Actividad reciente',
      description:
        'Sesiones registradas y planes creados en los últimos días. Útil para detectar picos o alumnos inactivos.',
      side: 'top',
      align: 'start',
    },
    skipMissingElement: true,
  },
  {
    element: '[data-tour="profesor-dashboard-alumnos"]',
    popover: {
      title: 'Tabla de alumnos',
      description:
        'Filtrá por estado o actividad y entrá al detalle de cada alumno desde la columna Ver.',
      side: 'top',
      align: 'start',
    },
    skipMissingElement: true,
  },
];

const profesorEjerciciosSteps: DriveStep[] = [
  {
    element: '[data-tour="profesor-ejercicios-intro"]',
    popover: {
      title: 'Ejercicios propios',
      description:
        'Creá movimientos con GIF, video o YouTube que solo vos ves hasta agregarlos a una planificación.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '[data-tour="profesor-ejercicios-formulario"]',
    popover: {
      title: 'Datos del ejercicio',
      description:
        'Nombre, categoría muscular y descripción opcional. Completá esto antes de subir la media.',
      side: 'right',
      align: 'start',
    },
  },
  {
    element: '[data-tour="profesor-ejercicios-media"]',
    popover: {
      title: 'GIF, video o YouTube',
      description:
        'Pegá un link de YouTube/URL o subí un archivo (GIF, imagen, MP4). La vista previa confirma que se ve bien.',
      side: 'right',
      align: 'start',
    },
  },
  {
    element: '[data-tour="profesor-ejercicios-guardar"]',
    popover: {
      title: 'Crear o guardar',
      description:
        'Tocá Crear ejercicio. Para editar uno existente, usá Editar en la lista de la derecha.',
      side: 'top',
      align: 'start',
    },
  },
  {
    element: '[data-tour="profesor-ejercicios-buscar"]',
    popover: {
      title: 'Buscar en tu catálogo',
      description:
        'Filtrá por nombre o categoría cuando tengas muchos ejercicios cargados.',
      side: 'bottom',
      align: 'start',
    },
    skipMissingElement: true,
  },
  {
    element: '[data-tour="profesor-ejercicios-lista"]',
    popover: {
      title: 'Tu biblioteca',
      description:
        'Todos tus ejercicios privados. Podés editarlos o eliminarlos; los ya usados en planes conservan su snapshot.',
      side: 'left',
      align: 'start',
    },
    skipMissingElement: true,
  },
  {
    popover: {
      title: 'Usarlos en una planificación',
      description:
        'En el asistente de planificación, abrí una sección y tocá Buscar ejercicios. Tus privados aparecen junto al catálogo global.',
    },
  },
];

const profesorAsistenteSteps: DriveStep[] = [
  {
    element: '[data-tour="profesor-asistente-dias"]',
    popover: {
      title: 'Días del bloque',
      description:
        'En modo bloque (x2, x3, x4, x5) elegí qué día estás cargando. Cada día se repite en varias sesiones del plan.',
      side: 'bottom',
      align: 'start',
    },
    skipMissingElement: true,
  },
  {
    element: '[data-tour="profesor-asistente-tabs"]',
    popover: {
      title: 'Secciones del plan',
      description:
        'Recorré las pestañas: entrada en calor, grupos musculares, vuelta a la calma y vista previa.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '[data-tour="profesor-asistente-buscar"]',
    popover: {
      title: 'Agregar ejercicios',
      description:
        'En cada sección, tocá Buscar ejercicios para abrir el catálogo. Elegí uno, completá series/reps y agregalo al plan.',
      side: 'top',
      align: 'start',
    },
    skipMissingElement: true,
  },
  {
    element: '[data-tour="profesor-asistente-guardar"]',
    popover: {
      title: 'Guardar planilla',
      description:
        'Los cambios quedan en borrador hasta que guardás. El alumno ve la versión guardada en su portal.',
      side: 'bottom',
      align: 'end',
    },
  },
  {
    element: '[data-tour="profesor-asistente-ajuste"]',
    popover: {
      title: 'Ajuste desde sesión N (⚡)',
      description:
        'Si el alumno ya entrenó, usá ⚡ en ejercicios o en entrada en calor/vuelta a la calma para cambiar desde una sesión futura sin alterar lo ya hecho.',
      side: 'top',
      align: 'start',
    },
    skipMissingElement: true,
  },
];

const profesorProgresoSteps: DriveStep[] = [
  {
    element: '[data-tour="profesor-progreso-panel"]',
    popover: {
      title: 'Progreso del alumno',
      description:
        'Adherencia, RPE promedio y estado de cada sesión que el alumno completó en el portal.',
      side: 'bottom',
      align: 'start',
    },
    skipMissingElement: true,
  },
  {
    element: '[data-tour="profesor-progreso-feedback"]',
    popover: {
      title: 'Feedback y comentarios',
      description:
        'Revisá RPE, comentarios de sesión y notas por ejercicio. Usá esto para ajustar la planificación.',
      side: 'top',
      align: 'start',
    },
    skipMissingElement: true,
  },
];

const alumnoMensajesSteps: DriveStep[] = [
  {
    element: '[data-tour="alumno-mensajes-intro"]',
    popover: {
      title: 'Mensajes con tu profesor',
      description:
        'Acá podés escribirle por dudas de entrenamiento, feedback de sesiones o pedir cambios en tu plan.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '[data-tour="alumno-mensajes-notificaciones"]',
    popover: {
      title: 'Notificaciones',
      description:
        'Activá avisos en el celular o navegador para enterarte cuando tu profesor te responda.',
      side: 'bottom',
      align: 'start',
    },
    skipMissingElement: true,
  },
  {
    element: '[data-tour="alumno-mensajes-chat"]',
    popover: {
      title: 'Chat directo',
      description:
        'Este es el hilo con tu profesor asignado. Los mensajes quedan guardados acá.',
      side: 'bottom',
      align: 'start',
    },
    skipMissingElement: true,
  },
  {
    element: '[data-tour="alumno-mensajes-historial"]',
    popover: {
      title: 'Historial',
      description:
        'Tus mensajes aparecen a la derecha; los del profesor, a la izquierda. Deslizá para ver conversaciones anteriores.',
      side: 'top',
      align: 'start',
    },
    skipMissingElement: true,
  },
  {
    element: '[data-tour="alumno-mensajes-enviar"]',
    popover: {
      title: 'Enviar mensaje',
      description:
        'Escribí tu consulta y tocá Enviar. Podés comentar cómo te sentiste en una sesión o pedir un ajuste.',
      side: 'top',
      align: 'end',
    },
    skipMissingElement: true,
  },
];

const TOURS: Record<TourId, DriveStep[]> = {
  'alumno-planificacion': alumnoPlanificacionSteps,
  'alumno-sesion': alumnoSesionSteps,
  'alumno-sesiones': alumnoSesionesListSteps,
  'alumno-metricas': alumnoMetricasSteps,
  'alumno-mensajes': alumnoMensajesSteps,
  'profesor-dashboard': profesorDashboardSteps,
  'profesor-ejercicios': profesorEjerciciosSteps,
  'profesor-asistente': profesorAsistenteSteps,
  'profesor-progreso': profesorProgresoSteps,
};

export function getTourSteps(tourId: TourId): DriveStep[] {
  return TOURS[tourId];
}
