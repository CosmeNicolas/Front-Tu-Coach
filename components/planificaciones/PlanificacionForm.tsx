'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useClients } from '@/hooks/useClients';
import { ApiError } from '@/lib/api/client';
import { PlanificacionConfigFields } from '@/components/planificaciones/PlanificacionConfigFields';
import {
  CreatePlanificationPayload,
  PlanificationConfig,
  ProgressionMode,
} from '@/types/planification';

interface PlanificacionFormProps {
  initialAlumnoId?: string;
  initialTitulo?: string;
  initialConfig?: PlanificationConfig;
  submitLabel: string;
  onSubmit: (payload: CreatePlanificationPayload) => Promise<void>;
}

const DEFAULT_CONFIG: PlanificationConfig = {
  semanasDelPlan: 1,
  frecuenciaSemanal: 3,
  totalSesiones: 3,
  modoProgresion: ProgressionMode.BLOQUE_X3,
};

export function PlanificacionForm({
  initialAlumnoId,
  initialTitulo,
  initialConfig,
  submitLabel,
  onSubmit,
}: PlanificacionFormProps) {
  const { data: clientsData } = useClients();
  const [loading, setLoading] = useState(false);
  const [titulo, setTitulo] = useState(initialTitulo ?? '');
  const [alumnoId, setAlumnoId] = useState(initialAlumnoId ?? '');
  const [config, setConfig] = useState(initialConfig ?? DEFAULT_CONFIG);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!alumnoId) {
      toast.error('Seleccioná un alumno');
      return;
    }
    setLoading(true);
    try {
      await onSubmit({ titulo, alumnoId, config });
      toast.success('Planificación guardada');
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : 'No se pudo guardar',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-xl flex-col gap-6">
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-zinc-700">Título</span>
        <input
          required
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Plan mes de junio"
          className="rounded-lg border border-zinc-300 px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-zinc-700">Alumno</span>
        <select
          required
          value={alumnoId}
          onChange={(e) => setAlumnoId(e.target.value)}
          className="rounded-lg border border-zinc-300 px-3 py-2"
        >
          <option value="">Seleccionar alumno…</option>
          {clientsData?.items.map((c) => (
            <option key={c.id} value={c.id}>
              {c.apellido}, {c.nombre}
            </option>
          ))}
        </select>
      </label>

      <PlanificacionConfigFields value={config} onChange={setConfig} />

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
