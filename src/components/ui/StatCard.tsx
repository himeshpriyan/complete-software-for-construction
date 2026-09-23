import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  isPositive?: boolean;
  subtext?: string;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  trend,
  isPositive = true,
  subtext,
  icon,
  className,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-lg border border-slate-200/90 p-4 shadow-card hover:shadow-subtle transition-all duration-200 relative overflow-hidden',
        onClick && 'cursor-pointer hover:border-slate-300',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 truncate">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900 truncate">
              {value}
            </h3>
          </div>
        </div>

        {icon && (
          <div className="p-2.5 rounded-md bg-slate-50 border border-slate-100 text-slate-700 flex-shrink-0">
            {icon}
          </div>
        )}
      </div>

      {(change || subtext) && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          {change && (
            <div className="flex items-center gap-1">
              {trend === 'up' && (
                <span
                  className={cn(
                    'inline-flex items-center gap-0.5 font-medium',
                    isPositive ? 'text-emerald-700' : 'text-rose-700'
                  )}
                >
                  <TrendingUp className="h-3.5 w-3.5" />
                  {change}
                </span>
              )}
              {trend === 'down' && (
                <span
                  className={cn(
                    'inline-flex items-center gap-0.5 font-medium',
                    isPositive ? 'text-emerald-700' : 'text-rose-700'
                  )}
                >
                  <TrendingDown className="h-3.5 w-3.5" />
                  {change}
                </span>
              )}
              {trend === 'neutral' && (
                <span className="inline-flex items-center gap-0.5 font-medium text-slate-600">
                  <Minus className="h-3.5 w-3.5" />
                  {change}
                </span>
              )}
              {!trend && <span className="font-medium text-slate-700">{change}</span>}
            </div>
          )}

          {subtext && <span className="text-slate-400 text-[11px] truncate">{subtext}</span>}
        </div>
      )}
    </div>
  );
};
