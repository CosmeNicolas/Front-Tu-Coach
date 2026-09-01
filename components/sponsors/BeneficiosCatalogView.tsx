'use client';

import { useState } from 'react';
import { Check, Copy, Gift } from 'lucide-react';
import { toast } from 'sonner';
import { usePublicSponsors } from '@/hooks/useSponsors';
import { SponsorLogo } from '@/components/sponsors/SponsorLogo';
import { vigenciaLabel } from '@/lib/sponsors/vigencia';
import { WhatsAppIcon } from '@/components/sponsors/WhatsAppIcon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Sponsor } from '@/types/sponsor';

async function copyCode(codigo: string) {
  await navigator.clipboard.writeText(codigo);
}

function splitDescuento(descripcion: string): { titulo: string; detalle?: string } {
  const trimmed = descripcion.trim();
  const match = trimmed.match(/^(.+?\bOFF)\b[.\s,]*(.*)$/i);
  if (match?.[1] && match[2]?.trim()) {
    const rest = match[2].trim().replace(/\.$/, '');
    return {
      titulo: match[1].trim(),
      detalle: rest.charAt(0).toUpperCase() + rest.slice(1),
    };
  }
  return { titulo: trimmed };
}

function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  const [copied, setCopied] = useState(false);
  const enlace = sponsor.enlace?.trim();
  const vigencia = vigenciaLabel(sponsor.validoDesde, sponsor.validoHasta);
  const oferta = splitDescuento(sponsor.descripcion);

  async function handleCopy() {
    try {
      await copyCode(sponsor.codigo);
      setCopied(true);
      toast.success('Código copiado');
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error('No se pudo copiar. Anotá el código a mano.');
    }
  }

  return (
    <article className="flex h-full min-w-0 flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
      <header className="flex min-w-0 items-center gap-3">
        <SponsorLogo
          src={sponsor.imagenUrl}
          alt={sponsor.nombre}
          zoom={sponsor.imagenZoom}
          className="size-12 shrink-0 rounded-lg sm:size-14"
        />
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold uppercase tracking-wide text-foreground">
            {sponsor.nombre}
          </h2>
          <p className="text-xs text-muted-foreground">Beneficio TuCoach</p>
        </div>
      </header>

      <div className="flex flex-1 flex-col justify-center rounded-xl border border-border bg-muted/40 px-3 py-4 text-center sm:px-4">
        <p className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {oferta.titulo}
        </p>
        {oferta.detalle ? (
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            {oferta.detalle}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-end justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Código
          </p>
          <p className="break-all font-mono text-base font-bold tracking-widest text-foreground sm:text-lg">
            {sponsor.codigo}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0"
          onClick={() => void handleCopy()}
          aria-label={`Copiar código ${sponsor.codigo}`}
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? 'Copiado' : 'Copiar'}
        </Button>
      </div>

      {vigencia || enlace ? (
        <div className="mt-auto flex items-center justify-between gap-2">
          {vigencia ? (
            <p className="min-w-0 text-xs leading-snug text-muted-foreground">
              {vigencia}
            </p>
          ) : (
            <span />
          )}
          {enlace ? (
            <Button asChild variant="outline" size="icon" className="shrink-0">
              <a
                href={enlace}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Contactar a ${sponsor.nombre} por WhatsApp`}
                className="text-[#128C7E] hover:bg-muted hover:text-[#075E54] dark:text-[#25D366] dark:hover:text-[#4ADE80]"
              >
                <WhatsAppIcon className="size-5" />
              </a>
            </Button>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

interface BeneficiosCatalogViewProps {
  headingClassName?: string;
  className?: string;
}

export function BeneficiosCatalogView({
  headingClassName = 'text-2xl font-bold text-foreground',
  className = 'space-y-6 p-4 sm:p-6',
}: BeneficiosCatalogViewProps) {
  const { data, isLoading, error } = usePublicSponsors();
  const items = data?.items ?? [];

  if (isLoading) {
    return (
      <p className="p-4 text-sm text-muted-foreground">Cargando beneficios…</p>
    );
  }

  if (error) {
    return (
      <p className="p-4 text-sm text-destructive">
        No se pudieron cargar los beneficios. Probá de nuevo en un rato.
      </p>
    );
  }

  return (
    <div className={cn(className)}>
      <header>
        <h1 className={headingClassName}>Beneficios</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Descuentos y códigos de colaboradores de TuCoach.
        </p>
      </header>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card px-4 py-12 text-center">
          <Gift className="mx-auto size-8 text-muted-foreground" aria-hidden />
          <p className="mt-3 text-sm text-muted-foreground">
            Todavía no hay beneficios activos.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((sponsor) => (
            <li key={sponsor.id} className="min-w-0">
              <SponsorCard sponsor={sponsor} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
