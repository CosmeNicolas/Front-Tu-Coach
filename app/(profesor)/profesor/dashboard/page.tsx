import Link from 'next/link';

export default function ProfesorDashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-foreground">Dashboard Profesor</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Empezá creando un alumno y luego su planificación base.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href="/profesor/alumnos/nuevo"
          className="rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground"
        >
          Nuevo alumno
        </Link>
        <Link
          href="/profesor/planificaciones/nueva"
          className="rounded-lg border border-border px-4 py-3 text-sm font-medium text-foreground hover:bg-muted"
        >
          Nueva planificación
        </Link>
        <Link
          href="/profesor/alumnos"
          className="rounded-lg border border-border px-4 py-3 text-sm font-medium text-foreground hover:bg-muted"
        >
          Ver alumnos
        </Link>
        <Link
          href="/profesor/planificaciones"
          className="rounded-lg border border-border px-4 py-3 text-sm font-medium text-foreground hover:bg-muted"
        >
          Ver planificaciones
        </Link>
      </div>
    </div>
  );
}
