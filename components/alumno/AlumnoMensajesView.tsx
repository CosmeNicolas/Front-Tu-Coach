'use client';

import { useMyMessageThread } from '@/hooks/useMessages';
import { ChatThreadView } from '@/components/mensajes/ChatThreadView';
import { PushNotificationsCard } from '@/components/notifications/PushNotificationsCard';

export function AlumnoMensajesView() {
  const { data: thread, isLoading, error } = useMyMessageThread();

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-2xl flex-col gap-4 p-4 sm:p-6">
      <header data-tour="alumno-mensajes-intro">
        <h1 className="text-2xl font-bold text-foreground">Mensajes</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Escribile a tu profesor por dudas, feedback o para pedir cambios en
          tu planificación.
        </p>
      </header>

      <div data-tour="alumno-mensajes-notificaciones">
        <PushNotificationsCard variant="banner" />
      </div>

      {isLoading ? (
        <div className="h-[420px] animate-pulse rounded-2xl bg-muted" />
      ) : error || !thread ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-6 text-sm text-destructive">
          No se pudo cargar el chat. Verificá que tengas un profesor asignado.
        </p>
      ) : (
        <ChatThreadView
          thread={thread}
          currentRole="alumno"
          emptyHint="Escribile a tu profesor. Te va a llegar el aviso en su panel."
        />
      )}
    </div>
  );
}
