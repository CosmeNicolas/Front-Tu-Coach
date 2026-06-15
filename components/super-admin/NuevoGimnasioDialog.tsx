'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api/client';
import { useCreateTenant } from '@/hooks/useTenantsAdmin';
import { TenantStatus } from '@/types/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  trigger?: React.ReactNode;
}

export function NuevoGimnasioDialog({ trigger }: Props) {
  const create = useCreateTenant();
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState('');
  const [slug, setSlug] = useState('');

  function resetForm() {
    setNombre('');
    setSlug('');
  }

  async function handleSubmit() {
    const trimmed = nombre.trim();
    if (trimmed.length < 2) {
      toast.error('El nombre debe tener al menos 2 caracteres');
      return;
    }

    try {
      await create.mutateAsync({
        nombre: trimmed,
        slug: slug.trim() || undefined,
        estado: TenantStatus.ACTIVE,
      });
      toast.success('Gimnasio creado');
      setOpen(false);
      resetForm();
    } catch (err) {
      toast.error('No se pudo crear el gimnasio', {
        description: err instanceof ApiError ? err.message : undefined,
      });
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) resetForm();
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <Button type="button">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo gimnasio
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nuevo gimnasio</DialogTitle>
          <DialogDescription>
            Creá un gimnasio para asignar profesores y alumnos.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gym-nombre">Nombre *</Label>
            <Input
              id="gym-nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Gimnasio Central"
              maxLength={120}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gym-slug">Slug (opcional)</Label>
            <Input
              id="gym-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase())}
              placeholder="gimnasio-central"
              maxLength={80}
            />
            <p className="text-xs text-muted-foreground">
              Si lo dejás vacío se genera automáticamente desde el nombre.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" type="button" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            type="button"
            disabled={create.isPending}
            onClick={() => void handleSubmit()}
          >
            {create.isPending ? 'Creando…' : 'Crear gimnasio'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
