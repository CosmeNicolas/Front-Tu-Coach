'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useClients } from '@/hooks/useClients';
import {
  useMessageThreads,
  useThreadWithAlumno,
} from '@/hooks/useMessages';
import { ChatThreadView } from '@/components/mensajes/ChatThreadView';
import { PushNotificationsCard } from '@/components/notifications/PushNotificationsCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

function formatWhen(iso: string | null | undefined) {
  if (!iso) return '';
  return new Date(iso).toLocaleString('es-AR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ProfesorMensajesView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const alumnoFromQuery = searchParams.get('alumnoId') ?? '';

  const { data: threads = [], isLoading: loadingThreads } = useMessageThreads();
  const { data: clientsData } = useClients({ limit: 100 });
  const clients = clientsData?.items ?? [];

  const [selectedAlumnoId, setSelectedAlumnoId] = useState(alumnoFromQuery);

  useEffect(() => {
    if (alumnoFromQuery) {
      setSelectedAlumnoId(alumnoFromQuery);
    }
  }, [alumnoFromQuery]);

  useEffect(() => {
    if (!selectedAlumnoId && threads.length > 0) {
      setSelectedAlumnoId(threads[0]!.alumnoId);
    }
  }, [selectedAlumnoId, threads]);

  const { data: thread, isLoading: loadingThread } = useThreadWithAlumno(
    selectedAlumnoId,
  );

  const threadByAlumno = useMemo(() => {
    const map = new Map(threads.map((t) => [t.alumnoId, t]));
    return map;
  }, [threads]);

  const clientsWithoutThread = clients.filter(
    (c) => !threadByAlumno.has(c.id),
  );

  function selectAlumno(alumnoId: string) {
    setSelectedAlumnoId(alumnoId);
    router.replace(`/profesor/mensajes?alumnoId=${alumnoId}`);
  }

  return (
    <div className="space-y-4 p-4 sm:p-8">
      <header>
        <h1 className="font-display text-2xl tracking-wide text-foreground sm:text-3xl">
          Mensajes
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Chat con tus alumnos. Los mensajes nuevos también aparecen en la
          campana de notificaciones.
        </p>
      </header>

      <PushNotificationsCard variant="banner" />

      <div className="grid min-w-0 gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="min-w-0 rounded-2xl border border-border bg-card p-3">
          <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Conversaciones
          </p>
          {loadingThreads ? (
            <p className="px-2 py-4 text-sm text-muted-foreground">Cargando…</p>
          ) : (
            <ul className="space-y-1">
              {threads.map((t) => {
                const active = t.alumnoId === selectedAlumnoId;
                return (
                  <li key={t.threadKey}>
                    <button
                      type="button"
                      onClick={() => selectAlumno(t.alumnoId)}
                      className={cn(
                        'flex w-full flex-col rounded-xl px-3 py-2.5 text-left transition-colors',
                        active
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted',
                      )}
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-medium">
                          {t.alumnoNombre}
                        </span>
                        {t.unreadCount > 0 ? (
                          <span
                            className={cn(
                              'rounded-full px-1.5 text-[10px] font-bold',
                              active
                                ? 'bg-primary-foreground text-primary'
                                : 'bg-primary text-primary-foreground',
                            )}
                          >
                            {t.unreadCount}
                          </span>
                        ) : null}
                      </span>
                      <span
                        className={cn(
                          'mt-0.5 truncate text-xs',
                          active
                            ? 'text-primary-foreground/75'
                            : 'text-muted-foreground',
                        )}
                      >
                        {t.lastMessage?.text ?? 'Sin mensajes'}
                      </span>
                      <span
                        className={cn(
                          'mt-0.5 text-[10px]',
                          active
                            ? 'text-primary-foreground/60'
                            : 'text-muted-foreground',
                        )}
                      >
                        {formatWhen(t.updatedAt)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {clientsWithoutThread.length > 0 ? (
            <div className="mt-4 border-t border-border pt-3">
              <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Iniciar chat
              </p>
              <ul className="max-h-48 space-y-1 overflow-y-auto">
                {clientsWithoutThread.map((c) => (
                  <li key={c.id}>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => selectAlumno(c.id)}
                    >
                      {c.apellido}, {c.nombre}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>

        <div className="min-h-[480px] min-w-0">
          {!selectedAlumnoId ? (
            <div className="flex h-full min-h-[420px] items-center justify-center rounded-2xl border border-dashed border-border px-4 text-center text-sm text-muted-foreground">
              Seleccioná un alumno para ver o iniciar el chat.
            </div>
          ) : loadingThread || !thread ? (
            <div className="flex h-full min-h-[420px] items-center justify-center rounded-2xl border border-border text-sm text-muted-foreground">
              Cargando conversación…
            </div>
          ) : (
            <ChatThreadView
              thread={thread}
              currentRole="profesor"
              emptyHint="Todavía no hay mensajes con este alumno. Escribí el primero."
            />
          )}
        </div>
      </div>
    </div>
  );
}
