'use client';

import { useAuth } from '@/hooks/useAuth';
import { useMiPerfil } from '@/hooks/useStudentPortal';
import {
  formatGreeting,
  getFirstName,
  getFullName,
  getInitials,
} from '@/lib/auth/display-name';
import { cn } from '@/lib/utils/cn';

interface AlumnoPortalGreetingProps {
  contextLabel?: string;
  showAvatar?: boolean;
  compact?: boolean;
  className?: string;
}

export function AlumnoPortalGreeting({
  contextLabel = 'Portal alumno',
  showAvatar = false,
  compact = false,
  className,
}: AlumnoPortalGreetingProps) {
  const { data: user, isLoading: authLoading } = useAuth();
  const { data: perfil, isLoading: perfilLoading } = useMiPerfil();

  const isLoading = authLoading || (perfilLoading && !perfil && !user);

  // Preferir ficha del alumno (client) sobre profile de auth
  const nombreFromPerfil = perfil?.nombre?.trim() ?? '';
  const apellidoFromPerfil = perfil?.apellido?.trim() ?? '';
  const firstName =
    nombreFromPerfil || getFirstName(user) || perfil?.email?.split('@')[0] || '';
  const fullName =
    [nombreFromPerfil, apellidoFromPerfil].filter(Boolean).join(' ') ||
    getFullName(user);
  const initials = (() => {
    if (nombreFromPerfil && apellidoFromPerfil) {
      return `${nombreFromPerfil[0]}${apellidoFromPerfil[0]}`.toUpperCase();
    }
    if (nombreFromPerfil) return nombreFromPerfil.slice(0, 2).toUpperCase();
    return getInitials(user);
  })();

  const greeting = firstName ? `Hola, ${firstName}` : formatGreeting(user);

  return (
    <div className={cn('flex min-w-0 items-center gap-3', className)}>
      {showAvatar ? (
        <div
          className={cn(
            'flex shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground',
            compact ? 'size-9 text-xs' : 'size-11 text-sm',
          )}
          aria-hidden
          title={fullName || undefined}
        >
          {isLoading ? '…' : initials}
        </div>
      ) : null}

      <div className="min-w-0">
        <p
          className={cn(
            'truncate font-medium text-foreground',
            compact ? 'text-sm' : 'text-base',
          )}
        >
          {isLoading ? 'Hola…' : greeting}
        </p>
        {contextLabel ? (
          <p
            className={cn(
              'truncate text-muted-foreground',
              compact ? 'text-[11px]' : 'text-xs',
            )}
          >
            {contextLabel}
          </p>
        ) : null}
      </div>
    </div>
  );
}
