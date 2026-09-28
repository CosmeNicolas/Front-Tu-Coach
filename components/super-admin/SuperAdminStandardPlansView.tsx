'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Archive, ArchiveRestore, CheckCircle2, Pencil, Plus, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api/client';
import {
  useAdminStandardPlans,
  useArchiveStandardPlan,
  usePublishStandardPlan,
  useSeedFullbodyBeginner,
  useUnarchiveStandardPlan,
} from '@/hooks/useStandardPlans';
import { StandardPlanFormDialog } from '@/components/super-admin/StandardPlanFormDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  STANDARD_PLAN_LEVEL_LABELS,
  STANDARD_PLAN_STATUS_LABELS,
  StandardPlanTemplateStatus,
  type StandardPlanTemplate,
} from '@/types/standard-plan';

function formatArs(value: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value);
}

function statusVariant(
  status: StandardPlanTemplateStatus,
): 'default' | 'secondary' | 'outline' {
  if (status === StandardPlanTemplateStatus.PUBLISHED) return 'default';
  if (status === StandardPlanTemplateStatus.ARCHIVED) return 'outline';
  return 'secondary';
}

export function SuperAdminStandardPlansView() {
  const { data, isLoading, error } = useAdminStandardPlans();
  const seed = useSeedFullbodyBeginner();
  const publish = usePublishStandardPlan();
  const archive = useArchiveStandardPlan();
  const unarchive = useUnarchiveStandardPlan();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<StandardPlanTemplate | null>(null);

  const items = data?.items ?? [];

  async function handleSeed() {
    try {
      const res = await seed.mutateAsync(undefined);
      toast.success(
        res.created
          ? 'Plan Full body importado como borrador'
          : 'Ya existía el plan Full body',
      );
    } catch (err) {
      toast.error('No se pudo importar', {
        description: err instanceof ApiError ? err.message : undefined,
      });
    }
  }

  async function handlePublish(id: string) {
    try {
      await publish.mutateAsync(id);
      toast.success('Plan publicado');
    } catch (err) {
      toast.error('No se pudo publicar', {
        description: err instanceof ApiError ? err.message : undefined,
      });
    }
  }

  async function handleArchive(id: string) {
    try {
      await archive.mutateAsync(id);
      toast.success('Plan archivado');
    } catch (err) {
      toast.error('No se pudo archivar', {
        description: err instanceof ApiError ? err.message : undefined,
      });
    }
  }

  async function handleUnarchive(id: string) {
    try {
      await unarchive.mutateAsync(id);
      toast.success('Plan desarchivado (borrador)');
    } catch (err) {
      toast.error('No se pudo desarchivar', {
        description: err instanceof ApiError ? err.message : undefined,
      });
    }
  }

  return (
    <div className="space-y-6 p-4 sm:p-8">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl tracking-wide text-foreground">
            Planes estándar
          </h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Planes comerciales de TuCoach (sin kilos prescritos). Requiere
            FEATURE_STANDARD_PLANS=true.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={handleSeed}
            disabled={seed.isPending}
          >
            <Sparkles className="mr-2 size-4" />
            Importar Full body
          </Button>
          <Button
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            <Plus className="mr-2 size-4" />
            Nuevo plan
          </Button>
        </div>
      </header>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Cargando…</p>
      ) : error ? (
        <p className="text-sm text-destructive">
          {error instanceof ApiError && error.status === 404
            ? 'Feature desactivada. Activá FEATURE_STANDARD_PLANS=true en el backend.'
            : 'No se pudieron cargar los planes.'}
        </p>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Todavía no hay planes. Importá Full body o creá uno vacío.
        </p>
      ) : (
        <ul className="divide-y rounded-xl border border-border">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
            >
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-foreground">{item.nombre}</p>
                  <Badge variant={statusVariant(item.status)}>
                    {STANDARD_PLAN_STATUS_LABELS[item.status]}
                  </Badge>
                  <Badge variant="outline">
                    {STANDARD_PLAN_LEVEL_LABELS[item.nivel]}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  /{item.slug} · {formatArs(item.precioArs)} · v
                  {item.contentVersion} · {item.config.totalSesiones} sesiones
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/super-admin/planes-estandar/${item.id}/asistente`}>
                    Asistente
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditing(item);
                    setFormOpen(true);
                  }}
                >
                  <Pencil className="mr-1 size-3.5" />
                  Editar
                </Button>
                {item.status !== StandardPlanTemplateStatus.PUBLISHED &&
                item.status !== StandardPlanTemplateStatus.ARCHIVED ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePublish(item.id)}
                    disabled={publish.isPending}
                  >
                    <CheckCircle2 className="mr-1 size-3.5" />
                    Publicar
                  </Button>
                ) : null}
                {item.status === StandardPlanTemplateStatus.ARCHIVED ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUnarchive(item.id)}
                    disabled={unarchive.isPending}
                  >
                    <ArchiveRestore className="mr-1 size-3.5" />
                    Desarchivar
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleArchive(item.id)}
                    disabled={archive.isPending}
                  >
                    <Archive className="mr-1 size-3.5" />
                    Archivar
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <StandardPlanFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editing={editing}
      />
    </div>
  );
}
