'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  catalogoKey,
  EjercicioCatalogo,
  filtrarCatalogo,
} from '@/lib/ejercicios/catalogo';
import { gruposParaTab } from '@/lib/ejercicios/grupos-musculares';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { EjercicioCatalogoCard } from './catalogo/EjercicioCatalogoCard';
import { CatalogoGrupoFilter } from './catalogo/CatalogoGrupoFilter';
import { CEMD } from './constants';

interface Props {
  tabId: string;
  onSeleccionar: (ejercicio: EjercicioCatalogo) => void;
}

export function BuscadorEjercicio({ tabId, onSeleccionar }: Props) {
  const [busqueda, setBusqueda] = useState('');
  const [debounced, setDebounced] = useState('');
  const [grupoActivo, setGrupoActivo] = useState<string | null>(null);

  const gruposTab = useMemo(() => gruposParaTab(tabId), [tabId]);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(busqueda), 150);
    return () => clearTimeout(t);
  }, [busqueda]);

  useEffect(() => {
    setGrupoActivo(null);
    setBusqueda('');
    setDebounced('');
  }, [tabId]);

  const resultados = useMemo(
    () =>
      filtrarCatalogo({
        tabId,
        query: debounced,
        grupoId: grupoActivo,
        limit: debounced ? 60 : 48,
      }),
    [tabId, debounced, grupoActivo],
  );

  const tituloLista = debounced
    ? `${resultados.length} resultados`
    : grupoActivo
      ? `${resultados.length} ejercicios del grupo`
      : `${resultados.length} sugeridos para esta sección`;

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="buscar-ej" className={CEMD.primaryClass}>
          🔍 Buscar ejercicio
        </Label>
        <div className="mt-1.5 flex gap-2">
          <Input
            id="buscar-ej"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Ej: sentadilla, press banca, plancha…"
          />
          {busqueda ? (
            <Button type="button" variant="outline" onClick={() => setBusqueda('')}>
              Limpiar
            </Button>
          ) : null}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{tituloLista}</p>
      </div>

      <CatalogoGrupoFilter
        grupos={gruposTab}
        grupoActivo={grupoActivo}
        onChange={setGrupoActivo}
      />

      {resultados.length === 0 ? (
        <p className="rounded-lg border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500">
          {debounced
            ? 'No se encontraron ejercicios para esa búsqueda.'
            : 'No hay ejercicios en este filtro.'}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {resultados.map((ej, i) => (
            <EjercicioCatalogoCard
              key={catalogoKey(ej)}
              ejercicio={ej}
              onSeleccionar={onSeleccionar}
              eagerImage={i < 12}
            />
          ))}
        </div>
      )}

      <p className="text-[10px] text-zinc-400">
        GIFs desde <code className="rounded bg-zinc-100 px-1">/public/gif</code>{' '}
        cuando estén disponibles · fallback automático si falta el asset
      </p>
    </div>
  );
}
