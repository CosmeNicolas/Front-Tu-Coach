'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchCurrentUser } from '@/lib/api/client';
import { getDashboardPath, isRoleAllowedForPath } from '@/lib/auth/roles';
import { hydrateTokenStore, getAccessToken } from '@/lib/auth/token-store';
import { Role } from '@/types/auth';

interface RoleGuardProps {
  expectedRole: Role;
  children: React.ReactNode;
}

export function RoleGuard({ expectedRole, children }: RoleGuardProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    hydrateTokenStore();

    const token = getAccessToken();
    if (!token) {
      router.replace('/login');
      return;
    }

    fetchCurrentUser()
      .then((user) => {
        if (user.role !== expectedRole) {
          router.replace(getDashboardPath(user.role));
          return;
        }

        const path = window.location.pathname;
        if (!isRoleAllowedForPath(user.role, path)) {
          router.replace(getDashboardPath(user.role));
          return;
        }

        setAuthorized(true);
      })
      .catch(() => {
        router.replace('/login');
      });
  }, [expectedRole, router]);

  if (!authorized) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="text-sm text-zinc-500">Verificando sesión…</p>
      </div>
    );
  }

  return <>{children}</>;
}
