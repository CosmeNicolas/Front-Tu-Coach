'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api/client';
import { useCreateGymProfesor } from '@/hooks/useGymAdmin';
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
  tenantId?: string;
  trigger?: React.ReactNode;
}

export function InvitarProfesorGymDialog({ tenantId, trigger }: Props) {
  const create = useCreateGymProfesor(tenantId);
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');

  function resetForm() {
    setNombre('');
    setApellido('');
    setEmail('');
    setTelefono('');
  }

  async function handleSubmit() {
    if (!nombre.trim() || !apellido.trim()) {
      toast.error('Nombre y apellido son obligatorios');
      return;
    }
    if (!email.trim()) {
      toast.error('El email es obligatorio');
      return;
    }

    try {
      await create.mutateAsync({
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: email.trim(),
        telefono: telefono.trim() || undefined,
        tenantId,
      });
      toast.success('Invitación enviada por email');
      setOpen(false);
      resetForm();
    } catch (err) {
      toast.error('No se pudo invitar al profesor', {
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
            Invitar profesor
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invitar profesor</DialogTitle>
          <DialogDescription>
            Le mandamos un mail para activar su cuenta y elegir contraseña.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="gym-prof-nombre">Nombre *</Label>
              <Input
                id="gym-prof-nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gym-prof-apellido">Apellido *</Label>
              <Input
                id="gym-prof-apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="gym-prof-email">Email *</Label>
            <Input
              id="gym-prof-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gym-prof-tel">Teléfono</Label>
            <Input
              id="gym-prof-tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button type="button" disabled={create.isPending} onClick={() => void handleSubmit()}>
            {create.isPending ? 'Enviando…' : 'Enviar invitación'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
