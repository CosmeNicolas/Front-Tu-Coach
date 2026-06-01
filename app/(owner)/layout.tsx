import { RoleGuard } from '@/components/layout/RoleGuard';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { OWNER_NAV } from '@/lib/layout/nav-config';
import { Role } from '@/types/auth';

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard expectedRole={Role.OWNER_GIMNASIO}>
      <DashboardShell
        title="TuCoach"
        subtitle="Dueño de Gimnasio"
        navItems={OWNER_NAV}
      >
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}
