'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { useTenants } from '@/hooks/useGymAdmin';
import { useAdminProfesores } from '@/hooks/useAdminProfesores';
import { UserStatus } from '@/types/auth';
import { NuevoProfesorDialog } from '@/components/super-admin/NuevoProfesorDialog';
import { EditarProfesorDialog } from '@/components/super-admin/EditarProfesorDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

function ProfesorEstadoBadge({ estado }: { estado: UserStatus }) {
  const labels: Record<UserStatus, string> = {
    [UserStatus.ACTIVE]: 'Activo',
    [UserStatus.BLOCKED]: 'Bloqueado',
    [UserStatus.PENDING]: 'Pendiente',
  };
  const variant =
    estado === UserStatus.ACTIVE
      ? 'default'
      : estado === UserStatus.BLOCKED
        ? 'secondary'
        : 'outline';

  return <Badge variant={variant}>{labels[estado]}</Badge>;
}

export default function SuperAdminProfesoresPage() {
  const [search, setSearch] = useState('');
  const [tenantFilter, setTenantFilter] = useState('');
  const { data: tenants } = useTenants();
  const queryParams = useMemo(
    () => ({
      search: search.trim() || undefined,
      tenantId: tenantFilter || undefined,
      limit: 200,
    }),
    [search, tenantFilter],
  );
  const { data, isLoading, error } = useAdminProfesores(queryParams);

  return (
    <div className="space-y-6 p-4 sm:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profesores</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Listado global · {data?.total ?? 0} profesores
          </p>
        </div>
        <NuevoProfesorDialog defaultTenantId={tenantFilter || undefined} />
      </header>

      <Card className="border-border bg-card shadow-sm">
        <CardContent className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2 sm:col-span-2 lg:col-span-1">
            <Label htmlFor="prof-search">Buscar</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="prof-search"
                className="pl-9"
                placeholder="Nombre, apellido o email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="prof-gym-filter">Gimnasio</Label>
            <select
              id="prof-gym-filter"
              className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm"
              value={tenantFilter}
              onChange={(e) => setTenantFilter(e.target.value)}
            >
              <option value="">Todos</option>
              {tenants?.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Cargando profesores…</p>
      ) : error ? (
        <p className="text-sm text-destructive">No se pudieron cargar los profesores.</p>
      ) : !data?.items.length ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center">
          <p className="text-sm text-muted-foreground">
            No hay profesores con esos filtros.
          </p>
          <div className="mt-4 flex justify-center">
            <NuevoProfesorDialog defaultTenantId={tenantFilter || undefined} />
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3 font-semibold">Profesor</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Gimnasio</th>
                  <th className="px-4 py-3 font-semibold">Estado</th>
                  <th className="px-4 py-3 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-border last:border-0 hover:bg-muted/20"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {p.apellido}, {p.nombre}
                      {p.telefono ? (
                        <p className="text-xs font-normal text-muted-foreground">
                          {p.telefono}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{p.email}</td>
                    <td className="px-4 py-3">
                      {p.tenantNombre ? (
                        <Link
                          href={`/super-admin/tenants/${p.tenantId}`}
                          className="text-foreground underline-offset-2 hover:underline"
                        >
                          {p.tenantNombre}
                        </Link>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <ProfesorEstadoBadge estado={p.estado} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <EditarProfesorDialog profesor={p} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
