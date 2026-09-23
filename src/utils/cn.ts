import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number): string {
  if (isNaN(amount) || amount === undefined || amount === null) return '₹ 0';
  return '₹ ' + Math.round(amount).toLocaleString('en-IN');
}

export function formatCompactINR(amount: number): string {
  if (isNaN(amount) || amount === undefined || amount === null) return '₹ 0';
  if (Math.abs(amount) >= 10000000) {
    return `₹ ${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (Math.abs(amount) >= 100000) {
    return `₹ ${(amount / 100000).toFixed(2)} L`;
  }
  return formatINR(amount);
}

export function formatCurrency(amount: number, compact = true): string {
  return compact ? formatCompactINR(amount) : formatINR(amount);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}
