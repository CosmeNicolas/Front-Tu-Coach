'use client';

import { useMemo, useState } from 'react';
import { Library } from 'lucide-react';
import {
  catalogoBaseTotal,
  listarCatalogoBase,
  nombreVisible,
} from '@/lib/ejercicios/catalogo';
import {
  CATALOGO_DEPORTES,
  CATALOGO_GRUPOS,
  findCatalogoCategoriaByNorm,
} from '@/lib/ejercicios/grupos-musculares';
import { EjercicioMediaPreview } from '@/components/ejercicios/EjercicioMediaPreview';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PAGE_SIZE = 72;

export function SuperAdminBaseCatalogPanel() {
  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState('');

  const totalBase = catalogoBaseTotal();

  const items = useMemo(
    () =>
      listarCatalogoBase({
        search,
        categoriaNorm: categoria || undefined,
        limit: PAGE_SIZE,
      }),
    [search, categoria],
  );

  const showingAll = !search.trim() && !categoria;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Library className="size-5 text-primary" />
        <div>
          <h2 className="font-display text-lg tracking-wide">Catálogo base</h2>
          <p className="text-sm text-muted-foreground">
            {totalBase} ejercicios incluidos en la app. Los profesores los ven en el
            asistente de planificación junto con tus globales y sus propios.
          </p>
        </div>
        <Badge variant="secondary" className="ml-auto">
          {totalBase} en total
        </Badge>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="min-w-[200px] flex-1 space-y-2">
          <Label htmlFor="sa-base-search">Buscar</Label>
          <Input
            id="sa-base-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nombre, grupo, descripción…"
          />
        </div>
        <div className="min-w-[200px] space-y-2">
          <Label htmlFor="sa-base-categoria">Categoría</Label>
          <select
            id="sa-base-categoria"
            className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm"
            value={categoria || '__all__'}
            onChange={(e) => {
              const v = e.target.value;
              setCategoria(v === '__all__' ? '' : v);
            }}
          >
            <option value="__all__">Todas las categorías</option>
            <optgroup label="Grupos musculares">
              {CATALOGO_GRUPOS.map((g) => (
                <option key={g.id} value={g.norm}>
                  {g.label}
                </option>
              ))}
            </optgroup>
            <optgroup label="Deportes">
              {CATALOGO_DEPORTES.map((d) => (
                <option key={d.id} value={d.norm}>
                  {d.label}
                </option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          No hay ejercicios con esos filtros en el catálogo base.
        </p>
      ) : (
        <>
          <p className="text-xs text-muted-foreground">
            Mostrando {items.length}
            {showingAll ? ` de ${totalBase}` : ''} · solo lectura
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => {
              const nombre = nombreVisible(item);
              const key = `${item.grupo}::${item.nombre}::${item.gif}`;
              return (
                <Card key={key}>
                  <CardContent className="flex flex-col gap-2 p-3">
                    <EjercicioMediaPreview
                      src={item.gif}
                      alt={nombre}
                      containerClassName="h-28 w-full"
                      eager={false}
                    />
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-sm font-semibold">{nombre}</p>
                      <p className="text-xs text-muted-foreground">
                        {findCatalogoCategoriaByNorm(item.grupo)?.label ??
                          item.grupo}
                      </p>
                      <Badge variant="outline" className="mt-1 text-[10px]">
                        Base
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          {items.length >= PAGE_SIZE ? (
            <p className="text-center text-xs text-muted-foreground">
              Usá la búsqueda o el filtro de categoría para acotar resultados (máx.{' '}
              {PAGE_SIZE} por vista).
            </p>
          ) : null}
        </>
      )}
    </section>
  );
}
