'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api/client';
import { useSolicitarNuevaPlanificacion } from '@/hooks/useStudentPortal';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planificationId: string;
  alreadyPending?: boolean;
}

export function SolicitarNuevaPlanDialog({
  open,
  onOpenChange,
  planificationId,
  alreadyPending,
}: Props) {
  const [mensaje, setMensaje] = useState('');
  const solicitar = useSolicitarNuevaPlanificacion(planificationId);

  async function handleSubmit() {
    try {
      await solicitar.mutateAsync(mensaje.trim() || undefined);
      toast.success(
        alreadyPending
          ? 'Recordatorio enviado a tu profesor'
          : 'Solicitud enviada a tu profesor',
      );
      setMensaje('');
      onOpenChange(false);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'No se pudo enviar la solicitud. Intentá de nuevo.';
      toast.error('Error', { description: message });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {alreadyPending
              ? 'Enviar recordatorio'
              : 'Solicitar nueva planificación'}
          </DialogTitle>
          <DialogDescription>
            Tu profesor va a recibir un aviso en su panel para revisar tu
            progreso y armar una nueva planificación si hace falta.
          </DialogDescription>
        </DialogHeader>

        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Mensaje (opcional)
          </span>
          <textarea
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            rows={3}
            maxLength={500}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            placeholder="Ej: terminé el plan y quiero subir un poco las cargas"
          />
        </label>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={solicitar.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={solicitar.isPending}
          >
            {solicitar.isPending ? 'Enviando…' : 'Enviar al profesor'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
