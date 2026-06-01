'use client';

import { useRouter } from 'next/navigation';
import { logoutClient } from '@/lib/api/auth';
import { cn } from '@/lib/utils/cn';

interface Props {
  variant?: 'default' | 'sidebar';
}

export function LogoutButton({ variant = 'default' }: Props) {
  const router = useRouter();

  function handleLogout() {
    logoutClient();
    router.replace('/login');
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={cn(
        'w-full rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
        variant === 'sidebar'
          ? 'border-border text-muted-foreground hover:bg-muted hover:text-foreground'
          : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground',
      )}
    >
      Cerrar sesión
    </button>
  );
}
