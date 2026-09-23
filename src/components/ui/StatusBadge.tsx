import React from 'react';
import { cn } from '../../utils/cn';
import { StatusVariant } from '../../types';

interface StatusBadgeProps {
  status?: string;
  variant?: StatusVariant;
  label?: string;
  dot?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

const variantStyles: Record<StatusVariant, { bg: string; text: string; border: string; dot: string }> = {
  success: {
    bg: 'bg-emerald-50 text-emerald-700',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
  },
  warning: {
    bg: 'bg-amber-50 text-amber-800',
    text: 'text-amber-800',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
  },
  danger: {
    bg: 'bg-rose-50 text-rose-700',
    text: 'text-rose-700',
    border: 'border-rose-200',
    dot: 'bg-rose-500',
  },
  info: {
    bg: 'bg-sky-50 text-sky-700',
    text: 'text-sky-700',
    border: 'border-sky-200',
    dot: 'bg-sky-500',
  },
  neutral: {
    bg: 'bg-slate-100 text-slate-600',
    text: 'text-slate-600',
    border: 'border-slate-200',
    dot: 'bg-slate-400',
  },
};

export const resolveStatusVariant = (status?: string): StatusVariant => {
  if (!status) return 'neutral';
  const s = status.toLowerCase();

  if (
    s.includes('active') ||
    s.includes('approved') ||
    s.includes('paid') ||
    s.includes('on-track') ||
    s.includes('completed') ||
    s.includes('verified')
  ) {
    return 'success';
  }

  if (
    s.includes('pending') ||
    s.includes('at-risk') ||
    s.includes('review') ||
    s.includes('prospect') ||
    s.includes('follow-up')
  ) {
    return 'warning';
  }

  if (
    s.includes('delayed') ||
    s.includes('overdue') ||
    s.includes('rejected') ||
    s.includes('halted') ||
    s.includes('critical') ||
    s.includes('accident')
  ) {
    return 'danger';
  }

  if (
    s.includes('in-progress') ||
    s.includes('ongoing') ||
    s.includes('scheduled') ||
    s.includes('lead')
  ) {
    return 'info';
  }

  return 'neutral';
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant,
  label,
  dot = true,
  size = 'md',
  className,
}) => {
  const displayLabel = label || status || 'Unknown';
  const resolvedVariant = variant || resolveStatusVariant(status);
  const style = variantStyles[resolvedVariant];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium border uppercase tracking-wider',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-xs',
        style.bg,
        style.border,
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'inline-block rounded-full animate-pulse',
            size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2',
            style.dot
          )}
        />
      )}
      <span>{displayLabel}</span>
    </span>
  );
};
