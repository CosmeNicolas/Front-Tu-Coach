export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export type PwaPlatform = 'ios' | 'android' | 'other';
export type PwaInstallResult = 'accepted' | 'dismissed' | 'unavailable';

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let installed = false;
const subscribers = new Set<() => void>();

function notify() {
  subscribers.forEach((fn) => fn());
}

export function isStandaloneDisplay(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(display-mode: standalone)').matches) return true;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return nav.standalone === true;
}

export function detectPwaPlatform(): PwaPlatform {
  if (typeof window === 'undefined') return 'other';
  const ua = window.navigator.userAgent;
  const iOS = /iPad|iPhone|iPod/i.test(ua);
  const iPadOS =
    window.navigator.platform === 'MacIntel' &&
    window.navigator.maxTouchPoints > 1;
  if (iOS || iPadOS) return 'ios';
  if (/Android/i.test(ua)) return 'android';
  return 'other';
}

export function capturePwaInstallEvents() {
  if (typeof window === 'undefined') return;
  const w = window as Window & { __tucoachPwaBound?: boolean };
  if (w.__tucoachPwaBound) return;
  w.__tucoachPwaBound = true;

  if (isStandaloneDisplay()) {
    installed = true;
  }

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event as BeforeInstallPromptEvent;
    notify();
  });

  window.addEventListener('appinstalled', () => {
    installed = true;
    deferredPrompt = null;
    notify();
  });
}

export function subscribePwaInstall(listener: () => void): () => void {
  subscribers.add(listener);
  return () => {
    subscribers.delete(listener);
  };
}

export function getPwaInstallSnapshot() {
  return {
    isInstallable: Boolean(deferredPrompt),
    isInstalled: installed || isStandaloneDisplay(),
    platform: detectPwaPlatform(),
  };
}

export async function triggerPwaInstall(): Promise<PwaInstallResult> {
  if (!deferredPrompt) return 'unavailable';
  const promptEvent = deferredPrompt;
  deferredPrompt = null;
  notify();
  try {
    await promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    if (outcome === 'accepted') {
      installed = true;
      notify();
      return 'accepted';
    }
    return 'dismissed';
  } catch {
    return 'unavailable';
  }
}
