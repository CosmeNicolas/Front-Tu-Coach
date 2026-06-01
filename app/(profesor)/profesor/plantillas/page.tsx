import { PlantillasList } from '@/components/plantillas/PlantillasList';

export default function PlantillasPage() {
  return (
    <div className="space-y-6 p-4 sm:p-8">
      <header>
        <h1 className="font-display text-2xl tracking-wide text-foreground">
          Plantillas
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Bases por caso o patología para asignar a alumnos y completar en el
          asistente.
        </p>
      </header>
      <PlantillasList />
    </div>
  );
}
