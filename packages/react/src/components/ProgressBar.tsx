import React from 'react';

interface ProgressBarProps {
  value?: number;
  indeterminate?: boolean;
}

export function ProgressBar({ value = 0, indeterminate = false }: ProgressBarProps) {
  return (
    <div className="progress-outer" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div
        className={`progress-inner ${indeterminate ? 'indeterminate' : ''}`}
        style={indeterminate ? undefined : { width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
