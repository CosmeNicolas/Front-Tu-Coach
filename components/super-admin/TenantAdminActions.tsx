'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  AlertTriangle,
  Archive,
  ExternalLink,
  MoreVertical,
  PauseCircle,
  PlayCircle,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  useArchiveTenant,
  useMarkTenantSuspicious,
  useReactivateTenant,
  useSuspendTenant,
  useTenantSecuritySummary,
  useUnmarkTenantSuspicious,
} from '@/hooks/useTenantsAdmin';
import { TenantStatus } from '@/types/admin';
import { TenantSummary } from '@/types/gym-admin';
import { ApiError } from '@/lib/api/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface Props {
  tenant: TenantSummary;
}

export function TenantSecurityBadges({ tenant }: { tenant: TenantSummary }) {
  const isSuspended = tenant.estado === TenantStatus.SUSPENDED;
  const isSuspicious = tenant.securityReview?.suspicious === true;

  if (!isSuspended && !isSuspicious) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {isSuspicious && (
        <Badge variant="outline" className="border-amber-500/40 text-amber-700 dark:text-amber-300">
          Sospechoso
        </Badge>
      )}
      {isSuspended && (
        <Badge variant="secondary" className="bg-muted text-muted-foreground">
          Suspendido
        </Badge>
      )}
    </div>
  );
}

