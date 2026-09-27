'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api/client';
import { useTrainsAlone } from '@/hooks/useTrainsAlone';
import { useMiPerfil, useUpdateMisDatos } from '@/hooks/useStudentPortal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
  const { trainsAlone } = useTrainsAlone();
  const updateDatos = useUpdateMisDatos();
  const [edad, setEdad] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [objetivo, setObjetivo] = useState('');

  useEffect(() => {
    if (!data) return;
    setEdad(data.datos.edad != null ? String(data.datos.edad) : '');
    setPeso(data.datos.peso != null ? String(data.datos.peso) : '');
    setAltura(data.datos.altura != null ? String(data.datos.altura) : '');
    setObjetivo(data.datos.objetivo ?? '');
  }, [data]);

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
          {trainsAlone
            ? 'Tus datos de entrenamiento'
            : 'Información registrada por tu profesor'}
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
        {trainsAlone ? null : (
          <DataRow label="Profesor asignado" value={display(profesor)} />
        )}
      </section>

      {trainsAlone ? (
        <form
          className="space-y-4 rounded-2xl border border-border bg-card p-4 shadow-sm"
          onSubmit={(event) => {
            event.preventDefault();
            const payload: {
              edad?: number;
              peso?: number;
              altura?: number;
              objetivo?: string;
            } = { objetivo: objetivo.trim() };
            const edadNum = Number(edad);
            const pesoNum = Number(peso);
            const alturaNum = Number(altura);
            if (edad.trim()) payload.edad = edadNum;
            if (peso.trim()) payload.peso = pesoNum;
            if (altura.trim()) payload.altura = alturaNum;
            updateDatos.mutate(payload, {
              onSuccess: () => toast.success('Datos guardados'),
              onError: (err) =>
                toast.error(
                  err instanceof ApiError
                    ? err.message
                    : 'No se pudieron guardar los datos',
                ),
            });
          }}
        >
          <p className="text-sm font-medium text-foreground">Actualizar</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1">
              <Label htmlFor="edad">Edad</Label>
              <Input
                id="edad"
                inputMode="numeric"
                value={edad}
                onChange={(event) => setEdad(event.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="peso">Peso (kg)</Label>
              <Input
                id="peso"
                inputMode="decimal"
                value={peso}
                onChange={(event) => setPeso(event.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="altura">Altura (cm)</Label>
              <Input
                id="altura"
                inputMode="decimal"
                value={altura}
                onChange={(event) => setAltura(event.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="objetivo">Objetivo</Label>
            <Input
              id="objetivo"
              value={objetivo}
              maxLength={200}
              onChange={(event) => setObjetivo(event.target.value)}
            />
          </div>
          <Button type="submit" disabled={updateDatos.isPending}>
            {updateDatos.isPending ? 'Guardando…' : 'Guardar datos'}
          </Button>
        </form>
      ) : null}
    </div>
  );
}
