import React from 'react';
import { theme } from '../state/theme';

interface TitleBarProps {
  title: string;
  icon?: string;
  active?: boolean;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
}

export function TitleBar({
  title,
  icon = '',
  active = true,
  onMinimize,
  onMaximize,
  onClose,
}: TitleBarProps) {
  const version = theme.version;

  return (
    <div
      className={`title-bar ${active ? 'active' : ''} ${version}`}
      onDoubleClick={onMaximize}
    >
      {icon && <span className="title-icon">{icon}</span>}
      <span className="title-text">{title}</span>
      <div className="window-controls">
        {version === 'win98' ? (
          <>
            <div className="win98-btn-group">
              {onMinimize && (
                <button className="ctrl-btn" onClick={onMinimize} aria-label="Minimize">
                  <svg viewBox="0 0 6 2" width="6" height="2"><rect width="6" height="2" fill="currentColor"/></svg>
                </button>
              )}
              {onMaximize && (
                <button className="ctrl-btn" onClick={onMaximize} aria-label="Maximize">
                  <svg viewBox="0 0 9 9" width="7" height="7"><rect x="0" y="0" width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2"/><line x1="0" y1="2" x2="9" y2="2" stroke="currentColor" strokeWidth="2"/></svg>
                </button>
              )}
            </div>
            {onClose && (
              <button className="ctrl-btn btn-close" onClick={onClose} aria-label="Close">
                <svg viewBox="0 0 8 7" width="7" height="6"><path d="M0,0 L3,3 L0,6 M8,0 L5,3 L8,6" stroke="currentColor" strokeWidth="1.5" fill="none"/><line x1="1" y1="3" x2="7" y2="3" stroke="currentColor" strokeWidth="1.5"/></svg>
              </button>
            )}
          </>
        ) : (
          <>
            {onMinimize && (
              <button className="ctrl-btn" onClick={onMinimize} aria-label="Minimize">
                <svg viewBox="0 0 11 11" width="9" height="9"><rect x="2" y="8" width="7" height="2" fill="currentColor" rx="0.3"/></svg>
              </button>
            )}
            {onMaximize && (
              <button className="ctrl-btn" onClick={onMaximize} aria-label="Maximize">
                <svg viewBox="0 0 11 11" width="9" height="9"><rect x="2" y="2" width="7" height="7" fill="none" stroke="currentColor" strokeWidth="1.2" rx="0.3"/><rect x="2" y="2" width="7" height="2.5" fill="currentColor" rx="0.3"/></svg>
              </button>
            )}
            {onClose && (
              <button className="ctrl-btn btn-close" onClick={onClose} aria-label="Close">
                <svg viewBox="0 0 11 11" width="9" height="9"><line x1="2.5" y1="2.5" x2="8.5" y2="8.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><line x1="8.5" y1="2.5" x2="2.5" y2="8.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
