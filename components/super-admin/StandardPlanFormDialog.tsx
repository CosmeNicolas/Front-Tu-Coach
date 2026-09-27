'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api/client';
import {
  useCreateStandardPlan,
  useUpdateStandardPlan,
} from '@/hooks/useStandardPlans';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProgressionMode } from '@/types/planification';
import {
  STANDARD_PLAN_LEVEL_LABELS,
  StandardPlanLevel,
  type StandardPlanTemplate,
} from '@/types/standard-plan';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: StandardPlanTemplate | null;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

export function StandardPlanFormDialog({
  open,
  onOpenChange,
  editing,
}: Props) {
  const create = useCreateStandardPlan();
  const update = useUpdateStandardPlan(editing?.id ?? '');

  const [slug, setSlug] = useState('');
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [nivel, setNivel] = useState<StandardPlanLevel>(
    StandardPlanLevel.PRINCIPIANTE,
  );
  const [precioArs, setPrecioArs] = useState('14900');
  const [semanas, setSemanas] = useState('4');
  const [frecuencia, setFrecuencia] = useState('3');
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setSlug(editing.slug);
      setNombre(editing.nombre);
      setDescripcion(editing.descripcion ?? '');
      setObjetivo(editing.objetivo);
      setNivel(editing.nivel);
      setPrecioArs(String(editing.precioArs));
      setSemanas(String(editing.config.semanasDelPlan));
      setFrecuencia(String(editing.config.frecuenciaSemanal));
      setSlugTouched(true);
    } else {
      setSlug('');
      setNombre('');
      setDescripcion('');
      setObjetivo('');
      setNivel(StandardPlanLevel.PRINCIPIANTE);
      setPrecioArs('14900');
      setSemanas('4');
      setFrecuencia('3');
      setSlugTouched(false);
    }
  }, [open, editing]);

  const semanasN = Number(semanas) || 1;
  const frecuenciaN = Number(frecuencia) || 1;
  const totalSesiones = semanasN * frecuenciaN;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      slug: slug.trim(),
      nombre: nombre.trim(),
      descripcion: descripcion.trim() || undefined,
      objetivo: objetivo.trim(),
      nivel,
      precioArs: Number(precioArs) || 0,
      config: {
        semanasDelPlan: semanasN,
        frecuenciaSemanal: frecuenciaN,
        totalSesiones,
        modoProgresion: ProgressionMode.LINEAL,
      },
    };

    try {
      if (editing) {
        await update.mutateAsync(payload);
        toast.success('Template actualizado');
      } else {
        await create.mutateAsync(payload);
        toast.success('Template creado (borrador)');
      }
      onOpenChange(false);
    } catch (err) {
      toast.error(editing ? 'No se pudo actualizar' : 'No se pudo crear', {
        description: err instanceof ApiError ? err.message : undefined,
      });
    }
  }

  const pending = create.isPending || update.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editing ? 'Editar template' : 'Nuevo plan estándar'}
          </DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="sp-nombre">Nombre</Label>
            <Input
              id="sp-nombre"
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
              required
              maxLength={120}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sp-slug">Slug</Label>
            <Input
              id="sp-slug"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              required
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sp-objetivo">Objetivo</Label>
            <Input
              id="sp-objetivo"
              value={objetivo}
              onChange={(e) => setObjetivo(e.target.value)}
              required
              maxLength={200}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sp-desc">Descripción</Label>
            <Textarea
              id="sp-desc"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              maxLength={2000}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Nivel</Label>
              <Select
                value={nivel}
                onValueChange={(v) => setNivel(v as StandardPlanLevel)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(StandardPlanLevel).map((level) => (
                    <SelectItem key={level} value={level}>
                      {STANDARD_PLAN_LEVEL_LABELS[level]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sp-precio">Precio ARS</Label>
              <Input
                id="sp-precio"
                type="number"
                min={0}
                value={precioArs}
                onChange={(e) => setPrecioArs(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="sp-sem">Semanas</Label>
              <Input
                id="sp-sem"
                type="number"
                min={1}
                max={52}
                value={semanas}
                onChange={(e) => setSemanas(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sp-freq">Días/sem</Label>
              <Input
                id="sp-freq"
                type="number"
                min={1}
                max={5}
                value={frecuencia}
                onChange={(e) => setFrecuencia(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Sesiones</Label>
              <Input value={String(totalSesiones)} disabled readOnly />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={pending}>
              {editing ? 'Guardar' : 'Crear borrador'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
