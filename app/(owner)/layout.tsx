import { PRIVATE_ROBOTS } from '@/lib/seo/site';
import { RoleGuard } from '@/components/layout/RoleGuard';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { OWNER_NAV } from '@/lib/layout/nav-config';
import { Role } from '@/types/auth';

export const metadata = PRIVATE_ROBOTS;

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard expectedRole={Role.OWNER_GIMNASIO}>
      <DashboardShell
        title="TuCoach"
        roleContext="Dueño del gimnasio"
        navItems={OWNER_NAV}
      >
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}
