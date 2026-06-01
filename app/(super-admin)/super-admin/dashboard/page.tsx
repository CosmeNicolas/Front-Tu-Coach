'use client';

import Link from 'next/link';
import { useTenants } from '@/hooks/useGymAdmin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SuperAdminDashboardPage() {
  const { data: tenants, isLoading } = useTenants();

  return (
    <div className="space-y-6 p-4 sm:p-8">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Dashboard Super Admin</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Administración global de TuCoach
        </p>
      </header>

      <Card className="border-primary/30 bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Gimnasios en la plataforma</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Como super admin, entrá a cada gimnasio para ver qué profesores usan
            el servicio y cuántos alumnos tiene cada uno.
          </p>
          <Link
            href="/super-admin/tenants"
            className="inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Ver gimnasios
            {isLoading ? '' : ` (${tenants?.length ?? 0})`}
          </Link>
        </CardContent>
      </Card>

      {tenants && tenants.length > 0 ? (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Acceso rápido
          </h2>
          <div className="flex flex-wrap gap-2">
            {tenants.map((t) => (
              <Link
                key={t.id}
                href={`/super-admin/tenants/${t.id}`}
                className="rounded-full border border-border bg-muted/50 px-3 py-1.5 text-sm font-medium text-foreground hover:border-primary hover:bg-accent/30"
              >
                {t.nombre}
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
