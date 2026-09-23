import React from 'react';
import { cn } from '../../utils/cn';

interface AvatarProps {
  name: string;
  avatarUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  statusIndicator?: 'online' | 'offline' | 'busy';
  className?: string;
}

const sizeClasses = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-9 w-9 text-sm',
  lg: 'h-11 w-11 text-base',
  xl: 'h-14 w-14 text-lg',
};

const getInitials = (name: string): string => {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getColorFromName = (name: string): string => {
  const colors = [
    'bg-slate-700 text-white',
    'bg-amber-600 text-white',
    'bg-blue-600 text-white',
    'bg-emerald-600 text-white',
    'bg-indigo-600 text-white',
    'bg-rose-600 text-white',
    'bg-teal-600 text-white',
    'bg-violet-600 text-white',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export const Avatar: React.FC<AvatarProps> = ({
  name,
  avatarUrl,
  size = 'md',
  statusIndicator,
  className,
}) => {
  const initials = getInitials(name);
  const colorClass = getColorFromName(name);

  return (
    <div className="relative inline-flex flex-shrink-0">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          className={cn(
            'rounded-full object-cover border border-slate-200 shadow-sm',
            sizeClasses[size],
            className
          )}
        />
      ) : (
        <div
          className={cn(
            'rounded-full flex items-center justify-center font-medium shadow-sm border border-black/5 select-none',
            sizeClasses[size],
            colorClass,
            className
          )}
          title={name}
        >
          {initials}
        </div>
      )}

      {statusIndicator && (
        <span
          className={cn(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-white',
            size === 'xs' || size === 'sm' ? 'h-2 w-2' : 'h-2.5 w-2.5',
            statusIndicator === 'online' && 'bg-emerald-500',
            statusIndicator === 'busy' && 'bg-amber-500',
            statusIndicator === 'offline' && 'bg-slate-300'
          )}
        />
      )}
    </div>
  );
};
