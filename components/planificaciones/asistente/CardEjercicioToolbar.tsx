'use client';

interface IconBtnProps {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  color?: 'primary' | 'muted' | 'danger';
}

function IconBtn({ children, label, onClick, disabled, color }: IconBtnProps) {
  const cls = disabled
    ? 'cursor-not-allowed opacity-40'
    : color === 'primary'
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
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`rounded p-1.5 text-sm ${cls}`}
    >
      {children}
    </button>
  );
}

interface Props {
  editing: boolean;
  inlineEditBlocked?: boolean;
  removeBlocked?: boolean;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
  onRemove: () => void;
  onAdjust?: () => void;
}

export function CardEjercicioToolbar({
  editing,
  inlineEditBlocked = false,
  removeBlocked = false,
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
          <IconBtn
            label={
              inlineEditBlocked
                ? 'Edición bloqueada: el alumno ya completó sesiones. Usá ⚡'
                : 'Editar'
            }
            onClick={onEdit}
            disabled={inlineEditBlocked}
            color="muted"
          >
            ✎
          </IconBtn>
          {onAdjust ? (
            <IconBtn label="Ajuste desde sesión N" onClick={onAdjust} color="primary">
              ⚡
            </IconBtn>
          ) : null}
        </>
      )}
      <IconBtn
        label={
          removeBlocked
            ? 'No podés eliminar: el alumno ya completó sesiones'
            : 'Eliminar'
        }
        onClick={onRemove}
        disabled={removeBlocked}
        color="danger"
      >
        🗑
      </IconBtn>
    </div>
  );
}
