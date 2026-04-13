import React, { useEffect } from 'react';
import { theme } from '../state/theme';

interface NotificationBalloonProps {
  title: string;
  message: string;
  icon?: string;
  onClose?: () => void;
}

export function NotificationBalloon({
  title,
  message,
  icon = 'ℹ️',
  onClose,
}: NotificationBalloonProps) {
  const version = theme.version;

  useEffect(() => {
    const timeout = setTimeout(() => onClose?.(), 8000);
    return () => clearTimeout(timeout);
  }, [onClose]);

  return (
    <div className={`balloon ${version === 'win98' ? 'win98' : ''} ${version === 'vista' ? 'vista' : ''}`}>
      <div className="balloon-header">
        <span className="balloon-icon">{icon}</span>
        <span className="balloon-title">{title}</span>
        <button className="balloon-close" onClick={onClose}>✕</button>
      </div>
      <div className="balloon-body">{message}</div>
      <div className="balloon-arrow" />
    </div>
  );
}
