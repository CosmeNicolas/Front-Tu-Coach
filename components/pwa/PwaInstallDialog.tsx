'use client';

import { useState } from 'react';
import { PlusSquare, Share, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import { BrandMark } from '@/components/branding/BrandMark';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { PwaInstallResult, PwaPlatform } from '@/hooks/usePWAInstall';

interface PwaInstallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isInstallable: boolean;
  isInstalled: boolean;
  platform: PwaPlatform;
  onInstall: () => Promise<PwaInstallResult>;
}

const IOS_STEPS = [
  {
    icon: Share,
    title: 'Tocá Compartir',
    detail: 'En Safari, el cuadrado con la flecha hacia arriba, abajo en la barra.',
  },
  {
    icon: PlusSquare,
    title: 'Agregar a inicio',
    detail: 'Deslizá la lista y elegí “Agregar a pantalla de inicio”.',
  },
  {
    icon: Smartphone,
    title: 'Confirmá Agregar',
    detail: 'Va a aparecer el ícono de TuCoach en tu pantalla de inicio.',
  },
] as const;

export function PwaInstallDialog({
  open,
  onOpenChange,
  isInstallable,
  isInstalled,
  platform,
  onInstall,
}: PwaInstallDialogProps) {
  const [busy, setBusy] = useState(false);
  const [showAndroidFallback, setShowAndroidFallback] = useState(false);
  const isIos = platform === 'ios';

  async function handleAccept() {
    setBusy(true);
    try {
      const result = await onInstall();
      if (result === 'accepted') {
        toast.success('TuCoach se está instalando');
        onOpenChange(false);
        return;
      }
      if (result === 'dismissed') {
        return;
      }
      setShowAndroidFallback(true);
      toast.error('Chrome todavía no ofreció instalar', {
        description: 'Recargá la página e intentá de nuevo, o usá el menú ⋮ de Chrome.',
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setShowAndroidFallback(false);
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-w-sm gap-5 sm:max-w-md">
        <DialogHeader className="items-center text-center sm:items-start sm:text-left">
          <BrandMark size="md" priority />
          <DialogTitle className="pt-1">Instalar app</DialogTitle>
          <DialogDescription>
            {isInstalled
              ? 'TuCoach ya está instalada en este dispositivo. Abrila desde el ícono de inicio.'
              : isIos
                ? 'En iPhone Safari no deja instalar con un botón: hay que agregarla a inicio.'
                : '¿Querés instalar TuCoach en este dispositivo? Queda en la pantalla de inicio, como una app.'}
          </DialogDescription>
        </DialogHeader>

        {isInstalled ? null : isIos ? (
          <ol className="space-y-2">
            {IOS_STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <li
                  key={step.title}
                  className="flex gap-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                      <Icon className="size-4 shrink-0" aria-hidden />
                      {step.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {step.detail}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        ) : showAndroidFallback && !isInstallable ? (
          <ol className="space-y-2 text-sm">
            <li className="rounded-xl border border-border bg-muted/40 px-3 py-2.5">
              <span className="font-medium text-foreground">1. </span>
              <span className="text-muted-foreground">
                Recargá la página y volvé a tocar Instalar app.
              </span>
            </li>
            <li className="rounded-xl border border-border bg-muted/40 px-3 py-2.5">
              <span className="font-medium text-foreground">2. </span>
              <span className="text-muted-foreground">
                O tocá el menú <span className="font-medium text-foreground">⋮</span> de
                Chrome y elegí Instalar app.
              </span>
            </li>
          </ol>
        ) : null}

        <DialogFooter className="gap-2 sm:justify-stretch">
          <Button
            type="button"
            variant="outline"
            className="min-h-11 w-full sm:flex-1"
            disabled={busy}
            onClick={() => onOpenChange(false)}
          >
            {isInstalled || isIos ? 'Listo' : 'Cancelar'}
          </Button>
          {!isInstalled && !isIos ? (
            <Button
              type="button"
              className="min-h-11 w-full sm:flex-1"
              disabled={busy}
              onClick={() => void handleAccept()}
            >
              {busy ? 'Instalando…' : 'Aceptar'}
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
