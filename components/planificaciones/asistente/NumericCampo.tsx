'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  clampToStep,
  formatNumericValue,
  parseNumericDraft,
  sanitizeNumericDraft,
} from '@/lib/planification/numeric-input';
import { cn } from '@/lib/utils';

interface Props {
  label: string;
  value?: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  inputClassName?: string;
}

export function NumericCampo({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  inputClassName,
}: Props) {
  const allowDecimal = step < 1;
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState('');

  const display = focused
    ? draft
    : value === undefined
      ? ''
      : formatNumericValue(value, step);

  function commit(raw: string) {
    const parsed = parseNumericDraft(raw);
    const next = clampToStep(parsed ?? value ?? min, min, max, step);
    onChange(next);
    setDraft(formatNumericValue(next, step));
  }

  function bump(direction: 1 | -1) {
    const current = focused
      ? (parseNumericDraft(draft) ?? value ?? min)
      : (value ?? min);
    const next = clampToStep(current + direction * step, min, max, step);
    onChange(next);
    setDraft(formatNumericValue(next, step));
  }

  return (
    <label className="text-xs">
      <span className="font-medium text-foreground">{label}</span>
      <div className="relative mt-0.5">
        <input
          type="text"
          inputMode={allowDecimal ? 'decimal' : 'numeric'}
          pattern={allowDecimal ? undefined : '[0-9]*'}
          enterKeyHint="done"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          value={display}
          onFocus={() => {
            setFocused(true);
            setDraft(
              value === undefined ? '' : formatNumericValue(value, step),
            );
          }}
          onBlur={() => {
            commit(draft);
            setFocused(false);
          }}
          onChange={(e) => {
            setDraft(sanitizeNumericDraft(e.target.value, allowDecimal));
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowUp') {
              e.preventDefault();
              bump(1);
            } else if (e.key === 'ArrowDown') {
              e.preventDefault();
              bump(-1);
            }
          }}
          className={cn(
            'w-full rounded border border-primary/30 bg-card py-1.5 pl-1.5 pr-6 text-base sm:text-sm',
            inputClassName,
          )}
        />
        <div className="absolute inset-y-0 right-0 flex w-5 flex-col overflow-hidden rounded-r border-l border-primary/20">
          <button
            type="button"
            tabIndex={-1}
            aria-label={`Aumentar ${label}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => bump(1)}
            className="flex flex-1 items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <ChevronUp className="size-3" />
          </button>
          <button
            type="button"
            tabIndex={-1}
            aria-label={`Disminuir ${label}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => bump(-1)}
            className="flex flex-1 items-center justify-center border-t border-primary/20 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <ChevronDown className="size-3" />
          </button>
        </div>
      </div>
    </label>
  );
}
