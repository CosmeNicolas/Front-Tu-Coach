'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  CalendarDays,
  ClipboardList,
  Download,
  Gift,
  LogOut,
  Menu,
  MessageSquare,
  UserCircle,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlumnoPortalGreeting } from '@/components/alumno/AlumnoPortalGreeting';
import { AlumnoLogoutConfirmDialog } from './AlumnoLogoutConfirmDialog';
import { useMessagesUnreadCount } from '@/hooks/useMessages';
import { cn } from '@/lib/utils/cn';

const MENU_ITEMS = [
  { href: '/alumno/mi-planificacion', label: 'Mi planificación', icon: ClipboardList },
  { href: '/alumno/sesiones', label: 'Sesiones', icon: CalendarDays },
  { href: '/alumno/mensajes', label: 'Mensajes', icon: MessageSquare },
  { href: '/alumno/metricas', label: 'Métricas', icon: BarChart3 },
  { href: '/alumno/beneficios', label: 'Beneficios', icon: Gift },
  { href: '/alumno/mis-datos', label: 'Datos personales', icon: UserCircle },
] as const;

const panelTransition = {
  type: 'spring' as const,
  damping: 30,
  stiffness: 320,
};

const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, damping: 26, stiffness: 340 },
  },
};

interface AlumnoFloatingMenuProps {
  showInstallApp?: boolean;
  onInstallApp?: () => void;
}

export function AlumnoFloatingMenu({
  showInstallApp = false,
  onInstallApp,
}: AlumnoFloatingMenuProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const { data: unread } = useMessagesUnreadCount(true);
  const unreadCount = unread?.count ?? 0;

  function requestLogout() {
    setOpen(false);
    setLogoutConfirmOpen(true);
  }

  function requestInstall() {
    setOpen(false);
    onInstallApp?.();
  }

  useEffect(() => {
    if (!open || logoutConfirmOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, logoutConfirmOpen]);

  return (
    <>
      <Button
        type="button"
        size="icon"
        aria-label={
          unreadCount > 0
            ? `Abrir menú, ${unreadCount} mensajes sin leer`
            : 'Abrir menú de navegación'
        }
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={cn(
          'relative fixed bottom-5 right-4 z-40 size-14 rounded-full shadow-lg lg:hidden',
          'bg-primary text-primary-foreground hover:bg-primary/90',
        )}
      >
        <Menu className="size-6" aria-hidden />
        {unreadCount > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-background px-1 text-[10px] font-bold text-foreground ring-2 ring-primary">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        ) : null}
      </Button>

      <AnimatePresence>
        {open ? (
          <>
            <motion.button
              type="button"
              aria-label="Cerrar menú"
              className="fixed inset-0 z-50 bg-black/60 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="alumno-menu-title"
              className={cn(
                'fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col',
                'rounded-t-2xl border-t border-border bg-card p-6 pb-8 shadow-2xl lg:hidden',
              )}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={panelTransition}
            >
              <div className="mb-5 flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-3">
                  <AlumnoPortalGreeting showAvatar />
                  <div>
                    <h2
                      id="alumno-menu-title"
                      className="text-base font-semibold text-foreground"
                    >
                      Menú rápido
                    </h2>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Navegá por tu entrenamiento
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Cerrar"
                  onClick={() => setOpen(false)}
                  className="shrink-0"
                >
                  <X className="size-5" />
                </Button>
              </div>

              <motion.nav
                className="flex flex-col gap-2 overflow-y-auto"
                variants={listVariants}
                initial="hidden"
                animate="show"
              >
                {MENU_ITEMS.map(({ href, label, icon: Icon }) => {
                  const active =
                    pathname === href || pathname.startsWith(`${href}/`);
                  const showBadge =
                    href === '/alumno/mensajes' && unreadCount > 0;
                  return (
                    <motion.div key={href} variants={itemVariants}>
                      <Link
                        href={href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          'flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-colors',
                          active
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted/50 text-foreground hover:bg-muted',
                        )}
                      >
                        <Icon className="size-5 shrink-0" aria-hidden />
                        <span className="flex-1">{label}</span>
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
                    </motion.div>
                  );
                })}
                {showInstallApp ? (
                  <motion.div variants={itemVariants}>
                    <button
                      type="button"
                      onClick={requestInstall}
                      className="flex min-h-12 w-full items-center gap-3 rounded-xl bg-muted/50 px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
                    >
                      <Download className="size-5 shrink-0" aria-hidden />
                      Instalar app
                    </button>
                  </motion.div>
                ) : null}
                <motion.div variants={itemVariants}>
                  <button
                    type="button"
                    onClick={requestLogout}
                    className="flex min-h-12 w-full items-center gap-3 rounded-xl border border-border px-4 py-3 text-base font-medium text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <LogOut className="size-5 shrink-0" aria-hidden />
                    Cerrar sesión
                  </button>
                </motion.div>
              </motion.nav>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>

      <AlumnoLogoutConfirmDialog
        open={logoutConfirmOpen}
        onOpenChange={setLogoutConfirmOpen}
      />
    </>
  );
}
