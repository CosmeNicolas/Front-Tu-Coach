import { RoleGuard } from '@/components/layout/RoleGuard';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { NotificationsBell } from '@/components/profesor/NotificationsBell';
import { SUPER_ADMIN_NAV } from '@/lib/layout/nav-config';
import { Role } from '@/types/auth';

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard expectedRole={Role.SUPER_ADMIN}>
      <DashboardShell
        title="TuCoach"
        subtitle="Super Admin"
        navItems={SUPER_ADMIN_NAV}
        headerActions={<NotificationsBell />}
      >
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}
