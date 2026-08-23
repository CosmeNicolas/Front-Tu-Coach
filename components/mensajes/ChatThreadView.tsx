'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api/client';
import {
  useMarkThreadRead,
  useSendThreadMessage,
} from '@/hooks/useMessages';
import { ThreadDetail } from '@/types/message';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

interface Props {
  thread: ThreadDetail;
  /** Rol del usuario actual: define alineación de burbujas */
  currentRole: 'alumno' | 'profesor';
  emptyHint?: string;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleString('es-AR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ChatThreadView({ thread, currentRole, emptyHint }: Props) {
  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const markRead = useMarkThreadRead();
  const send = useSendThreadMessage();

  useEffect(() => {
    if (thread.unreadCount > 0) {
      markRead.mutate(thread.threadKey);
    }
    // Solo al abrir / cambiar hilo
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thread.threadKey]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread.messages.length, thread.threadKey]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const value = text.trim();
    if (!value || send.isPending) return;
    try {
      await send.mutateAsync({ threadKey: thread.threadKey, text: value });
      setText('');
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'No se pudo enviar el mensaje.';
      toast.error('Error', { description: message });
    }
  }

  const peerName =
    currentRole === 'profesor'
      ? thread.alumnoNombre
      : thread.profesorNombre ?? 'Tu profesor';

  return (
    <div className="flex h-full min-h-[420px] min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <header
        className="min-w-0 border-b border-border px-4 py-3"
        {...(currentRole === 'alumno'
          ? { 'data-tour': 'alumno-mensajes-chat' }
          : {})}
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Chat
        </p>
        <h2 className="truncate text-base font-semibold text-foreground">
          {peerName}
        </h2>
      </header>

      <div
        className="min-h-0 min-w-0 flex-1 space-y-3 overflow-x-hidden overflow-y-auto px-4 py-4"
        {...(currentRole === 'alumno'
          ? { 'data-tour': 'alumno-mensajes-historial' }
          : {})}
      >
        {thread.messages.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
            {emptyHint ?? 'Todavía no hay mensajes. Escribí el primero.'}
          </p>
        ) : (
          thread.messages.map((m) => {
            const mine = m.senderRole === currentRole;
            return (
              <div
                key={m.id}
                className={cn(
                  'flex min-w-0',
                  mine ? 'justify-end' : 'justify-start',
                )}
              >
                <div
                  className={cn(
                    'min-w-0 max-w-[min(85%,28rem)] rounded-2xl px-3 py-2 text-sm',
                    mine
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground',
                  )}
                >
                  <p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
                    {m.text}
                  </p>
                  <p
                    className={cn(
                      'mt-1 text-[10px]',
                      mine
                        ? 'text-primary-foreground/70'
                        : 'text-muted-foreground',
                    )}
                  >
                    {formatTime(m.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="flex min-w-0 gap-2 border-t border-border p-3"
        {...(currentRole === 'alumno'
          ? { 'data-tour': 'alumno-mensajes-enviar' }
          : {})}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={1000}
          placeholder="Escribí un mensaje…"
          className="min-w-0 flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm"
        />
        <Button type="submit" disabled={send.isPending || !text.trim()}>
          {send.isPending ? '…' : 'Enviar'}
        </Button>
      </form>
    </div>
  );
}
