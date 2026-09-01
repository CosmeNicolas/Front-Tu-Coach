'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  capturePwaInstallEvents,
  getPwaInstallSnapshot,
  subscribePwaInstall,
  triggerPwaInstall,
  type PwaInstallResult,
  type PwaPlatform,
} from '@/lib/pwa/install-events';
import { registerTuCoachServiceWorker } from '@/lib/push/utils';

export type { PwaPlatform, PwaInstallResult };

export function usePWAInstall() {
  const [state, setState] = useState(() => ({
    isInstallable: false,
    isInstalled: false,
    platform: 'other' as PwaPlatform,
  }));

  useEffect(() => {
    capturePwaInstallEvents();
    void registerTuCoachServiceWorker();
    setState(getPwaInstallSnapshot());
    return subscribePwaInstall(() => {
      setState(getPwaInstallSnapshot());
    });
  }, []);

  const promptInstall = useCallback(async (): Promise<PwaInstallResult> => {
    return triggerPwaInstall();
  }, []);

  return {
    ...state,
    promptInstall,
  };
}
