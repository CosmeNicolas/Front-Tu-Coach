import { ProfesorEjerciciosView } from '@/components/ejercicios/ProfesorEjerciciosView';

export default function EjerciciosPage() {
  return (
    <div className="space-y-6 p-4 sm:p-8">
      <header>
        <h1 className="font-display text-2xl tracking-wide text-foreground">
          Mis ejercicios
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Creá ejercicios con GIF o video propios. Aparecen en el asistente de
          planificación solo para vos y tus alumnos cuando los agregues a una
          planificación.
        </p>
      </header>
      <ProfesorEjerciciosView />
    </div>
  );
}
