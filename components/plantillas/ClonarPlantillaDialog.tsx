'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api/client';
import { useCloneTemplate } from '@/hooks/usePlanificationTemplates';
import { useClients } from '@/hooks/useClients';
import { Planification, PROGRESSION_MODE_LABELS } from '@/types/planification';
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
  template: Planification;
}

export function ClonarPlantillaDialog({ template }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [alumnoId, setAlumnoId] = useState('');
  const [titulo, setTitulo] = useState(
    template.nombrePlantilla ?? template.titulo,
  );
  const clone = useCloneTemplate();
  const { data: clientsData, isLoading } = useClients();

  async function handleClone() {
    if (!alumnoId) {
      toast.error('Seleccioná un alumno');
      return;
    }
    try {
      const plan = await clone.mutateAsync({
        templateId: template.id,
        alumnoId,
        titulo: titulo.trim() || undefined,
      });
      toast.success('Planificación creada', {
        description: 'La plantilla se asignó al alumno.',
      });
      setOpen(false);
      router.push(`/profesor/planificaciones/${plan.id}/asistente`);
    } catch (err) {
      toast.error('No se pudo clonar la plantilla', {
        description:
          err instanceof ApiError ? err.message : 'Intentá de nuevo.',
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" type="button">
          Asignar a alumno
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Asignar plantilla a alumno</DialogTitle>
          <DialogDescription>
            Se crea una planificación activa para el alumno (archiva la anterior
            si tenía una). {template.nombrePlantilla ?? template.titulo} ·{' '}
            {PROGRESSION_MODE_LABELS[template.config.modoProgresion]} ·{' '}
            {template.config.totalSesiones} sesiones
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Alumno *
            </span>
            <select
              className="mt-1 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm"
              value={alumnoId}
              onChange={(e) => setAlumnoId(e.target.value)}
              disabled={isLoading}
            >
              <option value="">Seleccionar alumno…</option>
              {(clientsData?.items ?? []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.apellido}, {c.nombre}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Título de la planificación (opcional)
            </span>
            <Input
              className="mt-1"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              maxLength={120}
            />
          </label>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" type="button" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            type="button"
            disabled={clone.isPending}
            onClick={() => void handleClone()}
          >
            {clone.isPending ? 'Asignando…' : 'Asignar planificación'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
