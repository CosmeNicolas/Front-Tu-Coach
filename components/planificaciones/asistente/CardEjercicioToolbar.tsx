'use client';

interface IconBtnProps {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: 'primary' | 'muted' | 'danger';
}

function IconBtn({ children, label, onClick, color }: IconBtnProps) {
  const cls =
    color === 'primary'
      ? 'text-foreground hover:bg-muted'
      : color === 'danger'
        ? 'text-neutral-600 hover:bg-muted'
        : color === 'muted'
          ? 'text-muted-foreground hover:bg-muted'
          : 'text-muted-foreground hover:bg-muted';
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      className={`rounded p-1.5 text-sm ${cls}`}
    >
      {children}
    </button>
  );
}

interface Props {
  editing: boolean;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
  onRemove: () => void;
  onAdjust?: () => void;
}

export function CardEjercicioToolbar({
  editing,
  onSave,
  onCancel,
  onEdit,
  onRemove,
  onAdjust,
}: Props) {
  return (
    <div className="flex shrink-0 gap-1">
      {editing ? (
        <>
          <IconBtn label="Guardar" onClick={onSave} color="primary">
            ✓
          </IconBtn>
          <IconBtn label="Cancelar" onClick={onCancel}>
            ✕
          </IconBtn>
        </>
      ) : (
        <>
          <IconBtn label="Editar" onClick={onEdit} color="muted">
            ✎
          </IconBtn>
          {onAdjust ? (
            <IconBtn label="Ajuste desde sesión N" onClick={onAdjust} color="primary">
              ⚡
            </IconBtn>
          ) : null}
        </>
      )}
      <IconBtn label="Eliminar" onClick={onRemove} color="danger">
        🗑
      </IconBtn>
    </div>
  );
}
