'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api/client';
import {
  TEMPLATE_CATEGORY_LABELS,
  TemplateCategory,
} from '@/lib/plantillas/template-categories';
import { useSeedTemplatePresets } from '@/hooks/usePlanificationTemplates';
import { NuevaPlantillaDialog } from './NuevaPlantillaDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Props {
  search: string;
  categoria: TemplateCategory | '';
  onSearchChange: (value: string) => void;
  onCategoriaChange: (value: TemplateCategory | '') => void;
}

export function PlantillasToolbar({
  search,
  categoria,
  onSearchChange,
  onCategoriaChange,
}: Props) {
  const seed = useSeedTemplatePresets();
  const [seeding, setSeeding] = useState(false);

  async function handleSeedPresets() {
    setSeeding(true);
    try {
      const result = await seed.mutateAsync();
      toast.success('Biblioteca importada', {
        description: `${result.created} nuevas, ${result.skipped} ya existían.`,
      });
    } catch (err) {
      toast.error('No se pudo importar la biblioteca', {
        description: err instanceof ApiError ? err.message : undefined,
      });
    } finally {
      setSeeding(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <NuevaPlantillaDialog />
        <Button
          type="button"
          variant="outline"
          disabled={seeding || seed.isPending}
          onClick={() => void handleSeedPresets()}
        >
          {seeding || seed.isPending
            ? 'Importando…'
            : 'Importar biblioteca base'}
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          className="w-full sm:max-w-xs"
          placeholder="Buscar plantilla…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <select
          className="rounded-lg border border-input bg-card px-3 py-2 text-sm"
          value={categoria}
          onChange={(e) =>
            onCategoriaChange(
              (e.target.value || '') as TemplateCategory | '',
            )
          }
        >
          <option value="">Todas las categorías</option>
          {Object.values(TemplateCategory).map((cat) => (
            <option key={cat} value={cat}>
              {TEMPLATE_CATEGORY_LABELS[cat]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
