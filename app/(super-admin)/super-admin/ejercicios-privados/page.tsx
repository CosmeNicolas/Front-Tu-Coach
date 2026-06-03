import { SuperAdminPrivateExercisesView } from '@/components/ejercicios/SuperAdminPrivateExercisesView';

export default function SuperAdminEjerciciosPage() {
  return (
    <div className="space-y-6 p-4 sm:p-8">
      <header>
        <h1 className="font-display text-2xl tracking-wide text-foreground">
          Ejercicios privados
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Todos los ejercicios creados por profesores, con gimnasio y autor.
        </p>
      </header>
      <SuperAdminPrivateExercisesView />
    </div>
  );
}
