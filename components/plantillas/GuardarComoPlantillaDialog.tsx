'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api/client';
import { useSaveAsTemplate } from '@/hooks/usePlanificationTemplates';
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

interface Props {
  planificationId: string;
  defaultName?: string;
}

export function GuardarComoPlantillaDialog({
  planificationId,
  defaultName = '',
}: Props) {
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState(defaultName);
  const save = useSaveAsTemplate();

  async function handleSave() {
    const trimmed = nombre.trim();
    if (!trimmed) {
      toast.error('Ingresá un nombre para la plantilla');
      return;
    }
    try {
      await save.mutateAsync({ planificationId, nombrePlantilla: trimmed });
      toast.success('Plantilla guardada', {
        description: `"${trimmed}" ya está disponible en Plantillas.`,
      });
      setOpen(false);
    } catch (err) {
      toast.error('No se pudo guardar la plantilla', {
        description:
          err instanceof ApiError ? err.message : 'Intentá de nuevo.',
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" type="button">
          Guardar como plantilla
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Guardar como plantilla</DialogTitle>
          <DialogDescription>
            Se copiarán las secciones y la configuración actuales. Podrás reutilizarla
            con otros alumnos.
          </DialogDescription>
        </DialogHeader>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Nombre de la plantilla
          </span>
          <Input
            className="mt-1"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Fuerza 12 semanas"
            maxLength={120}
          />
        </label>
        <DialogFooter className="gap-2">
          <Button variant="outline" type="button" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            type="button"
            disabled={save.isPending}
            onClick={() => void handleSave()}
          >
            {save.isPending ? 'Guardando…' : 'Guardar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
