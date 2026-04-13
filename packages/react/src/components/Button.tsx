import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary';
  children: React.ReactNode;
}

export function Button({ variant = 'default', children, className = '', ...rest }: ButtonProps) {
  return (
    <button className={`win-btn ${variant === 'primary' ? 'primary' : ''} ${className}`} {...rest}>
      {children}
    </button>
  );
}
