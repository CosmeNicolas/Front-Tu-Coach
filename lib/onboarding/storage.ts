import { TourId } from '@/lib/onboarding/types';

const PREFIX = 'tucoach-tour-v1:';

export function isTourCompleted(tourId: TourId): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return localStorage.getItem(`${PREFIX}${tourId}`) === '1';
  } catch {
    return false;
  }
}

export function markTourCompleted(tourId: TourId): void {
  try {
    localStorage.setItem(`${PREFIX}${tourId}`, '1');
  } catch {
    /* ignore */
  }
}

export function resetTour(tourId: TourId): void {
  try {
    localStorage.removeItem(`${PREFIX}${tourId}`);
  } catch {
    /* ignore */
  }
}
