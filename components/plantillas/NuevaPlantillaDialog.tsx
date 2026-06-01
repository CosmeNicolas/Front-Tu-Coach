'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api/client';
import {
  getDefaultConfigForCategory,
  TEMPLATE_CATEGORY_HINTS,
  TEMPLATE_CATEGORY_LABELS,
  TemplateCategory,
} from '@/lib/plantillas/template-categories';
import { useCreateTemplate } from '@/hooks/usePlanificationTemplates';
import { PlanificacionConfigFields } from '@/components/planificaciones/PlanificacionConfigFields';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PlanificationConfig } from '@/types/planification';

interface Props {
  trigger?: React.ReactNode;
}

export function NuevaPlantillaDialog({ trigger }: Props) {
  const router = useRouter();
  const create = useCreateTemplate();
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState<TemplateCategory>(
    TemplateCategory.GENERAL,
  );
  const [config, setConfig] = useState<PlanificationConfig>(
    getDefaultConfigForCategory(TemplateCategory.GENERAL),
  );

  useEffect(() => {
    if (!open) return;
    setConfig(getDefaultConfigForCategory(categoria));
  }, [categoria, open]);

  async function handleCreate() {
    const trimmed = nombre.trim();
    if (!trimmed) {
      toast.error('Ingresá un nombre para la plantilla');
      return;
    }
    try {
      const template = await create.mutateAsync({
        nombrePlantilla: trimmed,
        categoriaPlantilla: categoria,
        descripcionPlantilla: descripcion.trim() || undefined,
        config,
      });
      toast.success('Plantilla creada', {
        description: 'Completá los ejercicios en el asistente.',
      });
      setOpen(false);
      router.push(`/profesor/planificaciones/${template.id}/asistente`);
    } catch (err) {
      toast.error('No se pudo crear la plantilla', {
        description: err instanceof ApiError ? err.message : undefined,
      });
    }
  }

  const hint = TEMPLATE_CATEGORY_HINTS[categoria];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button type="button">Nueva plantilla</Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva plantilla</DialogTitle>
          <DialogDescription>
            Definí el caso o patología. Después cargá ejercicios en el asistente y
            asignala a tus alumnos.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Caso / patología *
            </span>
            <select
              className="mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm"
              value={categoria}
              onChange={(e) =>
                setCategoria(e.target.value as TemplateCategory)
              }
            >
              {Object.values(TemplateCategory).map((cat) => (
                <option key={cat} value={cat}>
                  {TEMPLATE_CATEGORY_LABELS[cat]}
                </option>
              ))}
            </select>
            {hint ? (
              <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
            ) : null}
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Nombre de la plantilla *
            </span>
            <Input
              className="mt-1"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Lumbar — fase 1"
              maxLength={120}
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Notas (opcional)
            </span>
            <textarea
              className="mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm"
              rows={2}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Indicaciones para vos o el equipo…"
              maxLength={500}
            />
          </label>

          <div className="rounded-lg border border-border p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Configuración del plan
            </p>
            <PlanificacionConfigFields value={config} onChange={setConfig} />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" type="button" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            type="button"
            disabled={create.isPending}
            onClick={() => void handleCreate()}
          >
            {create.isPending ? 'Creando…' : 'Crear y abrir asistente'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
