import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, HardHat, CheckCircle2, Menu, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Sidebar } from './Sidebar';
import { cn } from '../../utils/cn';

export const MobileNav: React.FC = () => {
  const { isMobileDrawerOpen, setMobileDrawerOpen } = useAppStore();

  return (
    <>
      {/* Native-style Mobile Bottom Tab Bar (Visible only on screens < md) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900 border-t border-slate-800 pb-safe shadow-2xl">
        <div className="grid grid-cols-4 h-16 items-center px-1">
          {/* 1. Home / Dashboard */}
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center h-full min-h-[44px] transition-colors',
                isActive ? 'text-amber-500 font-semibold' : 'text-slate-400 hover:text-slate-200'
              )
            }
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-[10px] mt-1 tracking-tight">Home</span>
          </NavLink>

          {/* 2. Projects */}
          <NavLink
            to="/projects"
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center h-full min-h-[44px] transition-colors',
                isActive ? 'text-amber-500 font-semibold' : 'text-slate-400 hover:text-slate-200'
              )
            }
          >
            <HardHat className="h-5 w-5" />
            <span className="text-[10px] mt-1 tracking-tight">Projects</span>
          </NavLink>

          {/* 3. Tasks */}
          <NavLink
            to="/projects/tasks"
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center h-full min-h-[44px] transition-colors',
                isActive ? 'text-amber-500 font-semibold' : 'text-slate-400 hover:text-slate-200'
              )
            }
          >
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-[10px] mt-1 tracking-tight">Tasks</span>
          </NavLink>

          {/* 4. More / Drawer Trigger */}
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="flex flex-col items-center justify-center h-full min-h-[44px] text-slate-400 hover:text-slate-200 transition-colors"
            aria-label="Open full menu"
          >
            <Menu className="h-5 w-5" />
            <span className="text-[10px] mt-1 tracking-tight">More</span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer (Full Navigation Slider from Left) */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden overflow-hidden">
          {/* Backdrop */}
          <div
            onClick={() => setMobileDrawerOpen(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
          />

          <div className="fixed inset-y-0 left-0 max-w-xs w-4/5 bg-slate-900 shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-200">
            {/* Drawer Close Button */}
            <div className="p-3 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Full System Navigation
              </span>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Render full sidebar inside drawer */}
            <div className="flex-1 overflow-y-auto">
              <Sidebar isMobileDrawer={true} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
