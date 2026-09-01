'use client';

import { useEffect } from 'react';
import { capturePwaInstallEvents } from '@/lib/pwa/install-events';
import { registerTuCoachServiceWorker } from '@/lib/push/utils';

/** Captura el prompt nativo de Chrome/Android lo antes posible. */
export function PwaInstallBootstrap() {
  useEffect(() => {
    capturePwaInstallEvents();
    void registerTuCoachServiceWorker();
  }, []);

  return null;
}
