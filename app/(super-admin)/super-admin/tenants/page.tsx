'use client';

import Link from 'next/link';
import { useTenants } from '@/hooks/useGymAdmin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SuperAdminTenantsPage() {
  const { data: tenants, isLoading, error } = useTenants();

  if (isLoading) {
    return (
      <p className="p-8 text-sm text-muted-foreground">Cargando gimnasios…</p>
    );
  }

  if (error) {
    return (
      <p className="p-8 text-sm text-destructive">
        No se pudieron cargar los gimnasios.
      </p>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-8">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Gimnasios</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Elegí un gimnasio para ver profesores y alumnos
        </p>
      </header>

      {!tenants?.length ? (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No hay gimnasios registrados. Creá uno con el seed de desarrollo.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tenants.map((t) => (
            <Link
              key={t.id}
              href={`/super-admin/tenants/${t.id}`}
              className="block transition hover:opacity-90"
            >
              <Card className="h-full border-border bg-card shadow-sm hover:border-primary/40">
                <CardHeader>
                  <CardTitle className="text-lg">{t.nombre}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">/{t.slug}</p>
                  <p className="mt-2 text-xs capitalize text-foreground">
                    Estado: {t.estado}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
