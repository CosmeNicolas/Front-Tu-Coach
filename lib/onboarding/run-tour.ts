import { driver, type DriveStep } from 'driver.js';
import 'driver.js/dist/driver.css';
import { getTourSteps } from '@/lib/onboarding/tours';
import { markTourCompleted, isTourCompleted } from '@/lib/onboarding/storage';
import { TourId } from '@/lib/onboarding/types';

/** Ancla mínima para auto-start (evita arrancar antes de que cargue el contenido). */
const TOUR_REQUIRED_ANCHOR: Partial<Record<TourId, string>> = {
  'alumno-planificacion': '[data-tour="alumno-plan-lista"]',
  'alumno-sesiones': '[data-tour="alumno-plan-lista"]',
  'alumno-sesion': '[data-tour="alumno-session-header"]',
  'alumno-mensajes': '[data-tour="alumno-mensajes-enviar"]',
  'profesor-dashboard': '[data-tour="profesor-dashboard-stats"]',
  'profesor-ejercicios': '[data-tour="profesor-ejercicios-formulario"]',
};

function filterAvailableSteps(steps: DriveStep[]): DriveStep[] {
  return steps.filter((step) => {
    if (!step.element || typeof step.element !== 'string') return true;
    return Boolean(document.querySelector(step.element));
  });
}

export function runProductTour(
  tourId: TourId,
  options?: { force?: boolean; markComplete?: boolean },
): boolean {
  if (typeof window === 'undefined') return false;
  if (!options?.force && isTourCompleted(tourId)) return false;

  const steps = filterAvailableSteps(getTourSteps(tourId));
  if (steps.length === 0) return false;

  let finished = false;

  const driverObj = driver({
    showProgress: true,
    progressText: '{{current}} de {{total}}',
    nextBtnText: 'Siguiente',
    prevBtnText: 'Anterior',
    doneBtnText: 'Listo',
    popoverClass: 'tucoach-driver-popover',
    steps,
    onNextClick: (_el, _step, { driver: d }) => {
      if (d.isLastStep()) finished = true;
      d.moveNext();
    },
    onCloseClick: (_el, _step, { driver: d }) => {
      d.destroy();
    },
    onDestroyed: () => {
      if (finished && options?.markComplete !== false) {
        markTourCompleted(tourId);
      }
    },
  });

  driverObj.drive();
  return true;
}

/** Espera a que existan elementos clave antes del auto-start. */
export function waitForTourAnchors(
  tourId: TourId,
  timeoutMs = 4000,
): Promise<boolean> {
  const required = TOUR_REQUIRED_ANCHOR[tourId];
  const steps = getTourSteps(tourId);
  const selectors = required
    ? [required]
    : steps
        .map((s) => (typeof s.element === 'string' ? s.element : null))
        .filter((s): s is string => Boolean(s));

  if (selectors.length === 0) return Promise.resolve(true);

  const start = Date.now();
  return new Promise((resolve) => {
    const tick = () => {
      const found = selectors.some((sel) => document.querySelector(sel));
      if (found || Date.now() - start >= timeoutMs) {
        resolve(found);
        return;
      }
      requestAnimationFrame(tick);
    };
    tick();
  });
}
