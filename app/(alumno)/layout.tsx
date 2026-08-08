import { RoleGuard } from '@/components/layout/RoleGuard';
import { AlumnoMobileLayout } from '@/components/alumno/AlumnoMobileLayout';
import { PushNotificationsBootstrap } from '@/components/notifications/PushNotificationsBootstrap';
import { Role } from '@/types/auth';

export default function AlumnoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard expectedRole={Role.ALUMNO}>
      <PushNotificationsBootstrap />
      <AlumnoMobileLayout>{children}</AlumnoMobileLayout>
    </RoleGuard>
  );
}
