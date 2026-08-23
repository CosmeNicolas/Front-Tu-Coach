'use client';

import { Button } from '@/components/ui/button';

interface Props {
  rpe: number | '';
  rpeNote: string;
  sessionComment: string;
  notifyProfessor: boolean;
  readOnly: boolean;
  isPending: boolean;
  onRpe: (value: number) => void;
  onRpeNote: (note: string) => void;
  onSessionComment: (comment: string) => void;
  onNotifyProfessor: (value: boolean) => void;
  onSubmit: () => void;
}

const RPE_EMOJI: Record<number, string> = {
  1: '😴',
  2: '😌',
  3: '🙂',
  4: '😊',
  5: '😐',
  6: '😅',
  7: '😤',
  8: '🥵',
  9: '🤯',
  10: '💀',
};

export function AlumnoRpeForm({
  rpe,
  rpeNote,
  sessionComment,
  notifyProfessor,
  readOnly,
  isPending,
  onRpe,
  onRpeNote,
  onSessionComment,
  onNotifyProfessor,
  onSubmit,
}: Props) {
  if (readOnly) {
    return (
      <section className="rounded-xl border border-border bg-muted/30 p-5">
        <h2 className="text-sm font-semibold text-foreground">Sesión completada</h2>
        {rpe !== '' ? (
          <p className="mt-2 text-sm text-muted-foreground">
            RPE registrado: <strong className="text-foreground">{rpe}</strong>
            {rpeNote ? ` — ${rpeNote}` : ''}
          </p>
        ) : null}
        {sessionComment ? (
          <p className="mt-2 text-sm text-foreground">{sessionComment}</p>
        ) : null}
      </section>
    );
  }

  return (
    <section
      data-tour="alumno-session-finalize"
      className="rounded-xl border border-primary/30 bg-card p-5 shadow-sm"
    >
      <h2 className="text-sm font-semibold text-foreground">
        Finalizar sesión
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">
        RPE obligatorio (1 = muy fácil · 10 = máximo esfuerzo).
      </p>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          RPE *
        </p>
        <div className="mt-2 grid grid-cols-5 gap-2 sm:grid-cols-10">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onRpe(n)}
              className={`flex flex-col items-center rounded-lg border py-2 text-sm font-bold transition ${
                rpe === n
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background hover:border-primary/50'
              }`}
            >
              <span>{n}</span>
              <span className="text-base">{RPE_EMOJI[n]}</span>
            </button>
          ))}
        </div>
      </div>

      <label className="mt-4 block">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Nota del esfuerzo (opcional)
        </span>
        <input
          type="text"
          value={rpeNote}
          onChange={(e) => onRpeNote(e.target.value)}
          maxLength={300}
          className="mt-1 w-full rounded-lg border border-input px-3 py-2 text-sm"
          placeholder="Ej: me costó la última serie"
        />
      </label>

      <label className="mt-4 block">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Comentario de la sesión (opcional)
        </span>
        <textarea
          value={sessionComment}
          onChange={(e) => onSessionComment(e.target.value)}
          rows={3}
          maxLength={500}
          className="mt-1 w-full rounded-lg border border-input px-3 py-2 text-sm"
          placeholder="¿Cómo te sentiste en general?"
        />
      </label>

      {sessionComment.trim() ? (
        <label className="mt-3 flex cursor-pointer items-start gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm">
          <input
            type="checkbox"
            className="mt-0.5"
            checked={notifyProfessor}
            onChange={(e) => onNotifyProfessor(e.target.checked)}
          />
          <span className="text-foreground">
            Quiero que mi profesor vea este comentario
          </span>
        </label>
      ) : null}

      <Button
        type="button"
        className="mt-5 w-full sm:w-auto"
        size="lg"
        disabled={isPending || rpe === ''}
        onClick={onSubmit}
      >
        {isPending ? 'Guardando…' : 'Finalizar sesión'}
      </Button>
    </section>
  );
}
