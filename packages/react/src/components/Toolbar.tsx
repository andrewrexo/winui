import React from 'react';
import { theme } from '../state/theme';

export interface ToolbarButton {
  icon: string;
  label?: string;
  dropdown?: boolean;
  disabled?: boolean;
  action?: () => void;
}

export interface ToolbarGroup {
  buttons: ToolbarButton[];
}

interface ToolbarProps {
  groups: ToolbarGroup[];
}

export function Toolbar({ groups }: ToolbarProps) {
  const version = theme.version;

  return (
    <div className={`toolbar ${version === 'win98' ? 'win98' : ''} ${version === 'vista' ? 'vista' : ''}`}>
      {groups.map((group, gi) => (
        <React.Fragment key={gi}>
          {gi > 0 && <div className="tb-sep" />}
          <div className="tb-group">
            {group.buttons.map((btn, bi) => (
              <button
                key={bi}
                className="tb-btn"
                disabled={btn.disabled}
                onClick={btn.action}
                title={btn.label ?? ''}
              >
                <span className="tb-icon">{btn.icon}</span>
                {btn.label && <span className="tb-label">{btn.label}</span>}
                {btn.dropdown && <span className="tb-drop">▾</span>}
              </button>
            ))}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
