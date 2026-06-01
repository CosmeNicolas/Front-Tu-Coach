'use client';

import { useState } from 'react';
import { AlumnoLogoutConfirmDialog } from './AlumnoLogoutConfirmDialog';

export function AlumnoLogoutButton() {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        className="w-full rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        Cerrar sesión
      </button>
      <AlumnoLogoutConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
      />
    </>
  );
}
