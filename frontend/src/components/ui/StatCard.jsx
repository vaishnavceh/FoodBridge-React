import React from 'react';
import Card from './Card';

export const StatCard = ({ title, value, icon: Icon, color = 'amber', subtitle }) => {
  const colors = {
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    blue: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    green: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20'
  };

  return (
    <Card className="flex items-center gap-5">
      {Icon && (
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${colors[color] || colors.amber}`}
        >
          <Icon className="w-7 h-7" />
        </div>
      )}
      <div>
        <h4 className="text-3xl font-extrabold text-white tracking-tight">{value}</h4>
        <p className="text-sm font-semibold text-slate-400">{title}</p>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
    </Card>
  );
};

export default StatCard;