export function TenantAdminActions({ tenant }: Props) {
  const suspend = useSuspendTenant();
  const reactivate = useReactivateTenant();
  const markSuspicious = useMarkTenantSuspicious();
  const unmarkSuspicious = useUnmarkTenantSuspicious();
  const archive = useArchiveTenant();

  const [menuOpen, setMenuOpen] = useState(false);
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [markOpen, setMarkOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [motivo, setMotivo] = useState('');
  const [confirmText, setConfirmText] = useState('');

  const isSuspended = tenant.estado === TenantStatus.SUSPENDED;
  const isSuspicious = tenant.securityReview?.suspicious === true;

  const { data: summary, isLoading: summaryLoading } = useTenantSecuritySummary(
    tenant.id,
    archiveOpen,
  );

  async function handleSuspend() {
    try {
      await suspend.mutateAsync({ id: tenant.id, motivo: motivo.trim() || undefined });
      toast.success('Gimnasio suspendido');
      setSuspendOpen(false);
      setMotivo('');
    } catch (err) {
      toast.error('No se pudo suspender', {
        description: err instanceof ApiError ? err.message : undefined,
      });
    }
  }

  async function handleReactivate() {
    try {
      await reactivate.mutateAsync(tenant.id);
      toast.success('Gimnasio reactivado');
      setMenuOpen(false);
    } catch (err) {
      toast.error('No se pudo reactivar', {
        description: err instanceof ApiError ? err.message : undefined,
      });
    }
  }

  async function handleMarkSuspicious() {
    try {
      await markSuspicious.mutateAsync({
        id: tenant.id,
        motivo: motivo.trim() || undefined,
      });
      toast.success('Marcado como sospechoso');
      setMarkOpen(false);
      setMotivo('');
    } catch (err) {
      toast.error('No se pudo marcar', {
        description: err instanceof ApiError ? err.message : undefined,
      });
    }
  }

  async function handleUnmarkSuspicious() {
    try {
      await unmarkSuspicious.mutateAsync(tenant.id);
      toast.success('Marca de sospechoso removida');
      setMenuOpen(false);
    } catch (err) {
      toast.error('No se pudo quitar la marca', {
        description: err instanceof ApiError ? err.message : undefined,
      });
    }
  }

  async function handleArchive() {
    if (confirmText.trim().toUpperCase() !== 'ELIMINAR') return;
    try {
      await archive.mutateAsync(tenant.id);
      toast.success('Gimnasio archivado');
      setArchiveOpen(false);
      setConfirmText('');
    } catch (err) {
      toast.error('No se pudo archivar', {
        description: err instanceof ApiError ? err.message : undefined,
      });
    }
  }

  return (
    <>
      <Popover open={menuOpen} onOpenChange={setMenuOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Acciones</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-52 p-1">
          <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
            <Link href={`/super-admin/tenants/${tenant.id}`}>
              <ExternalLink className="mr-2 h-3.5 w-3.5" />
              Ver detalles
            </Link>
          </Button>

          {!isSuspended && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={() => {
                setMenuOpen(false);
                setSuspendOpen(true);
              }}
            >
              <PauseCircle className="mr-2 h-3.5 w-3.5" />
              Suspender
            </Button>
          )}

          {isSuspended && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              disabled={reactivate.isPending}
              onClick={() => void handleReactivate()}
            >
              <PlayCircle className="mr-2 h-3.5 w-3.5" />
              Reactivar
            </Button>
          )}

          {!isSuspicious ? (
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => {
                setMenuOpen(false);
                setMarkOpen(true);
              }}
            >
              <ShieldAlert className="mr-2 h-3.5 w-3.5" />
              Marcar sospechoso
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              disabled={unmarkSuspicious.isPending}
              onClick={() => void handleUnmarkSuspicious()}
            >
              <ShieldCheck className="mr-2 h-3.5 w-3.5" />
              Quitar sospechoso
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={() => {
              setMenuOpen(false);
              setArchiveOpen(true);
            }}
          >
            <Archive className="mr-2 h-3.5 w-3.5" />
            Archivar
          </Button>
        </PopoverContent>
      </Popover>

      <AlertDialog open={suspendOpen} onOpenChange={setSuspendOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Suspender {tenant.nombre}?</AlertDialogTitle>
            <AlertDialogDescription>
              Los usuarios no podrán iniciar sesión ni renovar tokens. Los datos
              se conservan y podés reactivarlo después.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor={`suspend-motivo-${tenant.id}`}>Motivo (opcional)</Label>
            <Input
              id={`suspend-motivo-${tenant.id}`}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ej: registro bot sospechoso"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={suspend.isPending}
              onClick={(e) => {
                e.preventDefault();
                void handleSuspend();
              }}
            >
              {suspend.isPending ? 'Suspendiendo…' : 'Suspender'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={markOpen} onOpenChange={setMarkOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Marcar como sospechoso</DialogTitle>
            <DialogDescription>
              Solo es una señal visual para revisión. No suspende ni elimina datos.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor={`mark-motivo-${tenant.id}`}>Motivo (opcional)</Label>
            <Input
              id={`mark-motivo-${tenant.id}`}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ej: nombre/email aleatorio"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMarkOpen(false)}>
              Cancelar
            </Button>
            <Button disabled={markSuspicious.isPending} onClick={() => void handleMarkSuspicious()}>
              {markSuspicious.isPending ? 'Guardando…' : 'Marcar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={archiveOpen} onOpenChange={setArchiveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archivar {tenant.nombre}</DialogTitle>
            <DialogDescription>
              Esta acción archiva el gimnasio y bloquea su acceso a TuCoach. No
              borramos datos relacionados de inmediato.
            </DialogDescription>
          </DialogHeader>

          {summaryLoading && (
            <p className="text-sm text-muted-foreground">Cargando actividad…</p>
          )}

          {summary && (
            <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-4 text-sm">
              <p>
                <span className="text-muted-foreground">Email referencia:</span>{' '}
                {summary.ownerEmail ?? '—'}
              </p>
              <p>
                <span className="text-muted-foreground">Usuarios:</span>{' '}
                {summary.usuarios} · Profesores: {summary.profesores} · Alumnos:{' '}
                {summary.alumnos} · Planificaciones: {summary.planificaciones}
              </p>
              {summary.recommendSuspendOverDelete && (
                <p className="flex items-start gap-2 text-amber-700 dark:text-amber-300">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  Este gimnasio tiene actividad real. Recomendamos{' '}
                  <strong>suspender</strong> antes que archivar.
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor={`archive-confirm-${tenant.id}`}>
              Escribí ELIMINAR para confirmar
            </Label>
            <Input
              id={`archive-confirm-${tenant.id}`}
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              autoComplete="off"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setArchiveOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              disabled={
                archive.isPending ||
                confirmText.trim().toUpperCase() !== 'ELIMINAR'
              }
              onClick={() => void handleArchive()}
            >
              {archive.isPending ? 'Archivando…' : 'Archivar gimnasio'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
