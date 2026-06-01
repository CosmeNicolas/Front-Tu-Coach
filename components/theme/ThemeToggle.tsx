'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/providers/theme-provider';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  /** Compacto: solo ícono + switch (header móvil) */
  variant?: 'default' | 'compact';
  className?: string;
}

export function ThemeToggle({ variant = 'default', className }: ThemeToggleProps) {
  const { theme, setTheme, mounted } = useTheme();
  const isDark = theme === 'dark';

  if (!mounted) {
    return (
      <div
        className={cn(
          'animate-pulse rounded-lg bg-muted',
          variant === 'compact' ? 'h-6 w-11' : 'h-9 w-full',
          className,
        )}
        aria-hidden
      />
    );
  }

  if (variant === 'compact') {
    return (
      <div
        className={cn('flex items-center gap-2', className)}
        title={isDark ? 'Tema oscuro' : 'Tema claro'}
      >
        {isDark ? (
          <Moon className="size-4 text-muted-foreground" aria-hidden />
        ) : (
          <Sun className="size-4 text-muted-foreground" aria-hidden />
        )}
        <Switch
          checked={isDark}
          onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
          aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex w-full items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2',
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        {isDark ? (
          <Moon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        ) : (
          <Sun className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        )}
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">Tema oscuro</p>
          <p className="text-xs text-muted-foreground">
            {isDark ? 'Activado' : 'Desactivado'}
          </p>
        </div>
      </div>
      <Switch
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
        aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      />
    </div>
  );
}
