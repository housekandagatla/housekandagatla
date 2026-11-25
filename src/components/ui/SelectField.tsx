import * as Select from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';

export type SelectOption = {
  value: string;
  label: string;
};

type SelectFieldProps = {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  'aria-label'?: string;
};

export function SelectField({
  value,
  onValueChange,
  options,
  placeholder = '',
  required = false,
  disabled = false,
  id,
  'aria-label': ariaLabel,
}: SelectFieldProps) {
  return (
    <Select.Root
      value={value || undefined}
      onValueChange={onValueChange}
      required={required}
      disabled={disabled}
    >
      <Select.Trigger
        id={id}
        className="kds-select-trigger"
        aria-label={ariaLabel}
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon className="kds-select-icon">
          <ChevronDown size={16} strokeWidth={1.8} />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content className="kds-select-content" position="popper" sideOffset={4}>
          <Select.Viewport className="kds-select-viewport">
            {options.map((option) => (
              <Select.Item
                key={option.value || '__empty'}
                value={option.value || '__empty'}
                className="kds-select-item"
              >
                <Select.ItemText>{option.label}</Select.ItemText>
                <Select.ItemIndicator className="kds-select-check">
                  <Check size={14} strokeWidth={2} />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
