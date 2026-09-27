'use client';

import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { Download, MessageCircle, Share2, X } from 'lucide-react';
import { toast } from 'sonner';
import { AlumnoSessionShareCard } from '@/components/alumno/session/AlumnoSessionShareCard';
import {
  buildSessionShareText,
  type SessionShareStats,
  whatsappShareUrl,
} from '@/lib/alumno/session-share';
import { Button } from '@/components/ui/button';

type Props = {
  open: boolean;
  stats: SessionShareStats;
  onClose: () => void;
};

export function AlumnoSessionShareDialog({ open, stats, onClose }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  if (!open) return null;

  const shareText = buildSessionShareText(stats);

  async function capturePng(): Promise<string | null> {
    if (!cardRef.current) return null;
    try {
      return await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#0a0a0a',
      });
    } catch {
      toast.error('No se pudo generar la imagen');
      return null;
    }
  }

  async function handleDownload() {
    setBusy(true);
    try {
      const dataUrl = await capturePng();
      if (!dataUrl) return;
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `tucoach-sesion-${stats.sessionNum}.png`;
      a.click();
      toast.success('Imagen guardada', {
        description: 'Subila a Instagram Stories o donde quieras.',
      });
    } finally {
      setBusy(false);
    }
  }

  function handleWhatsApp() {
    window.open(whatsappShareUrl(shareText), '_blank', 'noopener,noreferrer');
  }

  async function handleNativeShare() {
    setBusy(true);
    try {
      if (!navigator.share) {
        await handleDownload();
        return;
      }
      const dataUrl = await capturePng();
      if (!dataUrl) return;

      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File(
        [blob],
        `tucoach-sesion-${stats.sessionNum}.png`,
        { type: 'image/png' },
      );

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: 'Sesión TuCoach',
          text: shareText,
          files: [file],
        });
      } else {
        await navigator.share({ title: 'Sesión TuCoach', text: shareText });
      }
    } catch (err) {
      if ((err as Error)?.name === 'AbortError') return;
      toast.error('No se pudo compartir');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="session-share-title"
        className="flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
      >
        <header className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
          <div>
            <h2
              id="session-share-title"
              className="text-base font-semibold text-foreground"
            >
              ¡Sesión completada!
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Compartí tu progreso en WhatsApp o descargá la tarjeta para
              Stories.
            </p>
          </div>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="shrink-0"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X className="size-4" />
          </Button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          <div className="flex justify-center">
            <AlumnoSessionShareCard ref={cardRef} stats={stats} />
          </div>
        </div>

        <footer className="space-y-2 border-t border-border p-4">
          <Button
            type="button"
            className="w-full gap-2"
            disabled={busy}
            onClick={() => void handleWhatsApp()}
          >
            <MessageCircle className="size-4" />
            WhatsApp
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="secondary"
              className="gap-2"
              disabled={busy}
              onClick={() => void handleDownload()}
            >
              <Download className="size-4" />
              Descargar
            </Button>
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              disabled={busy}
              onClick={() => void handleNativeShare()}
            >
              <Share2 className="size-4" />
              Compartir
            </Button>
          </div>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={onClose}
          >
            Seguir entrenando
          </Button>
          <p className="text-center text-[11px] text-muted-foreground">
            Instagram: descargá la imagen y subila a tu Story.
          </p>
        </footer>
      </div>
    </div>
  );
}
