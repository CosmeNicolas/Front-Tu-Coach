'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@/lib/api/client';
import { fetchPushStatus, sendPushTest } from '@/lib/api/push';
import {
  disablePushNotifications,
  enablePushNotifications,
} from '@/lib/push/subscribe';
import { isPushSupported } from '@/lib/push/utils';
import { Button } from '@/components/ui/button';

interface Props {
  /** Compacto para banner; full para página de ajustes */
  variant?: 'banner' | 'card';
}

export function PushNotificationsCard({ variant = 'card' }: Props) {
  const qc = useQueryClient();
  const supported = isPushSupported();
  const [busy, setBusy] = useState(false);
  const { data: status, isLoading } = useQuery({
    queryKey: ['push', 'status'],
    queryFn: fetchPushStatus,
    retry: false,
    staleTime: 15_000,
  });

  async function handleEnable() {
    setBusy(true);
    try {
      const result = await enablePushNotifications();
      if (!result.ok) {
        toast.error('No se activaron las notificaciones', {
          description: result.message,
        });
        return;
      }
      await qc.invalidateQueries({ queryKey: ['push', 'status'] });
      toast.success(result.message);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Error al activar notificaciones push.';
      toast.error('Error', { description: message });
    } finally {
      setBusy(false);
    }
  }

  async function handleDisable() {
    setBusy(true);
    try {
      const result = await disablePushNotifications();
      if (!result.ok) {
        toast.error('No se pudieron desactivar', {
          description: result.message,
        });
        return;
      }
      await qc.invalidateQueries({ queryKey: ['push', 'status'] });
      toast.success(result.message);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Error al desactivar push.';
      toast.error('Error', { description: message });
    } finally {
      setBusy(false);
    }
  }

  async function handleTest() {
    setBusy(true);
    try {
      const result = await sendPushTest();
      if (!result.ok) {
        toast.error('Prueba fallida', {
          description: result.message ?? 'No se envió la notificación.',
        });
        return;
      }
      toast.success(result.message ?? 'Notificación de prueba enviada');
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Error al enviar prueba.';
      toast.error('Error', { description: message });
    } finally {
      setBusy(false);
    }
  }

  if (!supported) {
    return (
      <div className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
        Este dispositivo/navegador no soporta push web. En iPhone: instalá
        TuCoach en la pantalla de inicio (Compartir → Agregar a inicio) y
        volvé a intentar.
      </div>
    );
  }

  const subscribed = Boolean(status?.subscribed);
  const configured = status?.configured !== false;

  return (
    <div
      className={
        variant === 'banner'
          ? 'rounded-xl border border-border bg-card px-4 py-3 shadow-sm'
          : 'rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5'
      }
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">
            Notificaciones push
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {isLoading
              ? 'Consultando estado…'
              : !configured
                ? 'El servidor aún no tiene VAPID configurado.'
                : subscribed
                  ? 'Activas en este dispositivo. Vas a recibir avisos aunque la app esté en segundo plano.'
                  : 'Activá avisos en el celular o la PC cuando un alumno escriba o termine un plan.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {subscribed ? (
            <>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={busy}
                onClick={() => void handleTest()}
              >
                Probar
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={busy}
                onClick={() => void handleDisable()}
              >
                Desactivar
              </Button>
            </>
          ) : (
            <Button
              type="button"
              size="sm"
              disabled={busy || !configured}
              onClick={() => void handleEnable()}
            >
              {busy ? 'Activando…' : 'Activar'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
