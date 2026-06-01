'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api/client';
import { CreateClientPayload, UpdateClientPayload } from '@/types/client';

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
      await onSubmit(form);
      toast.success('Alumno guardado');
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : 'No se pudo guardar',
      );
    } finally {
      setLoading(false);
    }
  }

  function updateDatos(field: keyof NonNullable<CreateClientPayload['datos']>, value: string | number) {
    setForm((prev) => ({
      ...prev,
      datos: { ...prev.datos, [field]: value },
    }));
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-xl flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre" value={form.nombre} onChange={(v) => setForm({ ...form, nombre: v })} required />
        <Field label="Apellido" value={form.apellido} onChange={(v) => setForm({ ...form, apellido: v })} required />
        <Field label="Email" value={form.email ?? ''} onChange={(v) => setForm({ ...form, email: v })} type="email" />
        <Field label="Teléfono" value={form.telefono ?? ''} onChange={(v) => setForm({ ...form, telefono: v })} />
        <Field label="DNI" value={form.dni ?? ''} onChange={(v) => setForm({ ...form, dni: v })} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Edad" value={String(form.datos?.edad ?? '')} onChange={(v) => updateDatos('edad', Number(v) || 0)} type="number" />
        <Field label="Peso (kg)" value={String(form.datos?.peso ?? '')} onChange={(v) => updateDatos('peso', Number(v) || 0)} type="number" />
        <Field label="Altura (cm)" value={String(form.datos?.altura ?? '')} onChange={(v) => updateDatos('altura', Number(v) || 0)} type="number" />
      </div>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-zinc-700">Sexo</span>
        <select
          value={form.datos?.sexo ?? 'no_informado'}
          onChange={(e) => updateDatos('sexo', e.target.value)}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-zinc-900"
        >
          <option value="no_informado">No informado</option>
          <option value="masculino">Masculino</option>
          <option value="femenino">Femenino</option>
          <option value="otro">Otro</option>
        </select>
      </label>

      <Field label="Objetivo" value={form.datos?.objetivo ?? ''} onChange={(v) => updateDatos('objetivo', v)} />
      <Field label="Condicionante de carga" value={form.datos?.condicionanteDeCarga ?? ''} onChange={(v) => updateDatos('condicionanteDeCarga', v)} />

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
      >
        {loading ? 'Guardando…' : submitLabel}
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-zinc-700">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-zinc-900"
      />
    </label>
  );
}

export type { UpdateClientPayload };
