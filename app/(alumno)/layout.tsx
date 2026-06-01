import { RoleGuard } from '@/components/layout/RoleGuard';
import { AlumnoMobileLayout } from '@/components/alumno/AlumnoMobileLayout';
import { Role } from '@/types/auth';

export default function AlumnoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard expectedRole={Role.ALUMNO}>
      <AlumnoMobileLayout>{children}</AlumnoMobileLayout>
    </RoleGuard>
  );
}
