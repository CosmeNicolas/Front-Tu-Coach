'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { logoutClient } from '@/lib/api/auth';
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
}

export function AlumnoLogoutConfirmDialog({ open, onOpenChange }: Props) {
  const router = useRouter();

  function handleConfirm() {
    onOpenChange(false);
    logoutClient();
    toast.success('Sesión cerrada', {
      description: 'Volvé a ingresar cuando quieras continuar tu entrenamiento.',
    });
    router.replace('/login');
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle>¿Cerrar sesión?</AlertDialogTitle>
          <AlertDialogDescription>
            Vas a salir de tu cuenta en TuCoach. ¿Deseás cerrar sesión?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel className="min-h-11 w-full sm:w-auto">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            className="min-h-11 w-full bg-destructive text-white hover:bg-destructive/90 sm:w-auto"
          >
            Cerrar sesión
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
