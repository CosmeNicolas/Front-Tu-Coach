'use client';

import { useEffect } from 'react';
import { registerTuCoachServiceWorker } from '@/lib/push/utils';

/**
 * Registra el SW en cuanto hay sesión (no pide permiso todavía).
 */
export function PushNotificationsBootstrap() {
  useEffect(() => {
    void registerTuCoachServiceWorker();
  }, []);

  return null;
}
