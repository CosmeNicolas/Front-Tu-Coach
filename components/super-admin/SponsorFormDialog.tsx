'use client';

import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api/client';
import { normalizeSponsorEnlace } from '@/lib/sponsors/enlace';
import {
  useCreateSponsor,
  useUpdateSponsor,
  useUploadSponsorImage,
} from '@/hooks/useSponsors';
import { SponsorLogo, DEFAULT_IMAGEN_ZOOM, MAX_IMAGEN_ZOOM, MIN_IMAGEN_ZOOM } from '@/components/sponsors/SponsorLogo';
import { DatePickerField } from '@/components/ui/date-picker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Sponsor } from '@/types/sponsor';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sponsor?: Sponsor | null;
}

export function SponsorFormDialog({ open, onOpenChange, sponsor }: Props) {
  const create = useCreateSponsor();
  const update = useUpdateSponsor();
  const upload = useUploadSponsorImage();
  const fileRef = useRef<HTMLInputElement>(null);
  const isEdit = Boolean(sponsor);

  const [nombre, setNombre] = useState(sponsor?.nombre ?? '');
  const [descripcion, setDescripcion] = useState(sponsor?.descripcion ?? '');
  const [codigo, setCodigo] = useState(sponsor?.codigo ?? '');
  const [imagenUrl, setImagenUrl] = useState(sponsor?.imagenUrl ?? '');
  const [enlace, setEnlace] = useState(sponsor?.enlace ?? '');
  const [imagenZoom, setImagenZoom] = useState(
    sponsor?.imagenZoom ?? DEFAULT_IMAGEN_ZOOM,
  );
  const [validoDesde, setValidoDesde] = useState(sponsor?.validoDesde ?? '');
  const [validoHasta, setValidoHasta] = useState(sponsor?.validoHasta ?? '');
  const [activo, setActivo] = useState(sponsor?.activo ?? true);
  const [orden, setOrden] = useState(String(sponsor?.orden ?? 0));

  const saving = create.isPending || update.isPending || upload.isPending;

  function resetFromSponsor(next?: Sponsor | null) {
    setNombre(next?.nombre ?? '');
    setDescripcion(next?.descripcion ?? '');
    setCodigo(next?.codigo ?? '');
    setImagenUrl(next?.imagenUrl ?? '');
    setEnlace(next?.enlace ?? '');
    setImagenZoom(next?.imagenZoom ?? DEFAULT_IMAGEN_ZOOM);
    setValidoDesde(next?.validoDesde ?? '');
    setValidoHasta(next?.validoHasta ?? '');
    setActivo(next?.activo ?? true);
    setOrden(String(next?.orden ?? 0));
    if (fileRef.current) fileRef.current.value = '';
  }

  async function handleFile(file: File | undefined) {
    if (!file) return;
    try {
      const result = await upload.mutateAsync(file);
      setImagenUrl(result.url);
      toast.success('Imagen subida');
    } catch (err) {
      toast.error('No se pudo subir la imagen', {
        description: err instanceof ApiError ? err.message : undefined,
      });
    }
  }

  async function handleSubmit() {
    const trimmedNombre = nombre.trim();
    const trimmedDesc = descripcion.trim();
    const trimmedCodigo = codigo.trim().toUpperCase();
    const trimmedImage = imagenUrl.trim();
    const normalizedEnlace = normalizeSponsorEnlace(enlace);
    const ordenNum = Number.parseInt(orden, 10);

    if (trimmedNombre.length < 2) {
      toast.error('El nombre debe tener al menos 2 caracteres');
      return;
    }
    if (trimmedDesc.length < 4) {
      toast.error('La descripción debe tener al menos 4 caracteres');
      return;
    }
    if (trimmedCodigo.length < 3) {
      toast.error('El código debe tener al menos 3 caracteres');
      return;
    }
    if (!trimmedImage) {
      toast.error('Subí una imagen del colaborador');
      return;
    }
    if (enlace.trim() && normalizedEnlace === null) {
      toast.error('El enlace tiene que ser un WhatsApp (wa.me) o una URL https');
      return;
    }
    if (validoDesde && validoHasta && validoHasta < validoDesde) {
      toast.error('La fecha hasta no puede ser anterior a la fecha desde');
      return;
    }

    const payload = {
      nombre: trimmedNombre,
      descripcion: trimmedDesc,
      codigo: trimmedCodigo,
      imagenUrl: trimmedImage,
      enlace: normalizedEnlace || '',
      imagenZoom,
      validoDesde,
      validoHasta,
      activo,
      orden: Number.isFinite(ordenNum) && ordenNum >= 0 ? ordenNum : 0,
    };

    try {
      if (isEdit && sponsor) {
        await update.mutateAsync({ id: sponsor.id, payload });
        toast.success('Colaborador actualizado');
      } else {
        await create.mutateAsync(payload);
        toast.success('Colaborador creado');
      }
      onOpenChange(false);
      resetFromSponsor(null);
    } catch (err) {
      toast.error(
        isEdit ? 'No se pudo guardar el colaborador' : 'No se pudo crear el colaborador',
        {
          description: err instanceof ApiError ? err.message : undefined,
        },
      );
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (next) resetFromSponsor(sponsor);
        else resetFromSponsor(null);
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Editar colaborador' : 'Nuevo colaborador'}
          </DialogTitle>
          <DialogDescription>
            Los alumnos y profesores van a ver el logo, el descuento, el código y
            el enlace de WhatsApp.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sponsor-nombre">Nombre *</Label>
            <Input
              id="sponsor-nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="ATLAS Suplementos"
              maxLength={80}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sponsor-desc">Descripción *</Label>
            <Textarea
              id="sponsor-desc"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="5% OFF en efectivo o transferencia."
              maxLength={280}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sponsor-codigo">Código de descuento *</Label>
            <Input
              id="sponsor-codigo"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              placeholder="TUCO5R8"
              maxLength={40}
              className="font-mono tracking-widest"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sponsor-enlace">Enlace de WhatsApp</Label>
            <Input
              id="sponsor-enlace"
              value={enlace}
              onChange={(e) => setEnlace(e.target.value)}
              placeholder="https://wa.me/5491112345678"
              maxLength={600}
              inputMode="url"
            />
            <p className="text-xs text-muted-foreground">
              Pegá el wa.me o el número. Alumno y profesor lo abren y van a
              WhatsApp.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sponsor-desde">Válido desde</Label>
              <DatePickerField
                id="sponsor-desde"
                value={validoDesde}
                onChange={setValidoDesde}
                placeholder="Desde"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sponsor-hasta">Válido hasta</Label>
              <DatePickerField
                id="sponsor-hasta"
                value={validoHasta}
                onChange={setValidoHasta}
                placeholder="Hasta"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sponsor-imagen">Imagen *</Label>
            {imagenUrl ? (
              <SponsorLogo
                src={imagenUrl}
                alt={nombre || 'Vista previa'}
                zoom={imagenZoom}
                className="mx-auto aspect-square h-28 w-28"
              />
            ) : null}
            <Input
              ref={fileRef}
              id="sponsor-imagen"
              type="file"
              accept="image/*"
              onChange={(e) => void handleFile(e.target.files?.[0])}
            />
            {imagenUrl ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="sponsor-zoom">Zoom de la imagen</Label>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {imagenZoom}%
                  </span>
                </div>
                <input
                  id="sponsor-zoom"
                  type="range"
                  min={MIN_IMAGEN_ZOOM}
                  max={MAX_IMAGEN_ZOOM}
                  step={5}
                  value={imagenZoom}
                  onChange={(e) => setImagenZoom(Number(e.target.value))}
                  className={cn(
                    'h-2 w-full cursor-pointer appearance-none rounded-full',
                    'bg-[#91908e]',
                    '[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4',
                    '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full',
                    '[&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:bg-foreground',
                    '[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4',
                    '[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0',
                    '[&::-moz-range-thumb]:bg-foreground',
                    '[&::-moz-range-track]:h-2 [&::-moz-range-track]:rounded-full',
                    '[&::-moz-range-track]:bg-[#91908e]',
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  La imagen llena el recuadro y queda centrada. Subí el zoom para
                  acercarla si tiene mucho margen.
                </p>
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="sponsor-orden">Orden</Label>
              <Input
                id="sponsor-orden"
                type="number"
                min={0}
                value={orden}
                onChange={(e) => setOrden(e.target.value)}
                className="h-9 w-16 px-2 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="sponsor-activo">Visible</Label>
              <Switch
                id="sponsor-activo"
                checked={activo}
                onCheckedChange={setActivo}
              />
            </div>
          </div>
          <p className="-mt-2 text-xs text-muted-foreground">
            Orden: 0 aparece primero, 1 después, y así.
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            type="button"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            disabled={saving}
            onClick={() => void handleSubmit()}
          >
            {saving ? 'Guardando…' : isEdit ? 'Guardar' : 'Crear'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
