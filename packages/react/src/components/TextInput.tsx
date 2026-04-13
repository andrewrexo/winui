import React from 'react';

interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function TextInput({ label, value = '', onChange, ...rest }: TextInputProps) {
  return (
    <div className="text-input-wrapper">
      {label && <label className="input-label">{label}</label>}
      <input
        className="win-input"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        {...rest}
      />
    </div>
  );
}
