'use client';

import { useMiPerfil } from '@/hooks/useStudentPortal';

const PLACEHOLDER = 'No cargado';

function DataRow({ label, value }: { label: string; value: string }) {
  const empty = value === PLACEHOLDER;
  return (
    <div className="flex flex-col gap-1 border-b border-border py-4 last:border-0">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span
        className={
          empty
            ? 'text-sm italic text-muted-foreground'
            : 'text-base text-foreground'
        }
      >
        {value}
      </span>
    </div>
  );
}

function display(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return PLACEHOLDER;
  if (typeof value === 'string' && !value.trim()) return PLACEHOLDER;
  return String(value);
}

function displayKg(value: number | null | undefined): string {
  if (value === null || value === undefined) return PLACEHOLDER;
  return `${value} kg`;
}

function displayCm(value: number | null | undefined): string {
  if (value === null || value === undefined) return PLACEHOLDER;
  return `${value} cm`;
}

export function AlumnoDatosPersonales() {
  const { data, isLoading, error } = useMiPerfil();

  if (isLoading) {
    return (
      <p className="p-4 text-sm text-muted-foreground">Cargando tus datos…</p>
    );
  }

  if (error || !data) {
    return (
      <p className="p-4 text-sm text-destructive">
        No se pudieron cargar tus datos personales.
      </p>
    );
  }

  const nombreCompleto = [data.nombre, data.apellido].filter(Boolean).join(' ');
  const profesor =
    data.profesor?.nombre?.trim() ||
    data.profesor?.email ||
    null;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Mis datos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Información registrada por tu profesor
        </p>
      </header>

      <section className="rounded-2xl border border-border bg-card px-4 shadow-sm">
        <DataRow label="Nombre" value={display(nombreCompleto)} />
        <DataRow label="Email de acceso" value={display(data.email)} />
        <DataRow
          label="Email de contacto"
          value={display(data.clienteEmail)}
        />
        <DataRow label="Edad" value={display(data.datos.edad)} />
        <DataRow label="Peso" value={displayKg(data.datos.peso)} />
        <DataRow label="Altura" value={displayCm(data.datos.altura)} />
        <DataRow label="Objetivo" value={display(data.datos.objetivo)} />
        <DataRow
          label="Condicionante de carga"
          value={display(data.datos.condicionanteDeCarga)}
        />
        <DataRow label="Profesor asignado" value={display(profesor)} />
      </section>
    </div>
  );
}
