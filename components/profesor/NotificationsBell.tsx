'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
  useUnreadNotificationCount,
} from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils/cn';

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString('es-AR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const { data: unread } = useUnreadNotificationCount(true);
  const { data: items = [], isLoading } = useNotifications(open);
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();
  const count = unread?.count ?? 0;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="relative"
          aria-label={
            count > 0
              ? `Notificaciones, ${count} sin leer`
              : 'Notificaciones'
          }
        >
          <Bell className="size-5" />
          {count > 0 ? (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
              {count > 99 ? '99+' : count}
            </span>
          ) : null}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader className="space-y-3 border-b border-border pb-4 text-left">
          <div className="flex items-center justify-between gap-3 pr-8">
            <SheetTitle>Notificaciones</SheetTitle>
            {count > 0 ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={markAll.isPending}
                onClick={() => markAll.mutate()}
              >
                Marcar todas
              </Button>
            ) : null}
          </div>
        </SheetHeader>

        <div className="mt-4 flex-1 space-y-2 overflow-y-auto pb-6">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Cargando…</p>
          ) : items.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
              Todavía no hay avisos de tus alumnos.
            </p>
          ) : (
            items.map((n) => {
              const unreadItem = !n.readAt;
              const content = (
                <div
                  className={cn(
                    'rounded-xl border px-3 py-3 transition-colors',
                    unreadItem
                      ? 'border-primary/30 bg-primary/5'
                      : 'border-border bg-card',
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">
                      {n.title}
                    </p>
                    <span className="shrink-0 text-[11px] text-muted-foreground">
                      {formatWhen(n.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
                </div>
              );

              if (n.href) {
                return (
                  <Link
                    key={n.id}
                    href={n.href}
                    onClick={() => {
                      if (unreadItem) markRead.mutate(n.id);
                      setOpen(false);
                    }}
                    className="block"
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <button
                  key={n.id}
                  type="button"
                  className="block w-full text-left"
                  onClick={() => {
                    if (unreadItem) markRead.mutate(n.id);
                  }}
                >
                  {content}
                </button>
              );
            })
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
