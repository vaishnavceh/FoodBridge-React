import React from 'react';

export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-slate-800 text-slate-300 border-slate-700',
    available: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    claimed: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    completed: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    high: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    low: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    critical: 'bg-red-600/20 text-red-400 border-red-500/40 animate-pulse'
  };

  const selectedVariant = variants[variant.toLowerCase()] || variants.default;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${selectedVariant} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
