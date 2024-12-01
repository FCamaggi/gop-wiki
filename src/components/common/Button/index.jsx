import React from 'react';

export function Button({
  children,
  variant = 'default',
  className = '',
  ...props
}) {
  const variants = {
    default: 'bg-slate-900 text-white hover:bg-slate-800',
    ghost: 'bg-transparent hover:bg-slate-100',
    outline: 'border border-slate-200 hover:bg-slate-100',
  };

  return (
    <button
      className={`
        px-4 py-2 rounded-lg
        transition-colors duration-200
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
