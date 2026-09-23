import React, { useState, useMemo } from 'react';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FolderX,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { ColumnDef } from '../../types';

interface DataTableProps<T extends { id: string }> {
  data: T[];
  columns: ColumnDef<T>[];
  pageSize?: number;
  searchPlaceholder?: string;
  searchable?: boolean;
  onRowClick?: (item: T) => void;
  renderMobileCard?: (item: T, index: number) => React.ReactNode;
  emptyMessage?: string;
  emptySubtext?: string;
  actionButton?: React.ReactNode;
  className?: string;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  pageSize = 10,
  searchPlaceholder = 'Search records...',
  searchable = true,
  onRowClick,
  renderMobileCard,
  emptyMessage = 'No records found',
  emptySubtext = 'Try adjusting your search query or filters.',
  actionButton,
  className,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    const q = searchQuery.toLowerCase();
    return data.filter((item) =>
      Object.entries(item).some(([key, val]) => {
        if (typeof val === 'string' || typeof val === 'number') {
          return String(val).toLowerCase().includes(q);
        }
        return false;
      })
    );
  }, [data, searchQuery]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortKey];
      const bVal = (b as Record<string, unknown>)[sortKey];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      if (aStr < bStr) return sortDirection === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortKey, sortDirection]);

  // Paginate data
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortKey(null);
        setSortDirection('asc');
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };

  return (
    <div className={cn('bg-white rounded-lg border border-slate-200 shadow-card flex flex-col', className)}>
      {/* Controls Bar: Search & Actions */}
      {(searchable || actionButton) && (
        <div className="p-3.5 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {searchable ? (
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
              />
            </div>
          ) : (
            <div />
          )}

          {actionButton && <div className="flex items-center gap-2">{actionButton}</div>}
        </div>
      )}

      {/* Desktop Table View (≥ md) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  style={{ width: col.width }}
                  className={cn(
                    'py-2.5 px-4 select-none',
                    col.sortable && 'cursor-pointer hover:text-slate-800 hover:bg-slate-100/70 transition-colors',
                    col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                  )}
                  onClick={() => col.sortable && handleSort(String(col.key))}
                >
                  <div
                    className={cn(
                      'inline-flex items-center gap-1.5',
                      col.align === 'right' && 'justify-end w-full'
                    )}
                  >
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span className="text-slate-400">
                        {sortKey === String(col.key) ? (
                          sortDirection === 'asc' ? (
                            <ArrowUp className="h-3 w-3 text-amber-600" />
                          ) : (
                            <ArrowDown className="h-3 w-3 text-amber-600" />
                          )
                        ) : (
                          <ArrowUpDown className="h-3 w-3 opacity-60" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {paginatedData.length > 0 ? (
              paginatedData.map((item, rowIndex) => (
                <tr
                  key={item.id}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={cn(
                    'hover:bg-slate-50/80 transition-colors',
                    onRowClick && 'cursor-pointer'
                  )}
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className={cn(
                        'py-3 px-4',
                        col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                      )}
                    >
                      {col.render
                        ? col.render(item, rowIndex)
                        : String((item as Record<string, unknown>)[String(col.key)] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-14 text-center">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                    <div className="h-12 w-12 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 mb-3 shadow-2xs">
                      <FolderX className="h-6 w-6" />
                    </div>
                    <p className="font-bold text-slate-800 text-sm">{emptyMessage}</p>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{emptySubtext}</p>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="mt-3 text-xs font-semibold text-amber-600 hover:text-amber-700 underline cursor-pointer"
                      >
                        Clear search filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Stack Fallback (< md) */}
      <div className="block md:hidden divide-y divide-slate-100">
        {paginatedData.length > 0 ? (
          paginatedData.map((item, index) => {
            if (renderMobileCard) {
              return (
                <div
                  key={item.id}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={cn(
                    'p-4 active:bg-slate-50 transition-colors min-h-[44px]',
                    onRowClick && 'cursor-pointer'
                  )}
                >
                  {renderMobileCard(item, index)}
                </div>
              );
            }

            // Default card layout if no custom mobile card renderer provided
            const primaryCol = columns[0];
            const secondaryCol = columns[1];
            const otherCols = columns.slice(2);

            return (
              <div
                key={item.id}
                onClick={() => onRowClick && onRowClick(item)}
                className={cn(
                  'p-4 space-y-2.5 active:bg-slate-50 transition-colors min-h-[44px]',
                  onRowClick && 'cursor-pointer'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-semibold text-sm text-slate-900">
                      {primaryCol.render
                        ? primaryCol.render(item, index)
                        : String((item as Record<string, unknown>)[String(primaryCol.key)] ?? '')}
                    </h4>
                    {secondaryCol && (
                      <div className="text-xs text-slate-500 mt-0.5">
                        {secondaryCol.render
                          ? secondaryCol.render(item, index)
                          : String((item as Record<string, unknown>)[String(secondaryCol.key)] ?? '')}
                      </div>
                    )}
                  </div>
                </div>

                {otherCols.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 text-slate-600">
                    {otherCols.map((col, cIdx) => (
                      <div key={cIdx} className="space-y-0.5">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-medium">
                          {col.header}
                        </span>
                        <span className="font-medium text-slate-800">
                          {col.render
                            ? col.render(item, index)
                            : String((item as Record<string, unknown>)[String(col.key)] ?? '—')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="py-12 px-4 text-center">
            <div className="flex flex-col items-center justify-center max-w-xs mx-auto">
              <div className="h-11 w-11 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 mb-3 shadow-2xs">
                <FolderX className="h-5 w-5" />
              </div>
              <p className="font-bold text-slate-800 text-sm">{emptyMessage}</p>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{emptySubtext}</p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-3 text-xs font-semibold text-amber-600 hover:text-amber-700 underline cursor-pointer"
                >
                  Clear search filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div className="text-center sm:text-left">
          Showing{' '}
          <span className="font-semibold text-slate-700">
            {sortedData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
          </span>{' '}
          to{' '}
          <span className="font-semibold text-slate-700">
            {Math.min(currentPage * pageSize, sortedData.length)}
          </span>{' '}
          of <span className="font-semibold text-slate-700">{sortedData.length}</span> records
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            aria-label="First page"
            className="p-1 rounded border border-slate-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 min-h-[32px] min-w-[32px] flex items-center justify-center"
          >
            <ChevronsLeft className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
            className="p-1 rounded border border-slate-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 min-h-[32px] min-w-[32px] flex items-center justify-center"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>

          <span className="px-2 text-slate-700 font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            aria-label="Next page"
            className="p-1 rounded border border-slate-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 min-h-[32px] min-w-[32px] flex items-center justify-center"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
            aria-label="Last page"
            className="p-1 rounded border border-slate-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 min-h-[32px] min-w-[32px] flex items-center justify-center"
          >
            <ChevronsRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
