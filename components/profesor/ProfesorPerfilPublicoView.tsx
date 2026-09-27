'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api/client';
import {
  useMyPublicProfile,
  usePublishMyPublicProfile,
  useUnpublishMyPublicProfile,
  useUpdateMyPublicProfile,
  useUploadProfessorFoto,
} from '@/hooks/useProfessorCatalog';
import { professorPhotoSrc } from '@/lib/api/professor-catalog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function splitCsv(value: string): string[] {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function ProfesorPerfilPublicoView() {
  const { data, isLoading, error } = useMyPublicProfile();
  const update = useUpdateMyPublicProfile();
  const uploadFoto = useUploadProfessorFoto();
  const publish = usePublishMyPublicProfile();
  const unpublish = useUnpublishMyPublicProfile();
  const fileRef = useRef<HTMLInputElement>(null);

  const [bio, setBio] = useState('');
  const [slug, setSlug] = useState('');
  const [especialidades, setEspecialidades] = useState('');
  const [deportes, setDeportes] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [instagram, setInstagram] = useState('');
  const [website, setWebsite] = useState('');
  const [online, setOnline] = useState(false);
  const [presencial, setPresencial] = useState(false);

  useEffect(() => {
    if (!data) return;
    setBio(data.bio ?? '');
    setSlug(data.slug ?? '');
    setEspecialidades((data.especialidades ?? []).join(', '));
    setDeportes((data.deportes ?? []).join(', '));
    setUbicacion(data.ubicacion ?? '');
    setInstagram(data.redes.instagram ?? '');
    setWebsite(data.redes.website ?? '');
    setOnline(data.modalidadOnline);
    setPresencial(data.modalidadPresencial);
  }, [data]);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    try {
      await update.mutateAsync({
        bio,
        slug: slug.trim() || undefined,
        especialidades: splitCsv(especialidades),
        deportes: splitCsv(deportes),
        ubicacion: ubicacion.trim() || null,
        modalidadOnline: online,
        modalidadPresencial: presencial,
        redes: {
          instagram: instagram.trim() || null,
          website: website.trim() || null,
        },
      });
      toast.success('Perfil guardado');
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : 'No se pudo guardar el perfil',
      );
    }
  }

  async function handleFotoChange(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Solo se permiten imágenes');
      return;
    }
    try {
      await uploadFoto.mutateAsync(file);
      toast.success('Foto actualizada');
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : 'No se pudo subir la foto',
      );
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  async function handleRemoveFoto() {
    try {
      await update.mutateAsync({ fotoUrl: null });
      toast.success('Foto quitada — se usará el logo TuCoach');
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : 'No se pudo quitar la foto',
      );
    }
  }

  async function handlePublish() {
    try {
      await publish.mutateAsync();
      toast.success('Perfil publicado en el catálogo');
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : 'No se pudo publicar',
      );
    }
  }

  async function handleUnpublish() {
    try {
      await unpublish.mutateAsync();
      toast.success('Perfil oculto del catálogo');
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : 'No se pudo despublicar',
      );
    }
  }

  if (isLoading) {
    return (
      <p className="p-6 text-sm text-muted-foreground">Cargando perfil…</p>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-2 p-6">
        <h1 className="text-xl font-semibold">Perfil público</h1>
        <p className="text-sm text-destructive">
          {error instanceof ApiError && error.status === 404
            ? 'El catálogo de profesores todavía no está activado.'
            : 'No se pudo cargar el perfil público.'}
        </p>
      </div>
    );
  }

  const previewSrc = professorPhotoSrc(data.fotoUrl);

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 sm:p-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Perfil público</h1>
        <p className="text-sm text-muted-foreground">
          Así te van a ver los alumnos en el catálogo. Podés publicar solo con
          plan Premium o Pro.
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant={data.visibleEnCatalogo ? 'default' : 'secondary'}>
            {data.visibleEnCatalogo ? 'Visible en catálogo' : 'Borrador'}
          </Badge>
          <Badge variant="outline">Plan: {data.planEfectivo}</Badge>
          {data.catalogHiddenByAdmin ? (
            <Badge variant="secondary">Oculto por admin</Badge>
          ) : null}
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Foto de perfil</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="size-28 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewSrc}
              alt={data.displayName}
              className="size-full object-cover object-center"
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {data.fotoUrl
                ? 'Esta foto aparece en la tarjeta del catálogo.'
                : 'Sin foto: se muestra el logo TuCoach (zorro).'}
            </p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => void handleFotoChange(e.target.files?.[0])}
            />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                disabled={uploadFoto.isPending}
                onClick={() => fileRef.current?.click()}
              >
                {uploadFoto.isPending ? 'Subiendo…' : 'Subir foto'}
              </Button>
              {data.fotoUrl ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={update.isPending}
                  onClick={() => void handleRemoveFoto()}
                >
                  Quitar foto
                </Button>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{data.displayName}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={(e) => void handleSave(e)}>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="juan-perez"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                maxLength={1500}
                placeholder="Contá tu experiencia y enfoque…"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="esp">Especialidades (separadas por coma)</Label>
              <Input
                id="esp"
                value={especialidades}
                onChange={(e) => setEspecialidades(e.target.value)}
                placeholder="Fuerza, hipertrofia, running"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dep">Deportes (separados por coma)</Label>
              <Input
                id="dep"
                value={deportes}
                onChange={(e) => setDeportes(e.target.value)}
                placeholder="Gym, fútbol, trail"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ubi">Ubicación</Label>
              <Input
                id="ubi"
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                placeholder="CABA, Argentina"
              />
            </div>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={online}
                  onChange={(e) => setOnline(e.target.checked)}
                />
                Online
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={presencial}
                  onChange={(e) => setPresencial(e.target.checked)}
                />
                Presencial
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="ig">Instagram</Label>
                <Input
                  id="ig"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="@usuario"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="web">Sitio web</Label>
                <Input
                  id="web"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button type="submit" disabled={update.isPending}>
                {update.isPending ? 'Guardando…' : 'Guardar'}
              </Button>
              {data.visibleEnCatalogo ? (
                <Button
                  type="button"
                  variant="outline"
                  disabled={unpublish.isPending}
                  onClick={() => void handleUnpublish()}
                >
                  Ocultar del catálogo
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="secondary"
                  disabled={
                    publish.isPending ||
                    !data.canPublish ||
                    data.catalogHiddenByAdmin
                  }
                  onClick={() => void handlePublish()}
                >
                  Publicar en catálogo
                </Button>
              )}
            </div>
            {!data.canPublish ? (
              <p className="text-xs text-muted-foreground">
                Tu plan actual ({data.planEfectivo}) no permite publicar. Pasá a
                Premium o Pro para aparecer en el catálogo.
              </p>
            ) : null}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
