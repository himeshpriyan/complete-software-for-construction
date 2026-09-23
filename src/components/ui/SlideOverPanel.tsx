import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SlideOverPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-2xl',
};

export const SlideOverPanel: React.FC<SlideOverPanelProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'lg',
}) => {
  // Prevent body scrolling when slide-over is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
      />

      <div className="fixed inset-0 flex justify-end pointer-events-none">
        {/*
          Panel Container:
          On Mobile (< sm): Slides up from bottom as a Bottom Sheet
          On Desktop (>= sm): Slides in from right as a SlideOver Panel
        */}
        <div
          className={cn(
            'pointer-events-auto w-full bg-white shadow-2xl flex flex-col',
            'transition-transform transform duration-300 ease-in-out',
            // Mobile bottom sheet styles
            'fixed bottom-0 left-0 right-0 max-h-[90vh] rounded-t-2xl sm:relative sm:bottom-auto sm:left-auto sm:right-auto sm:max-h-full sm:h-full sm:rounded-none',
            // Desktop width
            sizeClasses[size]
          )}
        >
          {/* Mobile Drag Indicator */}
          <div className="sm:hidden flex justify-center pt-3 pb-1">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
          </div>

          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-start justify-between gap-3 bg-slate-50/50">
            <div className="space-y-0.5">
              <h2 className="text-lg font-bold text-slate-900">{title}</h2>
              {description && <p className="text-xs text-slate-500">{description}</p>}
            </div>

            <button
              onClick={onClose}
              aria-label="Close panel"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="p-5 overflow-y-auto flex-1 space-y-4">
            {children}
          </div>

          {/* Optional Action Footer */}
          {footer && (
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 pb-safe">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
