'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  CalendarDays,
  ClipboardList,
  MessageSquare,
  UserCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { BrandMark } from '@/components/branding/BrandMark';
import { AlumnoLogoutButton } from '@/components/alumno/AlumnoLogoutButton';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { AlumnoPortalGreeting } from '@/components/alumno/AlumnoPortalGreeting';
import { AlumnoFloatingMenu } from './AlumnoFloatingMenu';
import { useMessagesUnreadCount } from '@/hooks/useMessages';

const DESKTOP_NAV = [
  {
    href: '/alumno/mi-planificacion',
    label: 'Mi planificación',
    icon: ClipboardList,
  },
  { href: '/alumno/sesiones', label: 'Sesiones', icon: CalendarDays },
  { href: '/alumno/mensajes', label: 'Mensajes', icon: MessageSquare },
  { href: '/alumno/metricas', label: 'Métricas', icon: BarChart3 },
  { href: '/alumno/mis-datos', label: 'Mis datos', icon: UserCircle },
] as const;

function isNavActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AlumnoMobileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: unread } = useMessagesUnreadCount(true);
  const unreadCount = unread?.count ?? 0;

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card lg:flex">
        <div className="space-y-4 border-b border-border px-5 py-6">
          <div>
            <BrandMark size="md" priority />
            <p className="mt-0.5 text-xs text-muted-foreground">
              Tu espacio de entrenamiento
            </p>
          </div>
          <AlumnoPortalGreeting showAvatar />
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Navegación alumno">
          {DESKTOP_NAV.map((item) => {
            const active = isNavActive(pathname, item.href);
            const Icon = item.icon;
            const showBadge =
              item.href === '/alumno/mensajes' && unreadCount > 0;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
                aria-current={active ? 'page' : undefined}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                <span className="flex-1">{item.label}</span>
                {showBadge ? (
                  <span
                    className={cn(
                      'rounded-full px-1.5 text-[10px] font-bold',
                      active
                        ? 'bg-primary-foreground text-primary'
                        : 'bg-primary text-primary-foreground',
                    )}
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-3 border-t border-border p-4">
          <ThemeToggle />
          <AlumnoLogoutButton />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col [--alumno-sticky-top:4.25rem] lg:[--alumno-sticky-top:0px]">
        <header className="fixed inset-x-0 top-0 z-30 border-b border-border bg-card/95 px-4 py-2.5 backdrop-blur-sm lg:hidden">
          <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <AlumnoPortalGreeting compact />
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <BrandMark size="sm" showWordmark={false} priority />
              <ThemeToggle variant="compact" />
            </div>
          </div>
        </header>

        <div
          className="h-(--alumno-sticky-top) shrink-0 lg:hidden"
          aria-hidden
        />

        <main className="mx-auto w-full max-w-lg flex-1 pb-28 lg:max-w-4xl lg:pb-8">
          {children}
        </main>

        <AlumnoFloatingMenu />
      </div>
    </div>
  );
}
