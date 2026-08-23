import { RoleGuard } from '@/components/layout/RoleGuard';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PushNotificationsBootstrap } from '@/components/notifications/PushNotificationsBootstrap';
import { NotificationsBell } from '@/components/profesor/NotificationsBell';
import { ProductTourShell } from '@/components/onboarding/ProductTourShell';
import { TourHelpButton } from '@/components/onboarding/TourHelpButton';
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
      <ProductTourShell>
        <DashboardShell
          title="TuCoach"
          roleContext="Panel profesor"
          navItems={PROFESOR_NAV}
          headerActions={
            <>
              <TourHelpButton />
              <NotificationsBell />
            </>
          }
        >
          {children}
        </DashboardShell>
      </ProductTourShell>
    </RoleGuard>
  );
}
