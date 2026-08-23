'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useDeleteTemplate, useTemplates } from '@/hooks/usePlanificationTemplates';
import {
  TEMPLATE_CATEGORY_LABELS,
  TemplateCategory,
} from '@/lib/plantillas/template-categories';
import { PROGRESSION_MODE_LABELS, Planification } from '@/types/planification';
import { ClonarPlantillaDialog } from './ClonarPlantillaDialog';
import { PlantillasToolbar } from './PlantillasToolbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { ApiError } from '@/lib/api/client';

function categoryLabel(categoria: string | null | undefined) {
  if (!categoria) return null;
  return (
    TEMPLATE_CATEGORY_LABELS[categoria as TemplateCategory] ?? categoria
  );
}

export function PlantillasList() {
  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState<TemplateCategory | ''>('');
  const { data, isLoading, error } = useTemplates({ search, categoria });
  const remove = useDeleteTemplate();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState('');

  function requestDelete(template: Planification) {
    setDeleteId(template.id);
    setDeleteName(template.nombrePlantilla ?? template.titulo);
  }

  async function confirmDelete() {
    if (!deleteId) return;
    try {
      await remove.mutateAsync(deleteId);
      toast.success('Plantilla eliminada');
      setDeleteId(null);
    } catch (err) {
      toast.error('No se pudo eliminar', {
        description:
          err instanceof ApiError ? err.message : 'Intentá de nuevo.',
      });
    }
  }

  if (isLoading) {
    return (
      <p className="text-sm text-muted-foreground">Cargando plantillas…</p>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-destructive">
        No se pudieron cargar las plantillas.
      </p>
    );
  }

  const items = data?.items ?? [];
  const isEmpty = items.length === 0;

  return (
    <div className="space-y-6">
      <PlantillasToolbar
        search={search}
        categoria={categoria}
        onSearchChange={setSearch}
        onCategoriaChange={setCategoria}
      />

      {isEmpty ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center">
          <p className="font-medium text-foreground">
            {search || categoria
              ? 'No hay plantillas con ese filtro'
              : 'Sin plantillas todavía'}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Creá una plantilla por caso clínico o guardá una planificación de
            alumno como plantilla reutilizable.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((template) => {
            const cat = categoryLabel(template.categoriaPlantilla);
            const secciones = template.secciones.length;
            return (
              <Card
                key={template.id}
                className="border-border bg-card shadow-sm"
              >
                <CardHeader className="pb-2">
                  <div className="flex flex-wrap items-start gap-2">
                    {cat ? (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {cat}
                      </span>
                    ) : null}
                  </div>
                  <CardTitle className="mt-2 truncate text-lg">
                    {template.nombrePlantilla ?? template.titulo}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {template.descripcionPlantilla ? (
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {template.descripcionPlantilla}
                    </p>
                  ) : null}
                  <p className="text-sm text-muted-foreground">
                    {PROGRESSION_MODE_LABELS[template.config.modoProgresion]} ·{' '}
                    {template.config.totalSesiones} sesiones ·{' '}
                    {secciones === 0 ? (
                      <span className="text-muted-foreground">Sin ejercicios aún</span>
                    ) : (
                      `${secciones} secciones`
                    )}
                  </p>
                  <div className="flex flex-col gap-2">
                    <ClonarPlantillaDialog template={template} />
                    <Button variant="outline" asChild>
                      <Link href={`/profesor/plantillas/${template.id}`}>
                        Ver / editar
                      </Link>
                    </Button>
                    {secciones === 0 ? (
                      <Button variant="secondary" asChild>
                        <Link
                          href={`/profesor/planificaciones/${template.id}/asistente`}
                        >
                          Completar asistente
                        </Link>
                      </Button>
                    ) : null}
                    <Button
                      variant="ghost"
                      type="button"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => requestDelete(template)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <AlertDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar plantilla?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará &quot;{deleteName}&quot;. Esta acción no se puede
              deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={remove.isPending}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              disabled={remove.isPending}
              onClick={(e) => {
                e.preventDefault();
                void confirmDelete();
              }}
            >
              {remove.isPending ? 'Eliminando…' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
