import React from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: any;
  trend?: string | number;
  trendDirection?: 'up' | 'down' | 'neutral';
  trendLabel?: string;
  color?: string;
}

export const KPICard: React.FC<KPICardProps> = ({ 
  title, value, subtitle, icon: Icon, trend, trendDirection, trendLabel, color = 'indigo' 
}) => {
  const getTrendColor = () => {
    if (trendDirection === 'up') return 'text-emerald-500';
    if (trendDirection === 'down') return 'text-red-500';
    return 'text-slate-400';
  };

  const displayTrend = trend !== undefined ? (typeof trend === 'number' && trend > 0 ? `+${trend}%` : `${trend}%`) : null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <span className="text-slate-400 text-sm font-medium">{title}</span>
        <div className={`p-2 rounded-lg bg-${color}-500/10 text-${color}-400`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>
      <div className="mt-1">
        <h3 className="text-2xl font-bold text-white">{value}</h3>
      </div>
      {(trend !== undefined || subtitle || trendLabel) && (
        <div className="mt-3 flex items-center text-xs">
          {displayTrend && (
            <span className={`font-medium ${getTrendColor()} mr-2`}>
              {displayTrend}
            </span>
          )}
          {(subtitle || trendLabel) && <span className="text-slate-500">{subtitle || trendLabel}</span>}
        </div>
      )}
    </div>
  );
};
