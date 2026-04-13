import React from 'react';
import { theme } from '../state/theme';

interface AddressBarProps {
  value: string;
  onChange?: (value: string) => void;
  icon?: string;
  readOnly?: boolean;
  onNavigate?: (value: string) => void;
}

export function AddressBar({
  value,
  onChange,
  icon = '📁',
  readOnly = false,
  onNavigate,
}: AddressBarProps) {
  const version = theme.version;

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') onNavigate?.(value);
  }

  return (
    <div className={`address-bar ${version === 'win98' ? 'win98' : ''} ${version === 'vista' ? 'vista' : ''}`}>
      <span className="addr-label">Address</span>
      <div className="addr-input">
        <span className="addr-icon">{icon}</span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          readOnly={readOnly}
          onKeyDown={handleKeyDown}
        />
      </div>
      <button className="addr-go" onClick={() => onNavigate?.(value)}>
        Go <span className="go-arrow">→</span>
      </button>
    </div>
  );
}
