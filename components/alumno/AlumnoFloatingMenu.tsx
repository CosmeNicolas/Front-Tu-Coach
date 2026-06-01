'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  CalendarDays,
  ClipboardList,
  LogOut,
  Menu,
  UserCircle,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlumnoLogoutConfirmDialog } from './AlumnoLogoutConfirmDialog';
import { cn } from '@/lib/utils/cn';

const MENU_ITEMS = [
  { href: '/alumno/mi-planificacion', label: 'Mi planificación', icon: ClipboardList },
  { href: '/alumno/sesiones', label: 'Sesiones', icon: CalendarDays },
  { href: '/alumno/metricas', label: 'Métricas', icon: BarChart3 },
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

export function AlumnoFloatingMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  function requestLogout() {
    setOpen(false);
    setLogoutConfirmOpen(true);
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
        aria-label="Abrir menú de navegación"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={cn(
          'fixed bottom-5 right-4 z-40 size-14 rounded-full shadow-lg lg:hidden',
          'bg-primary text-primary-foreground hover:bg-primary/90',
        )}
      >
        <Menu className="size-6" aria-hidden />
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
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h2
                    id="alumno-menu-title"
                    className="text-lg font-semibold text-foreground"
                  >
                    Menú rápido
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Navegá por tu portal de entrenamiento
                  </p>
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
                        {label}
                      </Link>
                    </motion.div>
                  );
                })}
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
