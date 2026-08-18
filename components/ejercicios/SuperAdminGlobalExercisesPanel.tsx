'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Globe, Loader2, Pencil, Trash2, Upload } from 'lucide-react';
import {
  useCreatePrivateExercise,
  useDeletePrivateExercise,
  usePrivateExercises,
  useUploadPrivateExerciseMedia,
} from '@/hooks/usePrivateExercises';
import {
  CATALOGO_DEPORTES,
  CATALOGO_GRUPOS,
  findCatalogoCategoriaByNorm,
} from '@/lib/ejercicios/grupos-musculares';
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

export function SuperAdminGlobalExercisesPanel() {
  const [search, setSearch] = useState('');
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<PrivateExercise | null>(null);

  const { data, isLoading, error, refetch } = usePrivateExercises({
    search,
    esGlobal: true,
    limit: 200,
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

  const items = useMemo(
    () => (data?.items ?? []).filter((item) => item.esGlobal),
    [data?.items],
  );

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
      return await uploadMutation.mutateAsync({
        file: selectedFile,
        ejercicioId,
      });
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
        toast.success('Ejercicio global actualizado.');
      } else {
        await createMutation.mutateAsync(payload);
        toast.success('Ejercicio global creado. Todos los profesores lo verán en el asistente.');
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
      toast.success('Ejercicio global eliminado.');
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
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Globe className="size-5 text-primary" />
        <div>
          <h2 className="font-display text-lg tracking-wide">Catálogo global</h2>
          <p className="text-sm text-muted-foreground">
            Ejercicios visibles para todos los profesores en el asistente de planificación.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {editingId ? 'Editar ejercicio global' : 'Nuevo ejercicio global'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="sa-global-nombre">Nombre</Label>
                <Input
                  id="sa-global-nombre"
                  value={form.nombre}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, nombre: e.target.value }))
                  }
                  placeholder="Ej: Sentadilla con barra"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sa-global-categoria">Categoría</Label>
                <select
                  id="sa-global-categoria"
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm"
                  value={form.categoria}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, categoria: e.target.value }))
                  }
                >
                  <optgroup label="Grupos musculares">
                    {CATALOGO_GRUPOS.map((g) => (
                      <option key={g.id} value={g.norm}>
                        {g.label}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Deportes">
                    {CATALOGO_DEPORTES.map((d) => (
                      <option key={d.id} value={d.norm}>
                        {d.label}
                      </option>
                    ))}
                  </optgroup>
                  <option value="general">General</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sa-global-desc">Descripción (opcional)</Label>
                <Textarea
                  id="sa-global-desc"
                  value={form.descripcion}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, descripcion: e.target.value }))
                  }
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sa-global-media-url">Link de YouTube o URL manual</Label>
                <Input
                  id="sa-global-media-url"
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="sa-global-media">Subir GIF / imagen / video</Label>
                <Input
                  id="sa-global-media"
                  type="file"
                  accept="image/*,video/*,.gif,.webp,.heic,.heif,.mp4,.mov,.webm"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                />
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
                      Crear ejercicio global
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
              <Label htmlFor="sa-global-search">Buscar en catálogo global</Label>
              <Input
                id="sa-global-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nombre o categoría…"
              />
            </div>
            <Badge variant="secondary">{items.length} global(es)</Badge>
          </div>

          {isLoading ? (
            <p className="text-sm text-muted-foreground">Cargando…</p>
          ) : error ? (
            <p className="text-sm text-destructive">
              No se pudo cargar el catálogo global.
            </p>
          ) : items.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                Todavía no hay ejercicios globales. Creá uno y aparecerá para
                todos los profesores en el asistente.
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
                      <div className="flex items-start gap-2">
                        <p className="truncate font-semibold">{item.nombre}</p>
                        <Badge variant="outline" className="shrink-0 text-[10px]">
                          Global
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {findCatalogoCategoriaByNorm(item.categoria)?.label ??
                          item.categoria}
                      </p>
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
      </div>

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar ejercicio global?</AlertDialogTitle>
            <AlertDialogDescription>
              Dejará de estar disponible para todos los profesores en el asistente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
