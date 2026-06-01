import { RoleGuard } from '@/components/layout/RoleGuard';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PROFESOR_NAV } from '@/lib/layout/nav-config';
import { Role } from '@/types/auth';

export default function ProfesorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard expectedRole={Role.PROFESOR}>
      <DashboardShell
        title="TuCoach"
        subtitle="Profesor"
        navItems={PROFESOR_NAV}
      >
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}
