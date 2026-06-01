'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { AlumnoLogoutButton } from '@/components/alumno/AlumnoLogoutButton';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { AlumnoFloatingMenu } from './AlumnoFloatingMenu';

const DESKTOP_NAV = [
  { href: '/alumno/mi-planificacion', label: 'Mi planificación' },
  { href: '/alumno/sesiones', label: 'Sesiones' },
  { href: '/alumno/metricas', label: 'Métricas' },
  { href: '/alumno/mis-datos', label: 'Mis datos' },
] as const;

export function AlumnoMobileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card lg:flex">
        <div className="border-b border-border px-5 py-6">
          <p className="text-lg font-semibold text-foreground">TuCoach</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Portal Alumno · Entrenamiento
          </p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {DESKTOP_NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="space-y-3 border-t border-border p-4">
          <ThemeToggle />
          <AlumnoLogoutButton />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-start justify-between gap-3 border-b border-border bg-card/95 px-4 py-3 backdrop-blur lg:hidden">
          <div>
            <p className="font-display text-xl tracking-wide text-foreground">TuCoach</p>
            <p className="text-xs text-muted-foreground">Portal Alumno</p>
          </div>
          <ThemeToggle variant="compact" />
        </header>
        <main className="mx-auto w-full max-w-lg flex-1 pb-28 lg:max-w-4xl lg:pb-8">
          {children}
        </main>
        <AlumnoFloatingMenu />
      </div>
    </div>
  );
}
