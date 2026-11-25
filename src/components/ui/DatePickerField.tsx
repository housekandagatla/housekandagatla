import { useEffect, useRef, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, parseISO, isValid } from 'date-fns';
import { CalendarDays } from 'lucide-react';
import 'react-day-picker/style.css';

type DatePickerFieldProps = {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  placeholder?: string;
};

function parseValue(value: string) {
  if (!value) {
    return undefined;
  }
  const date = parseISO(value);
  return isValid(date) ? date : undefined;
}

export function DatePickerField({
  value,
  onChange,
  id,
  placeholder = 'Pick a date',
}: DatePickerFieldProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = parseValue(value);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div className="kds-datepicker" ref={rootRef}>
      <button
        id={id}
        type="button"
        className="kds-datepicker-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span className={selected ? 'kds-datepicker-value' : 'kds-datepicker-placeholder'}>
          {selected ? format(selected, 'MMM d, yyyy') : placeholder}
        </span>
        <CalendarDays size={16} strokeWidth={1.8} />
      </button>

      {open ? (
        <div className="kds-datepicker-popover" role="dialog" aria-label="Choose date">
          <DayPicker
            mode="single"
            selected={selected}
            captionLayout="dropdown"
            startMonth={new Date(1920, 0)}
            endMonth={new Date()}
            defaultMonth={selected ?? new Date(1990, 0)}
            onSelect={(date) => {
              onChange(date ? format(date, 'yyyy-MM-dd') : '');
              setOpen(false);
            }}
          />
          <div className="kds-datepicker-actions">
            <button
              type="button"
              className="kds-datepicker-clear"
              onClick={() => {
                onChange('');
                setOpen(false);
              }}
            >
              Clear
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
