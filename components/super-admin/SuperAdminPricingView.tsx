'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api/client';
import {
  useAdminPlatformPricing,
  useUpdatePlatformPricing,
} from '@/hooks/usePlatformPricing';
import { formatArs } from '@/lib/landing/constants';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { PlatformPricingValues } from '@/types/platform-pricing';

type PricingField = keyof PlatformPricingValues;

const SAAS_FIELDS: { key: PricingField; label: string; hint?: string }[] = [
  { key: 'premiumMonth', label: 'Premium / mes (lista)' },
  { key: 'proMonth', label: 'Pro / mes (lista)' },
  { key: 'plusMonth', label: 'Plus / mes (lista)' },
  { key: 'gymMonth', label: 'Gimnasios / mes (referencia)' },
];

const CONFIG_FIELDS: { key: PricingField; label: string; hint: string }[] = [
  {
    key: 'launchDiscount',
    label: 'Descuento primer mes (0–1)',
    hint: 'Ej. 0.6 = 60% off',
  },
  { key: 'trialDays', label: 'Días de trial al registrarse', hint: '1–90. Solo la prueba Premium del profesor.' },
  {
    key: 'standardPlanTrialSessions',
    label: 'Sesiones gratis del plan estándar',
    hint: '1–12. Se guarda en cada inscripción nueva. Quien ya empezó no cambia.',
  },
  {
    key: 'premiumBillingDays',
    label: 'Días que cubre el primer pago Premium',
    hint: 'Normalmente 30',
  },
];

function parseNumber(value: string): number | null {
  const n = Number(value.replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

export function SuperAdminPricingView() {
  const { data, isLoading, error } = useAdminPlatformPricing();
  const update = useUpdatePlatformPricing();
  const [form, setForm] = useState<PlatformPricingValues | null>(null);

  useEffect(() => {
    if (data?.pricing) setForm({ ...data.pricing });
  }, [data?.pricing]);

  if (isLoading || !form) {
    return (
      <p className="text-sm text-muted-foreground">Cargando precios…</p>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-destructive">No se pudieron cargar los precios.</p>
    );
  }

  const premiumLaunch =
    data?.premiumLaunchMonth ??
    Math.round(form.premiumMonth * (1 - form.launchDiscount));

  function setField(key: PricingField, raw: string) {
    const parsed = parseNumber(raw);
    if (parsed === null) return;
    setForm((prev) => (prev ? { ...prev, [key]: parsed } : prev));
  }

  async function handleSave() {
    if (!form) return;
    try {
      await update.mutateAsync(form);
      toast.success(
        'Precios actualizados. La landing, el checkout y las inscripciones nuevas usan estos valores.',
      );
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : 'No se pudieron guardar los precios',
      );
    }
  }

  return (
    <div className="space-y-6 p-4 sm:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Precios de la plataforma</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Editá los montos en ARS y las sesiones gratis de los planes estándar.
            Los días de trial cambian la prueba Premium del profesor. Las sesiones
            gratis se copian al inscribirse y no modifican a quien ya está entrenando.
          </p>
          {data?.updatedAt ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Última actualización:{' '}
              {new Date(data.updatedAt).toLocaleString('es-AR')}
            </p>
          ) : null}
        </div>
        <Button type="button" disabled={update.isPending} onClick={handleSave}>
          {update.isPending ? 'Guardando…' : 'Guardar cambios'}
        </Button>
      </header>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Vista previa Premium</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Lista: <strong className="text-foreground">{formatArs(form.premiumMonth)}/mes</strong>
          {' · '}
          Primer mes con descuento:{' '}
          <strong className="text-foreground">{formatArs(premiumLaunch)}</strong>
          {' · '}
          Oferta:{' '}
          <strong className="text-foreground">
            {Math.round(form.launchDiscount * 100)}% off el primer mes
          </strong>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Suscripciones (lista mensual)</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {SAAS_FIELDS.map(({ key, label }) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key}>{label}</Label>
                <Input
                  id={key}
                  type="number"
                  min={0}
                  step={1000}
                  value={form[key]}
                  onChange={(e) => setField(key, e.target.value)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Configuración comercial</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {CONFIG_FIELDS.map(({ key, label, hint }) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key}>{label}</Label>
                <Input
                  id={key}
                  type="number"
                  min={key === 'launchDiscount' ? 0 : 1}
                  max={
                    key === 'launchDiscount'
                      ? 1
                      : key === 'trialDays'
                        ? 90
                        : key === 'standardPlanTrialSessions'
                          ? 12
                          : 365
                  }
                  step={key === 'launchDiscount' ? 0.05 : 1}
                  value={form[key]}
                  onChange={(e) => setField(key, e.target.value)}
                />
                <p className="text-xs text-muted-foreground">{hint}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
