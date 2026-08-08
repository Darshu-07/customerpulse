import React from 'react';
import { LucideIcon } from 'lucide-react';

export const RiskBadge: React.FC<{ level: 'Low' | 'Medium' | 'High' | 'Critical' }> = ({ level }) => {
  const styles = {
    Low: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    Medium: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    High: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    Critical: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[level]}`}>
      {level}
    </span>
  );
};

export const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8 w-full h-full min-h-[200px]">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
  </div>
);

export const EmptyState: React.FC<{ icon: LucideIcon; title: string; description: string }> = ({ 
  icon: Icon, title, description 
}) => (
  <div className="flex flex-col items-center justify-center p-12 text-center h-full">
    <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
      <Icon className="w-8 h-8 text-slate-400" />
    </div>
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-slate-400 max-w-sm">{description}</p>
  </div>
);
