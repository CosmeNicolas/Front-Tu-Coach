'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api/client';
import { CreateClientPayload, UpdateClientPayload } from '@/types/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AlumnoFormProps {
  initial?: Partial<CreateClientPayload> & {
    email?: string | null;
    telefono?: string | null;
    dni?: string | null;
  };
  submitLabel: string;
  onSubmit: (payload: CreateClientPayload) => Promise<void>;
}

export function AlumnoForm({
  initial,
  submitLabel,
  onSubmit,
}: AlumnoFormProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<CreateClientPayload>({
    nombre: initial?.nombre ?? '',
    apellido: initial?.apellido ?? '',
    email: initial?.email ?? '',
    telefono: initial?.telefono ?? '',
    dni: initial?.dni ?? '',
    datos: {
      edad: initial?.datos?.edad ?? undefined,
      peso: initial?.datos?.peso ?? undefined,
      altura: initial?.datos?.altura ?? undefined,
      objetivo: initial?.datos?.objetivo ?? '',
      condicionanteDeCarga: initial?.datos?.condicionanteDeCarga ?? '',
      sexo: initial?.datos?.sexo ?? 'no_informado',
    },
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(toClientPayload(form));
      toast.success('Alumno guardado');
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : 'No se pudo guardar',
      );
    } finally {
      setLoading(false);
    }
  }

  function updateDatos(
    field: keyof NonNullable<CreateClientPayload['datos']>,
    value: string | number,
  ) {
    setForm((prev) => ({
      ...prev,
      datos: { ...prev.datos, [field]: value },
    }));
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-xl flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id="alumno-nombre"
          label="Nombre"
          value={form.nombre}
          onChange={(v) => setForm({ ...form, nombre: v })}
          required
        />
        <Field
          id="alumno-apellido"
          label="Apellido"
          value={form.apellido}
          onChange={(v) => setForm({ ...form, apellido: v })}
          required
        />
        <Field
          id="alumno-email"
          label="Email"
          value={form.email ?? ''}
          onChange={(v) => setForm({ ...form, email: v })}
          type="email"
        />
        <Field
          id="alumno-telefono"
          label="Teléfono"
          value={form.telefono ?? ''}
          onChange={(v) => setForm({ ...form, telefono: v })}
        />
        <Field
          id="alumno-dni"
          label="DNI"
          value={form.dni ?? ''}
          onChange={(v) => setForm({ ...form, dni: v })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field
          id="alumno-edad"
          label="Edad"
          value={String(form.datos?.edad ?? '')}
          onChange={(v) => updateDatos('edad', Number(v) || 0)}
          type="number"
        />
        <Field
          id="alumno-peso"
          label="Peso (kg)"
          value={String(form.datos?.peso ?? '')}
          onChange={(v) => updateDatos('peso', Number(v) || 0)}
          type="number"
        />
        <Field
          id="alumno-altura"
          label="Altura (cm)"
          value={String(form.datos?.altura ?? '')}
          onChange={(v) => updateDatos('altura', Number(v) || 0)}
          type="number"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="alumno-sexo">Sexo</Label>
        <select
          id="alumno-sexo"
          value={form.datos?.sexo ?? 'no_informado'}
          onChange={(e) => updateDatos('sexo', e.target.value)}
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="no_informado">No informado</option>
          <option value="masculino">Masculino</option>
          <option value="femenino">Femenino</option>
          <option value="otro">Otro</option>
        </select>
      </div>

      <Field
        id="alumno-objetivo"
        label="Objetivo"
        value={form.datos?.objetivo ?? ''}
        onChange={(v) => updateDatos('objetivo', v)}
      />
      <Field
        id="alumno-condicionante"
        label="Condicionante de carga"
        value={form.datos?.condicionanteDeCarga ?? ''}
        onChange={(v) => updateDatos('condicionanteDeCarga', v)}
      />

      <Button type="submit" disabled={loading} className="mt-2">
        {loading ? 'Guardando…' : submitLabel}
      </Button>
    </form>
  );
}

function toClientPayload(form: CreateClientPayload): CreateClientPayload {
  const email = form.email?.trim();
  const telefono = form.telefono?.trim();
  const dni = form.dni?.trim();
  const edad = form.datos?.edad;
  const peso = form.datos?.peso;
  const altura = form.datos?.altura;
  return {
    nombre: form.nombre.trim(),
    apellido: form.apellido.trim(),
    email: email || undefined,
    telefono: telefono || undefined,
    dni: dni || undefined,
    datos: {
      edad: edad && edad > 0 ? edad : undefined,
      peso: peso && peso > 0 ? peso : undefined,
      altura: altura && altura > 0 ? altura : undefined,
      objetivo: form.datos?.objetivo?.trim() || undefined,
      condicionanteDeCarga:
        form.datos?.condicionanteDeCarga?.trim() || undefined,
      sexo: form.datos?.sexo ?? 'no_informado',
    },
  };
}

function Field({
  id,
  label,
  value,
  onChange,
  required,
  type = 'text',
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export type { UpdateClientPayload };
