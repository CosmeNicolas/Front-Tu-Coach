'use client';

import { Toaster } from 'sonner';
import { QueryProvider } from '@/lib/providers/query-provider';
import { ThemeProvider } from '@/lib/providers/theme-provider';

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * Providers globales de la app.
 * ThemeProvider: tema claro/oscuro global (localStorage).
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <QueryProvider>
        {children}
        <Toaster
        richColors
        position="top-center"
        closeButton
        toastOptions={{
          classNames: {
            toast: 'border-border bg-card text-foreground shadow-lg',
          },
        }}
        />
      </QueryProvider>
    </ThemeProvider>
  );
}
