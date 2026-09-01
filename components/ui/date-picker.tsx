'use client';

import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  formatSponsorDay,
  parseSponsorDay,
  toSponsorDay,
} from '@/lib/sponsors/vigencia';
import { cn } from '@/lib/utils';

interface DatePickerFieldProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function DatePickerField({
  id,
  value,
  onChange,
  placeholder = 'Elegí una fecha',
}: DatePickerFieldProps) {
  const selected = parseSponsorDay(value);

  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          className={cn(
            'w-full justify-start font-normal',
            !value && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className="size-4" />
          {value ? formatSponsorDay(value) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => onChange(date ? toSponsorDay(date) : '')}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
