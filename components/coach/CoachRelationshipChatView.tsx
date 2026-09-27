'use client';

import Link from 'next/link';
import { ApiError } from '@/lib/api/client';
import {
  useCoachChat,
  useMarkCoachChatRead,
  useSendCoachChatMessage,
} from '@/hooks/useCoachRelationships';
import { ChatThreadView } from '@/components/mensajes/ChatThreadView';
import { Button } from '@/components/ui/button';
import type { ThreadDetail } from '@/types/message';

export function CoachRelationshipChatView({
  relationshipId,
  currentRole,
  backHref,
  backLabel,
}: {
  relationshipId: string;
  currentRole: 'alumno' | 'profesor';
  backHref: string;
  backLabel: string;
}) {
  const { data, isLoading, error } = useCoachChat(relationshipId);
  const send = useSendCoachChatMessage(relationshipId);
  const markRead = useMarkCoachChatRead(relationshipId);

  if (isLoading) {
    return (
      <p className="p-6 text-sm text-muted-foreground">Cargando chat…</p>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-3 p-6">
        <Button asChild variant="ghost" size="sm">
          <Link href={backHref}>← {backLabel}</Link>
        </Button>
        <p className="text-sm text-destructive">
          {error instanceof ApiError
            ? error.message
            : 'No se pudo cargar el chat.'}
        </p>
      </div>
    );
  }

  const thread: ThreadDetail = {
    threadKey: data.threadKey,
    alumnoId: data.alumnoId,
    alumnoNombre: data.alumnoNombre,
    profesorNombre: data.profesorNombre,
    messages: data.messages,
    unreadCount: data.unreadCount,
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 p-4 sm:p-8">
      <Button asChild variant="ghost" size="sm" className="self-start">
        <Link href={backHref}>← {backLabel}</Link>
      </Button>
      <ChatThreadView
        thread={thread}
        currentRole={currentRole}
        emptyHint="Todavía no hay mensajes en este vínculo. Escribí el primero."
        isSending={send.isPending}
        onMarkRead={() => {
          if (!markRead.isPending) markRead.mutate();
        }}
        onSend={async (text) => {
          await send.mutateAsync(text);
        }}
      />
    </div>
  );
}
