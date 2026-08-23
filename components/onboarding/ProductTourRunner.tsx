'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { resolveTourFromPath } from '@/lib/onboarding/resolve-tour';
import { isTourCompleted } from '@/lib/onboarding/storage';
import { runProductTour, waitForTourAnchors } from '@/lib/onboarding/run-tour';

/** Auto-inicia la guía contextual la primera vez en cada pantalla. */
export function ProductTourRunner() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname === lastPath.current) return;
    lastPath.current = pathname;

    const tourId = resolveTourFromPath(pathname);
    if (!tourId || isTourCompleted(tourId)) return;

    let cancelled = false;

    const timer = window.setTimeout(async () => {
      const ready = await waitForTourAnchors(tourId);
      if (cancelled || !ready) return;
      runProductTour(tourId);
    }, 900);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [pathname]);

  return null;
}
