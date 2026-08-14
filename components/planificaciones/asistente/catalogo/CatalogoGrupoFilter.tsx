'use client';

import { GrupoCatalogoDef } from '@/lib/ejercicios/grupos-musculares';
import { CEMD } from '../constants';

interface Props {
  grupos: GrupoCatalogoDef[];
  grupoActivo: string | null;
  onChange: (grupoId: string | null) => void;
}

export function CatalogoGrupoFilter({
  grupos,
  grupoActivo,
  onChange,
}: Props) {
  if (grupos.length <= 1) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      <FilterChip
        active={grupoActivo === null}
        onClick={() => onChange(null)}
        label="Todos"
      />
      {grupos.map((g) => (
        <FilterChip
          key={g.id}
          active={grupoActivo === g.id}
          onClick={() => onChange(g.id)}
          label={g.label}
        />
      ))}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? `rounded-full border-2 border-primary bg-primary/15 px-2.5 py-0.5 text-xs font-semibold ${CEMD.primaryClass}`
          : 'rounded-full border border-input bg-card px-2.5 py-0.5 text-xs text-muted-foreground hover:border-primary/50'
      }
    >
      {label}
    </button>
  );
}
