'use client';

import { useAuth } from '@/hooks/useAuth';
import {
  formatGreeting,
  getFullName,
  getInitials,
} from '@/lib/auth/display-name';
import { cn } from '@/lib/utils/cn';

interface PortalGreetingProps {
  /** Contexto del rol, ej. "Tu entrenamiento" / "Panel profesor" */
  contextLabel?: string;
  showAvatar?: boolean;
  compact?: boolean;
  className?: string;
}

export function PortalGreeting({
  contextLabel,
  showAvatar = false,
  compact = false,
  className,
}: PortalGreetingProps) {
  const { data: user, isLoading } = useAuth();
  const greeting = formatGreeting(user);
  const fullName = getFullName(user);
  const initials = getInitials(user);

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
