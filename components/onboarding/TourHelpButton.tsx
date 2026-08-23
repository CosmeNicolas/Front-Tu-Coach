'use client';

import { CircleHelp } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { resolveTourFromPath } from '@/lib/onboarding/resolve-tour';
import { runProductTour } from '@/lib/onboarding/run-tour';
import { TOUR_LABELS } from '@/lib/onboarding/types';

export function TourHelpButton() {
  const pathname = usePathname();
  const tourId = pathname ? resolveTourFromPath(pathname) : null;

  if (!tourId) return null;

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="gap-1.5 text-xs"
      onClick={() => runProductTour(tourId, { force: true })}
      aria-label={`Ver guía: ${TOUR_LABELS[tourId]}`}
    >
      <CircleHelp className="size-3.5" aria-hidden />
      <span className="hidden sm:inline">Guía</span>
    </Button>
  );
}
