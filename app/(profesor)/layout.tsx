import { RoleGuard } from '@/components/layout/RoleGuard';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PushNotificationsBootstrap } from '@/components/notifications/PushNotificationsBootstrap';
import { NotificationsBell } from '@/components/profesor/NotificationsBell';
import { PROFESOR_NAV } from '@/lib/layout/nav-config';
import { Role } from '@/types/auth';

export default function ProfesorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard expectedRole={Role.PROFESOR}>
      <PushNotificationsBootstrap />
      <DashboardShell
        title="TuCoach"
        roleContext="Panel profesor"
        navItems={PROFESOR_NAV}
        headerActions={<NotificationsBell />}
      >
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}
