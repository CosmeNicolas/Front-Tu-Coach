'use client';

import { useState } from 'react';
import { usePrivateExercises } from '@/hooks/usePrivateExercises';
import { useTenants } from '@/hooks/useGymAdmin';
import { EjercicioCatalogoImage } from '@/components/ejercicios/EjercicioCatalogoImage';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  /** Si se pasa, fija el filtro al gimnasio (vista desde detalle de tenant). */
  tenantId?: string;
}

export function SuperAdminPrivateExercisesView({ tenantId: fixedTenantId }: Props) {
  const [search, setSearch] = useState('');
  const [tenantFilter, setTenantFilter] = useState(fixedTenantId ?? '');

  const { data: tenantsData } = useTenants();
  const effectiveTenantId = fixedTenantId ?? (tenantFilter || undefined);

  const { data, isLoading, error } = usePrivateExercises({
    search,
    tenantId: effectiveTenantId,
    limit: 200,
  });

  const items = data?.items ?? [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <div className="min-w-[200px] flex-1 space-y-2">
          <Label htmlFor="sa-ej-search">Buscar</Label>
          <Input
            id="sa-ej-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nombre, categoría…"
          />
        </div>
        {!fixedTenantId ? (
          <div className="min-w-[200px] space-y-2">
            <Label htmlFor="sa-ej-tenant">Gimnasio</Label>
            <select
              id="sa-ej-tenant"
              className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm"
              value={tenantFilter || '__all__'}
              onChange={(e) => {
                const v = e.target.value;
                setTenantFilter(v === '__all__' ? '' : v);
              }}
            >
              <option value="__all__">Todos los gimnasios</option>
              {(tenantsData ?? []).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Cargando ejercicios…</p>
      ) : error ? (
        <p className="text-sm text-destructive">
          No se pudieron cargar los ejercicios privados.
        </p>
      ) : items.length === 0 ? (
        <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          No hay ejercicios privados con esos filtros.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/40 text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Media</th>
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Categoría</th>
                <th className="px-4 py-3 font-medium">Gimnasio</th>
                <th className="px-4 py-3 font-medium">Profesor</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-border">
                  <td className="px-4 py-2">
                    <div className="w-16">
                      <EjercicioCatalogoImage
                        src={item.mediaUrl}
                        alt={item.nombre}
                        containerClassName="h-14"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-2 font-medium">{item.nombre}</td>
                  <td className="px-4 py-2 text-muted-foreground">
                    {item.categoria}
                  </td>
                  <td className="px-4 py-2">{item.tenantNombre ?? item.tenantId}</td>
                  <td className="px-4 py-2">
                    {item.profesorNombre ?? item.profesorId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
