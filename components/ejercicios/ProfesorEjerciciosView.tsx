'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Pencil, Trash2, Upload } from 'lucide-react';
import {
  useCreatePrivateExercise,
  useDeletePrivateExercise,
  usePrivateExercises,
  useUploadPrivateExerciseMedia,
} from '@/hooks/usePrivateExercises';
import { CATALOGO_GRUPOS } from '@/lib/ejercicios/grupos-musculares';
import { ApiError } from '@/lib/api/client';
import { updatePrivateExercise } from '@/lib/api/private-exercises';
import {
  PrivateExercise,
  PrivateExerciseMediaType,
} from '@/types/private-exercise';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { EjercicioMediaPreview } from '@/components/ejercicios/EjercicioMediaPreview';
import { inferMediaType } from '@/lib/ejercicios/media-type';

type FormState = {
  nombre: string;
  categoria: string;
  descripcion: string;
  mediaUrl: string;
  mediaType: PrivateExerciseMediaType;
};

const emptyForm: FormState = {
  nombre: '',
  categoria: CATALOGO_GRUPOS[0]?.norm ?? 'general',
  descripcion: '',
  mediaUrl: '',
  mediaType: 'gif',
};

export function ProfesorEjerciciosView() {
  const [search, setSearch] = useState('');
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<PrivateExercise | null>(null);

  const { data, isLoading, error, refetch } = usePrivateExercises({
    search,
    limit: 100,
  });
  const createMutation = useCreatePrivateExercise();
  const uploadMutation = useUploadPrivateExerciseMedia();
  const deleteMutation = useDeletePrivateExercise();

  const saving = createMutation.isPending || uploadMutation.isPending;

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl('');
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  const items = useMemo(() => data?.items ?? [], [data?.items]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setSelectedFile(null);
    setPreviewUrl('');
  }

  function startEdit(item: PrivateExercise) {
    setEditingId(item.id);
    setForm({
      nombre: item.nombre,
      categoria: item.categoria,
      descripcion: item.descripcion,
      mediaUrl: item.mediaUrl,
      mediaType: item.mediaType,
    });
    setSelectedFile(null);
    setPreviewUrl(item.mediaUrl);
  }

  async function handleUpload(ejercicioId?: string) {
    if (!selectedFile) return null;
    try {
      const result = await uploadMutation.mutateAsync({
        file: selectedFile,
        ejercicioId,
      });
      return result;
    } catch (err) {
      toast.error('No se pudo subir la media', {
        description: err instanceof ApiError ? err.message : undefined,
      });
      return null;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nombre = form.nombre.trim();
    const categoria = form.categoria.trim();
    if (!nombre || !categoria) {
      toast.error('Nombre y categoría son obligatorios.');
      return;
    }

    try {
      let mediaUrl = form.mediaUrl.trim();
      let mediaType = inferMediaType(mediaUrl, form.mediaType);

      if (selectedFile) {
        const uploaded = await handleUpload(editingId ?? undefined);
        if (!uploaded) return;
        mediaUrl = uploaded.mediaUrl;
        mediaType = inferMediaType(mediaUrl, uploaded.mediaType);
      } else if (!mediaUrl) {
        toast.error('Subí un archivo o pegá un link de YouTube / URL de media.');
        return;
      }

      const payload = {
        nombre,
        categoria,
        descripcion: form.descripcion.trim(),
        mediaUrl,
        mediaType,
      };

      if (editingId) {
        await updatePrivateExercise(editingId, payload);
        toast.success('Ejercicio actualizado.');
      } else {
        await createMutation.mutateAsync(payload);
        toast.success('Ejercicio creado.');
      }

      resetForm();
      await refetch();
    } catch (err) {
      toast.error('No se pudo guardar', {
        description: err instanceof ApiError ? err.message : undefined,
      });
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success('Ejercicio eliminado.');
      if (editingId === deleteTarget.id) resetForm();
      setDeleteTarget(null);
    } catch (err) {
      toast.error('No se pudo eliminar', {
        description: err instanceof ApiError ? err.message : undefined,
      });
    }
  }

  const mediaPreview = previewUrl || form.mediaUrl;
  const previewMediaType = inferMediaType(mediaPreview, form.mediaType);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {editingId ? 'Editar ejercicio' : 'Nuevo ejercicio'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="ej-nombre">Nombre</Label>
              <Input
                id="ej-nombre"
                value={form.nombre}
                onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                placeholder="Ej: Press con banda"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ej-categoria">Categoría / grupo muscular</Label>
              <select
                id="ej-categoria"
                className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm"
                value={form.categoria}
                onChange={(e) =>
                  setForm((f) => ({ ...f, categoria: e.target.value }))
                }
              >
                {CATALOGO_GRUPOS.map((g) => (
                  <option key={g.id} value={g.norm}>
                    {g.label}
                  </option>
                ))}
                <option value="general">General</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ej-desc">Descripción (opcional)</Label>
              <Textarea
                id="ej-desc"
                value={form.descripcion}
                onChange={(e) =>
                  setForm((f) => ({ ...f, descripcion: e.target.value }))
                }
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ej-media-url">Link de YouTube o URL manual</Label>
              <Input
                id="ej-media-url"
                value={form.mediaUrl}
                onChange={(e) => {
                  const mediaUrl = e.target.value;
                  setForm((f) => ({
                    ...f,
                    mediaUrl,
                    mediaType: inferMediaType(mediaUrl, f.mediaType),
                  }));
                  if (!selectedFile) setPreviewUrl('');
                }}
                placeholder="https://www.youtube.com/watch?v=... o https://..."
              />
              <p className="text-xs text-muted-foreground">
                Podés pegar un link de YouTube o una URL de imagen/video ya
                hospedada. También podés subir un archivo abajo.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ej-media">Subir GIF / imagen / video</Label>
              <Input
                id="ej-media"
                type="file"
                accept="image/*,video/*,.gif,.webp,.heic,.heif,.mp4,.mov,.webm"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setSelectedFile(file);
                }}
              />
              <p className="text-xs text-muted-foreground">
                Se sube a Cloudinary (máx. 25 MB). GIF, PNG, JPG, WEBP, MP4, WEBM.
              </p>
            </div>

            {mediaPreview ? (
              <div className="rounded-lg border bg-muted/30 p-3">
                <EjercicioMediaPreview
                  src={mediaPreview}
                  alt={form.nombre || 'Preview'}
                  mediaType={previewMediaType}
                  mode={
                    previewMediaType === 'youtube' ||
                    previewMediaType === 'mp4' ||
                    previewMediaType === 'webm'
                      ? 'embed'
                      : 'thumbnail'
                  }
                  containerClassName="max-h-56"
                />
              </div>
            ) : null}

            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Guardando…
                  </>
                ) : editingId ? (
                  'Guardar cambios'
                ) : (
                  <>
                    <Upload className="size-4" />
                    Crear ejercicio
                  </>
                )}
              </Button>
              {editingId ? (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[200px] flex-1 space-y-2">
            <Label htmlFor="ej-search">Buscar en mis ejercicios</Label>
            <Input
              id="ej-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nombre o categoría…"
            />
          </div>
          <Badge variant="secondary">{items.length} ejercicio(s)</Badge>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Cargando…</p>
        ) : error ? (
          <p className="text-sm text-destructive">
            No se pudieron cargar tus ejercicios.
          </p>
        ) : items.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              Todavía no creaste ejercicios propios. Subí un GIF, video, link de
              YouTube y usalo en el asistente de planificación.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="flex gap-3 p-3">
                  <div className="w-20 shrink-0">
                    <EjercicioMediaPreview
                      src={item.mediaUrl}
                      alt={item.nombre}
                      mediaType={item.mediaType}
                      containerClassName="h-20 w-20"
                      eager
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{item.nombre}</p>
                    <p className="text-xs text-muted-foreground">{item.categoria}</p>
                    {item.descripcion ? (
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {item.descripcion}
                      </p>
                    ) : null}
                    <div className="mt-2 flex gap-1">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => startEdit(item)}
                      >
                        <Pencil className="size-3.5" />
                        Editar
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => setDeleteTarget(item)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar ejercicio?</AlertDialogTitle>
            <AlertDialogDescription>
              Se quitará del catálogo privado. Las planificaciones que ya lo
              usen conservarán nombre y media guardados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
