'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pendingCount: number;
  onConfirm: () => void;
  isSubmitting?: boolean;
}

export function AlumnoPendingExercisesDialog({
  open,
  onOpenChange,
  pendingCount,
  onConfirm,
  isSubmitting = false,
}: Props) {
  const label =
    pendingCount === 1 ? '1 ejercicio' : `${pendingCount} ejercicios`;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Ejercicios pendientes</AlertDialogTitle>
          <AlertDialogDescription>
            Aún quedan {label} sin marcar como realizados. ¿Deseas finalizar la
            sesión igualmente?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel disabled={isSubmitting} className="min-h-11 w-full sm:w-auto">
            Volver
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isSubmitting}
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            className="min-h-11 w-full bg-primary hover:bg-primary/90 sm:w-auto"
          >
            {isSubmitting ? 'Guardando…' : 'Finalizar igual'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
