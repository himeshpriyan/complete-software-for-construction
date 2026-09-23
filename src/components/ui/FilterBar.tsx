import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
  selectedValue: string;
  onChange: (value: string) => void;
}

interface FilterBarProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
  filterGroups?: FilterGroup[];
  onResetFilters?: () => void;
  hasActiveFilters?: boolean;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery = '',
  onSearchChange,
  searchPlaceholder = 'Filter records...',
  filterGroups = [],
  onResetFilters,
  hasActiveFilters = false,
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-white p-3 rounded-lg border border-slate-200/90 shadow-card flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3',
        className
      )}
    >
      <div className="flex flex-1 items-center gap-2 flex-wrap">
        {onSearchChange && (
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:bg-white text-slate-800 placeholder:text-slate-400 transition-all"
            />
          </div>
        )}

        {filterGroups.map((group) => (
          <div key={group.id} className="relative">
            <select
              value={group.selectedValue}
              onChange={(e) => group.onChange(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 cursor-pointer"
            >
              {group.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {group.label}: {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center">
        {hasActiveFilters && onResetFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-1 rounded hover:bg-rose-50 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            Reset Filters
          </button>
        )}

        <div className="hidden sm:flex items-center text-slate-400 text-xs gap-1 pl-2 border-l border-slate-200">
          <Filter className="h-3.5 w-3.5" />
          <span>Quick Filters</span>
        </div>
      </div>
    </div>
  );
};
