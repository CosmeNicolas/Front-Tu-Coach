import {
  fetchVapidPublicKey,
  subscribePush,
  unsubscribePush,
} from '@/lib/api/push';
import {
  detectDeviceLabel,
  isPushSupported,
  registerTuCoachServiceWorker,
  urlBase64ToUint8Array,
} from '@/lib/push/utils';

function toBase64(buffer: ArrayBuffer | null): string {
  if (!buffer) return '';
  const bytes = new Uint8Array(buffer);
  let binary = '';
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return window.btoa(binary);
}

export type EnablePushResult =
  | { ok: true; message: string }
  | { ok: false; message: string; code: string };

export async function enablePushNotifications(): Promise<EnablePushResult> {
  if (!isPushSupported()) {
    return {
      ok: false,
      code: 'unsupported',
      message:
        'Este navegador no soporta notificaciones push. Probá Chrome/Edge en Android o escritorio, o instalá la PWA en iOS.',
    };
  }

  if (!window.isSecureContext && window.location.hostname !== 'localhost') {
    return {
      ok: false,
      code: 'insecure',
      message: 'Las notificaciones push requieren HTTPS.',
    };
  }

  const vapid = await fetchVapidPublicKey();
  if (!vapid.configured || !vapid.publicKey) {
    return {
      ok: false,
      code: 'server',
      message:
        'El servidor aún no tiene configuradas las claves VAPID. Pedile al admin que las active.',
    };
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    return {
      ok: false,
      code: 'denied',
      message:
        permission === 'denied'
          ? 'Bloqueaste las notificaciones en el navegador. Activalas desde la configuración del sitio.'
          : 'No se otorgó permiso para notificaciones.',
    };
  }

  const registration = await registerTuCoachServiceWorker();
  if (!registration) {
    return {
      ok: false,
      code: 'sw',
      message: 'No se pudo registrar el service worker.',
    };
  }

  await navigator.serviceWorker.ready;

  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    try {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          vapid.publicKey,
        ) as BufferSource,
      });
    } catch {
      return {
        ok: false,
        code: 'subscribe',
        message:
          'No se pudo crear la suscripción push. En iPhone, instalá TuCoach en la pantalla de inicio e intentá de nuevo.',
      };
    }
  }

  const json = subscription.toJSON();
  if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
    return {
      ok: false,
      code: 'keys',
      message: 'La suscripción del navegador vino incompleta.',
    };
  }

  await subscribePush({
    subscription: {
      endpoint: json.endpoint,
      keys: {
        p256dh: json.keys.p256dh || toBase64(subscription.getKey('p256dh')),
        auth: json.keys.auth || toBase64(subscription.getKey('auth')),
      },
    },
    userAgent: navigator.userAgent,
    dispositivo: detectDeviceLabel(),
  });

  try {
    localStorage.setItem('tucoach.push.enabled', '1');
  } catch {
    // ignore
  }

  return { ok: true, message: 'Notificaciones push activadas' };
}

export async function disablePushNotifications(): Promise<EnablePushResult> {
  if (!isPushSupported()) {
    return { ok: false, code: 'unsupported', message: 'Push no soportado' };
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration('/');
    const subscription = await registration?.pushManager.getSubscription();
    const endpoint = subscription?.endpoint;
    if (subscription) {
      await subscription.unsubscribe();
    }
    await unsubscribePush(endpoint);
    try {
      localStorage.removeItem('tucoach.push.enabled');
    } catch {
      // ignore
    }
    return { ok: true, message: 'Notificaciones push desactivadas' };
  } catch {
    return {
      ok: false,
      code: 'unsubscribe',
      message: 'No se pudo desactivar la suscripción push.',
    };
  }
}
