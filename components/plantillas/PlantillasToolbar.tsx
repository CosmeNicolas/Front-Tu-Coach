'use client';

import {
  TEMPLATE_CATEGORY_LABELS,
  TemplateCategory,
} from '@/lib/plantillas/template-categories';
import { NuevaPlantillaDialog } from './NuevaPlantillaDialog';
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
  return (
    <div className="flex flex-col gap-4">
      <NuevaPlantillaDialog />

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
